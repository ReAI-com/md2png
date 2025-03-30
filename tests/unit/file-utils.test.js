/**
 * Unit tests for file-utils.js
 */

const fs = require('fs').promises;
const path = require('path');
const fileUtils = require('../../src/utils/file-utils');

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    access: jest.fn(),
    mkdir: jest.fn()
  }
}));

describe('File Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('readFile', () => {
    test('should read file content', async () => {
      const filePath = '/path/to/file.md';
      const fileContent = '# Test Content';
      
      fs.readFile.mockResolvedValue(fileContent);
      
      const result = await fileUtils.readFile(filePath);
      
      expect(fs.readFile).toHaveBeenCalledWith(filePath, 'utf8');
      expect(result).toBe(fileContent);
    });
    
    test('should throw error when file read fails', async () => {
      const filePath = '/path/to/nonexistent.md';
      const error = new Error('File not found');
      
      fs.readFile.mockRejectedValue(error);
      
      await expect(fileUtils.readFile(filePath)).rejects.toThrow();
    });
  });
  
  describe('writeFile', () => {
    test('should write content to file', async () => {
      const filePath = '/path/to/output.png';
      const content = Buffer.from('test-content');
      
      fs.access.mockResolvedValue(undefined);
      fs.writeFile.mockResolvedValue(undefined);
      
      await fileUtils.writeFile(filePath, content);
      
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, content);
    });
    
    test('should create directory if it does not exist', async () => {
      const filePath = '/path/to/new/dir/output.png';
      const content = Buffer.from('test-content');
      const dirPath = '/path/to/new/dir';
      
      fs.access.mockRejectedValue(new Error('Directory not found'));
      fs.mkdir.mockResolvedValue(undefined);
      fs.writeFile.mockResolvedValue(undefined);
      
      await fileUtils.writeFile(filePath, content);
      
      expect(fs.mkdir).toHaveBeenCalledWith(dirPath, { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, content);
    });
  });
  
  describe('fileExists', () => {
    test('should return true when file exists', async () => {
      const filePath = '/path/to/file.md';
      
      fs.access.mockResolvedValue(undefined);
      
      const result = await fileUtils.fileExists(filePath);
      
      expect(fs.access).toHaveBeenCalledWith(filePath);
      expect(result).toBe(true);
    });
    
    test('should return false when file does not exist', async () => {
      const filePath = '/path/to/nonexistent.md';
      
      fs.access.mockRejectedValue(new Error('File not found'));
      
      const result = await fileUtils.fileExists(filePath);
      
      expect(fs.access).toHaveBeenCalledWith(filePath);
      expect(result).toBe(false);
    });
  });
});
