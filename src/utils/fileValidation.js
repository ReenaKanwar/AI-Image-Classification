/**
 * File Validation Utility
 * Validates uploaded images against strict format and size constraints.
 */

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Formats bytes to human-readable string (e.g., 1.24 MB).
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates an uploaded File object.
 * @param {File} file 
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateImageFile(file) {
  if (!file) {
    return {
      isValid: false,
      error: 'Please select an image first.'
    };
  }

  // Check file size limit (5 MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Image size must be less than 5 MB. Selected file is ${formatFileSize(file.size)}.`
    };
  }

  // Check MIME type and file extension
  const fileNameLower = file.name ? file.name.toLowerCase() : '';
  const fileTypeLower = file.type ? file.type.toLowerCase() : '';

  const hasValidType = ALLOWED_MIME_TYPES.includes(fileTypeLower);
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileNameLower.endsWith(ext));

  if (!hasValidType && !hasValidExtension) {
    return {
      isValid: false,
      error: 'Please upload a valid JPG, JPEG, PNG or WEBP image.'
    };
  }

  return {
    isValid: true,
    error: null
  };
}
