const Filter = require('bad-words');
const filter = new Filter();

/**
 * Censoring bad words in text (Option A - masking).
 * @param {string} text - The input text to clean.
 * @returns {object} - { text: string, hasProfanity: boolean }
 */
function censorText(text) {
  if (!text || typeof text !== 'string') {
    return { text: '', hasProfanity: false };
  }

  try {
    // Check if any word in the text matches the profanity dictionary
    const hasProfanity = filter.isProfane(text);
    
    // Replace all bad words with asterisks (e.g., "****")
    const cleanText = hasProfanity ? filter.clean(text) : text;
    
    return { text: cleanText, hasProfanity };
  } catch (error) {
    console.error('Profanity filter error:', error);
    // In case of error, fall back to the original text safely
    return { text, hasProfanity: false };
  }
}

module.exports = { censorText };
