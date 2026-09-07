const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function validateImageFile(file) {
  if (!file) {
    return { isValid: false, error: 'Please select an image file.' };
  }

  if (file.size > MAX_SIZE) {
    return { isValid: false, error: 'Image size must be less than 5 MB.' };
  }

  const isValidType = ALLOWED_TYPES.includes(file.type) || 
    /\.(jpg|jpeg|png|webp)$/i.test(file.name);

  if (!isValidType) {
    return { isValid: false, error: 'Please upload a valid JPG, JPEG, PNG or WEBP image.' };
  }

  return { isValid: true, error: null };
}
