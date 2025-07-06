// S3 Presigned URL 기반 이미지 업로드 유틸리티
import { galleryUploadAPI, newsUploadAPI, uploadAPI } from '../services/api';

// 지원하는 이미지 타입
const SUPPORTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

// 최대 파일 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 파일 유효성 검사
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  // 파일 타입 검사
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'JPG, PNG, GIF, WebP 파일만 업로드 가능합니다.',
    };
  }

  // 파일 크기 검사
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: '파일 크기는 5MB 이하여야 합니다.',
    };
  }

  return { isValid: true };
};

// 이미지 미리보기 생성
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error('이미지 미리보기 생성에 실패했습니다.'));
    };

    reader.readAsDataURL(file);
  });
};

// S3 업로드 결과 타입
export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// News용 이미지 업로드
export const uploadImageToNewsS3 = async (
  file: File
): Promise<UploadResult> => {
  try {
    // 1. 파일 유효성 검사
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // 2. News S3 업로드 실행
    const fileUrl = await newsUploadAPI.uploadFile(file);

    return {
      success: true,
      url: fileUrl,
    };
  } catch (error) {
    console.error('News S3 업로드 실패:', error);

    let errorMessage = '이미지 업로드에 실패했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Gallery용 이미지 업로드
export const uploadImageToGalleryS3 = async (
  file: File
): Promise<UploadResult> => {
  try {
    // 1. 파일 유효성 검사
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // 2. Gallery S3 업로드 실행
    const fileUrl = await galleryUploadAPI.uploadFile(file);

    return {
      success: true,
      url: fileUrl,
    };
  } catch (error) {
    console.error('Gallery S3 업로드 실패:', error);

    let errorMessage = '이미지 업로드에 실패했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// S3에 이미지 업로드 (기존 - 호환성 유지)
export const uploadImageToS3 = async (file: File): Promise<UploadResult> => {
  try {
    // 1. 파일 유효성 검사
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // 2. S3 업로드 실행
    const fileUrl = await uploadAPI.uploadFile(file);

    return {
      success: true,
      url: fileUrl,
    };
  } catch (error) {
    console.error('S3 업로드 실패:', error);

    let errorMessage = '이미지 업로드에 실패했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 이미지 압축 (옵션)
export const compressImage = (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 비율을 유지하면서 크기 조정
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // 이미지 그리기
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      // Blob으로 변환
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('이미지 압축에 실패했습니다.'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('이미지 로드에 실패했습니다.'));
    };

    img.src = URL.createObjectURL(file);
  });
};

// 전체 업로드 프로세스 (압축 포함)
export const uploadImageWithCompression = async (
  file: File,
  compress: boolean = true,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<UploadResult> => {
  try {
    let fileToUpload: File | Blob = file;

    // 압축이 필요한 경우
    if (compress && file.size > 1024 * 1024) {
      // 1MB 이상인 경우만 압축
      const compressedBlob = await compressImage(file, maxWidth, quality);
      fileToUpload = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
    }

    return await uploadImageToS3(fileToUpload as File);
  } catch (error) {
    console.error('이미지 압축 및 업로드 실패:', error);
    return {
      success: false,
      error: '이미지 처리에 실패했습니다.',
    };
  }
};
