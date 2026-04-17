from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import docx
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
import joblib
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string
import os
import traceback
import requests

GEMINI_API_KEY = "AIzaSyBhSIGUf7obMZtOVwfpFKZc-jG7aKAngRo"

app = Flask(__name__)
CORS(app)

# Download NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except:
    pass

class ResumeAnalyzer:
    def __init__(self):
        self.required_sections = ['education', 'experience', 'skills', 'projects']
        self.action_verbs = [
            'managed', 'led', 'developed', 'implemented', 'created', 'analyzed',
            'designed', 'built', 'improved', 'optimized', 'increased', 'reduced'
        ]
        
        # Domain-specific technology stacks
        self.domain_tech_stacks = {
            'full_stack': {
                'name': 'Full Stack Development',
                'core_tech': ['react', 'node', 'mongodb', 'express', 'javascript', 'html', 'css'],
                'good_to_have': ['typescript', 'redux', 'graphql', 'aws', 'docker', 'next.js'],
                'irrelevant': ['spring', 'kotlin', 'swift', 'tensorflow', 'pytorch', 'hadoop']
            },
            'frontend': {
                'name': 'Frontend Development', 
                'core_tech': ['react', 'javascript', 'html', 'css', 'typescript', 'angular', 'vue'],
                'good_to_have': ['redux', 'sass', 'webpack', 'next.js', 'bootstrap'],
                'irrelevant': ['node', 'mongodb', 'spring', 'python', 'java', 'sql']
            },
            'backend': {
                'name': 'Backend Development',
                'core_tech': ['node', 'python', 'java', 'spring', 'sql', 'mongodb', 'postgresql'],
                'good_to_have': ['docker', 'aws', 'kubernetes', 'redis', 'graphql'],
                'irrelevant': ['react', 'angular', 'vue', 'css', 'html']
            },
            'data_science': {
                'name': 'Data Science',
                'core_tech': ['python', 'pandas', 'numpy', 'sql', 'machine learning', 'statistics'],
                'good_to_have': ['tensorflow', 'pytorch', 'scikit-learn', 'r', 'tableau', 'power bi'],
                'irrelevant': ['react', 'angular', 'vue', 'html', 'css']
            },
            'devops': {
                'name': 'DevOps',
                'core_tech': ['docker', 'kubernetes', 'aws', 'jenkins', 'linux', 'ci/cd'],
                'good_to_have': ['terraform', 'ansible', 'prometheus', 'grafana', 'azure'],
                'irrelevant': ['react', 'angular', 'html', 'css', 'ui/ux']
            }
        }
    
    def detect_domain(self, text):
        """
        Smart domain detection based on resume content
        """
        text_lower = text.lower()
        domain_scores = {
            'full_stack': 0,
            'frontend': 0,
            'backend': 0, 
            'data_science': 0,
            'devops': 0
        }
        
        # Score domains based on technology mentions
        for domain, stack in self.domain_tech_stacks.items():
            # Core tech gives higher scores
            for tech in stack['core_tech']:
                if tech in text_lower:
                    domain_scores[domain] += 3
            
            # Good-to-have tech gives medium scores  
            for tech in stack['good_to_have']:
                if tech in text_lower:
                    domain_scores[domain] += 2
            
            # Job title mentions
            domain_titles = {
                'full_stack': ['full stack', 'fullstack', 'mern', 'mean'],
                'frontend': ['frontend', 'front end', 'ui developer', 'react developer'],
                'backend': ['backend', 'back end', 'api developer', 'server side'],
                'data_science': ['data scientist', 'data analyst', 'machine learning', 'ml engineer'],
                'devops': ['devops', 'cloud engineer', 'sre', 'site reliability']
            }
            
            for title in domain_titles.get(domain, []):
                if title in text_lower:
                    domain_scores[domain] += 4
        
        # Find the domain with highest score
        detected_domain = max(domain_scores, key=domain_scores.get)
        
        # Only return domain if score is significant (at least 3 points)
        if domain_scores[detected_domain] >= 3:
            return detected_domain
        else:
            return 'general'  # No clear domain detected
    
    def analyze_tech_stack(self, text, domain):
        """
        Analyze technology stack for the detected domain
        """
        text_lower = text.lower()
        analysis = {
            'core_tech_present': [],
            'core_tech_missing': [],
            'good_tech_present': [],
            'domain_strength_score': 0
        }
        
        if domain == 'general' or domain not in self.domain_tech_stacks:
            return analysis
        
        domain_stack = self.domain_tech_stacks[domain]
        
        # Check core technologies
        core_tech_count = 0
        for tech in domain_stack['core_tech']:
            if tech in text_lower:
                analysis['core_tech_present'].append(tech)
                core_tech_count += 1
            else:
                analysis['core_tech_missing'].append(tech)
        
        # Check good-to-have technologies
        for tech in domain_stack['good_to_have']:
            if tech in text_lower:
                analysis['good_tech_present'].append(tech)
        
        # Calculate domain strength score (0-100)
        total_core_tech = len(domain_stack['core_tech'])
        if total_core_tech > 0:
            analysis['domain_strength_score'] = int((core_tech_count / total_core_tech) * 70)
        
        # Bonus for good-to-have tech
        analysis['domain_strength_score'] += min(30, len(analysis['good_tech_present']) * 5)
        
        return analysis
    
    def detect_links(self, text):
        """
        Detect existing links in the resume
        """
        links = {
            'linkedin': False,
            'github': False,
            'portfolio': False,
            'leetcode': False,
            'other_links': []
        }
        
        # LinkedIn patterns
        linkedin_patterns = [
            r'linkedin\.com/in/[\w\-]+',
            r'linkedin\.com/company/[\w\-]+',
            r'linkedin\.com/profile/[\w\-]+'
        ]
        
        # GitHub patterns
        github_patterns = [
            r'github\.com/[\w\-]+',
            r'github\.io/[\w\-]+'
        ]
        
        # Portfolio patterns
        portfolio_patterns = [
            r'[\w\-]+\.(com|io|dev|net|org)',
            r'portfolio\.(com|io|dev|net|org)'
        ]
        
        # LeetCode patterns
        leetcode_patterns = [
            r'leetcode\.com/[\w\-]+'
        ]
        
        # Find LinkedIn
        for pattern in linkedin_patterns:
            if re.search(pattern, text.lower()):
                links['linkedin'] = True
                break
        
        # Find GitHub
        for pattern in github_patterns:
            if re.search(pattern, text.lower()):
                links['github'] = True
                break
        
        # Find Portfolio (but exclude common company domains)
        company_domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'university.edu']
        portfolio_matches = re.findall(r'https?://([\w\-]+\.(com|io|dev|net|org))', text.lower())
        for match in portfolio_matches:
            domain = match[0]
            if not any(company in domain for company in company_domains) and not domain.startswith('www.'):
                links['portfolio'] = True
                break
        
        # Find LeetCode
        for pattern in leetcode_patterns:
            if re.search(pattern, text.lower()):
                links['leetcode'] = True
                break
        
        # Find other links
        url_pattern = r'https?://[^\s]+'
        all_urls = re.findall(url_pattern, text.lower())
        links['other_links'] = [url for url in all_urls if len(url) < 100]  # Filter out very long URLs
        
        return links

    def extract_text_from_pdf(self, file):
        try:
            file.seek(0)
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() or ""
            return text
        except Exception as e:
            print(f"PDF extraction error: {e}")
            return ""
    
    def extract_text_from_docx(self, file):
        try:
            file.seek(0)
            doc = docx.Document(file)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            print(f"DOCX extraction error: {e}")
            return ""
    
    def extract_features(self, text):
        features = {}
        
        if not text or len(text.strip()) == 0:
            return {
                'word_count': 0,
                'char_count': 0,
                'sentence_count': 0,
                'has_education': 0,
                'has_experience': 0,
                'has_skills': 0,
                'has_projects': 0,
                'has_email': 0,
                'has_phone': 0,
                'action_verb_count': 0,
                'quantification_count': 0,
                'tech_keyword_density': 0
            }
        
        features['word_count'] = len(text.split())
        features['char_count'] = len(text)
        features['sentence_count'] = len(re.split(r'[.!?]+', text))
        
        text_lower = text.lower()
        features['has_education'] = int(any(keyword in text_lower for keyword in ['education', 'degree', 'university', 'college']))
        features['has_experience'] = int(any(keyword in text_lower for keyword in ['experience', 'work', 'employment', 'internship']))
        features['has_skills'] = int(any(keyword in text_lower for keyword in ['skills', 'technical', 'programming', 'languages']))
        features['has_projects'] = int(any(keyword in text_lower for keyword in ['projects', 'portfolio', 'github']))
        
        features['has_email'] = int(bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)))
        features['has_phone'] = int(bool(re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)))
        
        try:
            words = word_tokenize(text_lower)
            features['action_verb_count'] = sum(1 for word in words if word in self.action_verbs)
        except:
            features['action_verb_count'] = 0
            
        features['quantification_count'] = len(re.findall(r'\b\d+%|\$\d+|\d+\+|\d+ years?', text))
        
        tech_keywords = ['python', 'java', 'javascript', 'sql', 'html', 'css', 'react', 'node', 'machine learning', 'data analysis']
        features['tech_keyword_density'] = sum(text_lower.count(keyword) for keyword in tech_keywords) / max(1, features['word_count'])
        
        return features
    
    def calculate_scores(self, features, text, domain_analysis):
        formatting_score = 0
        formatting_score += 20 if features['word_count'] > 200 and features['word_count'] < 800 else 10
        formatting_score += 15 * (features['has_education'] + features['has_experience'] + features['has_skills'] + features['has_projects'])
        formatting_score += 10 if features['has_email'] and features['has_phone'] else 0
        formatting_score = min(100, formatting_score)
        
        content_score = 0
        content_score += min(30, features['action_verb_count'] * 3)
        content_score += min(25, features['quantification_count'] * 5)
        content_score += min(20, features['tech_keyword_density'] * 100)
        content_score += 25 if features['word_count'] > 300 else 15
        content_score = min(100, content_score)
        
        ats_score = 0
        ats_score += 20 if features['has_education'] else 0
        ats_score += 20 if features['has_experience'] else 0
        ats_score += 20 if features['has_skills'] else 0
        ats_score += 15 if features['word_count'] > 200 else 5
        ats_score += 25 if features['action_verb_count'] > 3 else 10
        ats_score = min(100, ats_score)
        
        # Include domain strength in overall score
        domain_score = domain_analysis.get('domain_strength_score', 0)
        overall_score = int(0.25 * formatting_score + 0.35 * content_score + 0.25 * ats_score + 0.15 * domain_score)
        
        return {
            'overall_score': overall_score,
            'breakdown': {
                'formatting': {'label': 'Formatting & Structure', 'score': formatting_score},
                'content': {'label': 'Content Quality', 'score': content_score},
                'ats': {'label': 'ATS Optimization', 'score': ats_score},
                'domain': {'label': 'Domain Strength', 'score': domain_score}
            }
        }
    
    def generate_feedback(self, features, scores, text, domain, domain_analysis):
        strengths = []
        improvements = []
        suggestions = []
        
        text_lower = text.lower()
        
        # DETECT EXISTING LINKS
        existing_links = self.detect_links(text)
        print(f"Detected links: {existing_links}")
        
        # DOMAIN-SPECIFIC FEEDBACK
        if domain != 'general':
            domain_name = self.domain_tech_stacks[domain]['name']
            
            # Domain strengths
            if domain_analysis['domain_strength_score'] > 80:
                strengths.append(f"Strong {domain_name} profile with comprehensive tech stack")
            elif domain_analysis['domain_strength_score'] > 60:
                strengths.append(f"Good {domain_name} foundation with key technologies")
            
            if len(domain_analysis['core_tech_present']) > 0:
                core_tech_str = ', '.join(domain_analysis['core_tech_present'][:3])
                strengths.append(f"Core {domain_name} skills: {core_tech_str}")
            
            if len(domain_analysis['good_tech_present']) > 2:
                good_tech_str = ', '.join(domain_analysis['good_tech_present'][:2])
                strengths.append(f"Advanced skills in: {good_tech_str}")
            
            # Domain improvements (ONLY RELEVANT TO DOMAIN)
            if len(domain_analysis['core_tech_missing']) > 0:
                missing_core = domain_analysis['core_tech_missing'][:2]
                improvements.append(f"Consider adding core {domain_name} technologies: {', '.join(missing_core)}")
            
            if domain_analysis['domain_strength_score'] < 50:
                improvements.append(f"Strengthen your {domain_name} profile with more domain-specific technologies")
        
        # LINK-RELATED STRENGTHS
        if existing_links['linkedin']:
            strengths.append("Great! LinkedIn profile included - recruiters can learn more about you")
        
        if existing_links['github']:
            if domain in ['full_stack', 'frontend', 'backend', 'devops']:
                strengths.append("GitHub profile included - perfect for showcasing your code")
            else:
                strengths.append("GitHub profile included - shows your technical work")
        
        if existing_links['portfolio']:
            strengths.append("Personal portfolio website - excellent for demonstrating your work")
        
        if existing_links['leetcode']:
            strengths.append("LeetCode profile - shows dedication to technical interview preparation")
        
        # GENERAL STRENGTHS
        if features['action_verb_count'] > 5:
            strengths.append(f"Excellent use of {features['action_verb_count']} action verbs")
        elif features['action_verb_count'] > 2:
            strengths.append("Good action verb usage in bullet points")
            
        if features['quantification_count'] > 3:
            strengths.append(f"Strong quantification with {features['quantification_count']} measurable achievements")
        elif features['quantification_count'] > 0:
            strengths.append("Some good use of numbers and metrics")
        
        # SMART IMPROVEMENTS BASED ON EXISTING LINKS
        if not existing_links['linkedin']:
            improvements.append("Add your LinkedIn profile - essential for professional networking")
        else:
            # If LinkedIn exists, suggest improvements
            if 'linkedin.com/in/' in text_lower:
                improvements.append("Ensure your LinkedIn profile is updated with current projects and skills")
        
        # Domain-specific link suggestions
        if domain in ['full_stack', 'frontend', 'backend', 'devops']:
            if not existing_links['github']:
                improvements.append("Add GitHub profile to showcase your coding projects")
            else:
                improvements.append("Add more recent projects to your GitHub with detailed READMEs")
        
        if domain in ['data_science']:
            if not existing_links['github']:
                improvements.append("Add GitHub with data science notebooks and projects")
            if not existing_links['portfolio']:
                improvements.append("Consider creating a portfolio to showcase data visualizations")
        
        # GENERAL IMPROVEMENTS
        if features['action_verb_count'] < 2:
            improvements.append(f"Only {features['action_verb_count']} action verbs found - aim for 5+")
        
        if features['quantification_count'] == 0:
            improvements.append("No quantifiable achievements - add numbers like 'increased efficiency by 25%'")
        
        if not features['has_education']:
            improvements.append("Missing Education section")
        
        if not features['has_experience']:
            improvements.append("Missing Experience section")
        
        if not features['has_skills']:
            improvements.append("Missing dedicated Skills section")
        
        # SMART SUGGESTIONS BASED ON EXISTING CONTENT
        suggestions = []
        
        # Domain-specific smart suggestions
        if domain != 'general':
            domain_name = self.domain_tech_stacks[domain]['name']
            
            if existing_links['github'] and domain in ['full_stack', 'frontend', 'backend']:
                suggestions.append(f"Pin your best {domain_name} projects on GitHub for quick visibility")
            else:
                suggestions.append(f"Tailor your resume specifically for {domain_name} roles")
            
            # Tech-specific suggestions
            if domain == 'full_stack':
                if 'react' in domain_analysis['core_tech_present'] and 'node' in domain_analysis['core_tech_present']:
                    if existing_links['github']:
                        suggestions.append("Create a full MERN stack project to showcase end-to-end skills")
                    else:
                        suggestions.append("Build a MERN stack project and host it on GitHub")
                        
            elif domain == 'data_science':
                if existing_links['github']:
                    suggestions.append("Add Jupyter notebooks with data analysis projects to your GitHub")
                else:
                    suggestions.append("Create a GitHub portfolio with data science projects and visualizations")
        
        # Link enhancement suggestions
        if existing_links['linkedin'] and existing_links['github']:
            suggestions.append("Add your GitHub link to your LinkedIn profile for better visibility")
        
        if existing_links['portfolio'] and existing_links['github']:
            suggestions.append("Link your GitHub projects directly from your portfolio website")
        
        if not existing_links['leetcode'] and domain in ['full_stack', 'backend', 'data_science']:
            suggestions.append("Consider adding LeetCode profile to showcase problem-solving skills")
        
        # Fallback suggestions if we don't have enough
        default_suggestions = [
            "Quantify achievements with specific numbers and metrics",
            "Use consistent formatting and professional fonts throughout",
            "Get your resume reviewed by industry professionals"
        ]
        
        # Add default suggestions if we need more
        if len(suggestions) < 2:
            suggestions.extend(default_suggestions[:2-len(suggestions)])
        
        # Ensure we have feedback
        if not strengths:
            if existing_links['linkedin'] or existing_links['github']:
                strengths.append("Good professional presence with online profiles")
            else:
                strengths.append("Good foundation - ready for optimization")
        
        if not improvements:
            improvements.append("Review each section for more specific achievements")
        
        return {
            'strengths': strengths[:4],
            'improvements': improvements[:4],
            'suggestions': suggestions[:4],
            'domain_analysis': {
                'detected_domain': domain,
                'domain_name': self.domain_tech_stacks.get(domain, {}).get('name', 'General'),
                'tech_stack': domain_analysis,
                'links_detected': existing_links
            }
        }
    
    def analyze_resume(self, file):
        print(f"Analyzing file: {file.filename}")
        
        filename = file.filename.lower()
        text = ""
        
        if filename.endswith('.pdf'):
            text = self.extract_text_from_pdf(file)
        elif filename.endswith('.docx') or filename.endswith('.doc'):
            text = self.extract_text_from_docx(file)
        else:
            raise ValueError("Unsupported file format. Please upload PDF or Word documents.")
        
        if not text or len(text.strip()) == 0:
            raise ValueError("Could not extract text from the file.")
        
        # Detect domain
        domain = self.detect_domain(text)
        print(f"Detected domain: {domain}")
        
        # Analyze tech stack for the domain
        domain_analysis = self.analyze_tech_stack(text, domain)
        print(f"Domain analysis: {domain_analysis}")
        
        # Extract features
        features = self.extract_features(text)
        
        # Calculate scores
        scores = self.calculate_scores(features, text, domain_analysis)
        
        # Generate feedback
        feedback = self.generate_feedback(features, scores, text, domain, domain_analysis)
        
        return {
            **scores,
            'feedback': feedback,
            'extracted_text_preview': text[:500] + '...' if len(text) > 500 else text,
            'file_processed': filename
        }

# Initialize analyzer
analyzer = ResumeAnalyzer()

@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume():
    try:
        print("Received analyze request")
        
        if 'resume' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['resume']
        print(f"File received: {file.filename}")
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        file.seek(0, 2)
        file_size = file.tell()
        file.seek(0)
        if file_size > 10 * 1024 * 1024:
            return jsonify({'error': 'File too large. Maximum size is 10MB.'}), 400
        
        result = analyzer.analyze_resume(file)
        return jsonify(result)
    
    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Resume Analyzer API is running'})

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Resume Analyzer API', 'endpoints': ['/api/analyze-resume', '/api/health']})

if __name__ == '__main__':
    print("Starting Smart Resume Analyzer API...")
    # CHANGED PORT FROM 5000 TO 5002
    app.run(debug=True, port=5002, host='0.0.0.0')