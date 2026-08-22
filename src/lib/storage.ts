/**
 * Storage Abstraction Layer for FixWise AI
 * Supports client-side File/Blob reading to Data URLs, local object caching,
 * and scalable object storage integration.
 */

export interface StorageResult {
  url: string;
  key: string;
  size: number;
  type: string;
}

export async function uploadImage(file: File): Promise<StorageResult> {
  return new Promise((resolve, reject) => {
    // Validate mime type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be a valid image (PNG, JPEG, WebP).'));
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return reject(new Error('Image size should be under 10MB.'));
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const key = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      try {
        // Cache temporarily in session storage if space permits
        sessionStorage.setItem(`fixwise_img_${key}`, dataUrl.substring(0, 1000)); // preview ref
      } catch (e) {
        // Storage quota handled gracefully
      }

      resolve({
        url: dataUrl,
        key,
        size: file.size,
        type: file.type,
      });
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.readAsDataURL(file);
  });
}

export async function deleteImage(key: string): Promise<boolean> {
  try {
    sessionStorage.removeItem(`fixwise_img_${key}`);
    return true;
  } catch (e) {
    return false;
  }
}

export function getImageUrl(keyOrUrl: string): string {
  if (keyOrUrl.startsWith('http') || keyOrUrl.startsWith('data:')) {
    return keyOrUrl;
  }
  const cached = sessionStorage.getItem(`fixwise_img_${keyOrUrl}`);
  return cached || keyOrUrl;
}
