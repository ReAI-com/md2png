/**
 * File Utilities
 * Handles file operations for the markdown-to-png converter
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Read file content
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - File content
 */
async function readFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Write content to file
 * @param {string} filePath - Path to save the file
 * @param {string|Buffer} content - Content to write
 * @returns {Promise<void>}
 */
async function writeFile(filePath, content) {
  try {
    // Ensure directory exists
    await ensureDirectoryExists(path.dirname(filePath));
    
    // Write file
    await fs.writeFile(filePath, content);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Ensure directory exists, create if not
 * @param {string} directory - Directory path
 * @returns {Promise<void>}
 */
async function ensureDirectoryExists(directory) {
  try {
    await fs.access(directory);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(directory, { recursive: true });
  }
}

/**
 * Check if file exists
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  readFile,
  writeFile,
  ensureDirectoryExists,
  fileExists
};
