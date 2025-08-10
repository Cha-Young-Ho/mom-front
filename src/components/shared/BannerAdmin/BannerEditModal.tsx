import React, { useEffect, useState } from 'react';
import { uploadAPI } from '../../../services/api';
import { BannerSlide } from '../../../services/bannerAPI';
import Modal from '../Modal/Modal';
import './BannerEditModal.css';

interface BannerEditModalProps {
  slide: BannerSlide | null; // null이면 새로 추가
  onSave: (slide: BannerSlide) => void;
  onCancel: () => void;
}

const BannerEditModal: React.FC<BannerEditModalProps> = ({
  slide,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<BannerSlide>({
    id: '',
    title: '',
    image: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const isEditing = slide !== null;

  useEffect(() => {
    if (slide) {
      setFormData({
        id: slide.id,
        title: slide.title,
        image: slide.image,
        content: slide.content,
      });
      setImagePreview(slide.image);
    } else {
      setFormData({
        id: '',
        title: '',
        image: '',
        content: '',
      });
      setImagePreview('');
    }
    setSelectedFile(null);
    setUploadProgress(0);
  }, [slide]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (): Promise<string> => {
    if (!selectedFile) {
      return formData.image;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // S3 presigned URL을 사용한 이미지 업로드
      const fileUrl = await uploadAPI.uploadFile(selectedFile);
      
      setUploadProgress(100);
      return fileUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formData.image.trim() && !selectedFile) {
      alert('이미지를 선택하거나 URL을 입력해주세요.');
      return;
    }

    try {
      let finalImageUrl = formData.image;
      
      // 파일이 선택된 경우 S3에 업로드
      if (selectedFile) {
        finalImageUrl = await handleImageUpload();
      }

      const slideData: BannerSlide = {
        ...formData,
        image: finalImageUrl,
      };
      
      onSave(slideData);
    } catch (error) {
      console.error('배너 저장 실패:', error);
      // 에러는 이미 handleImageUpload에서 처리됨
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      image: value,
    }));
    
    // URL이 유효한 이미지인지 미리보기
    if (value) {
      setImagePreview(value);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={isEditing ? '배너 수정' : '새 배너 추가'}
    >
      <form onSubmit={handleSubmit} className='banner-edit-form'>
        <div className='form-group'>
          <label htmlFor='title'>제목 *</label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            placeholder='배너 제목을 입력하세요'
            required
          />
        </div>
        
        <div className='form-group'>
          <label htmlFor='content'>본문 내용</label>
          <textarea
            id='content'
            name='content'
            value={formData.content}
            onChange={handleInputChange}
            placeholder='배너 내용을 입력하세요'
            rows={6}
          />
        </div>
        
        <div className='form-group'>
          <label htmlFor='imageFile'>이미지 파일 업로드</label>
          <div className='image-upload-container'>
            <input
              type='file'
              id='imageFile'
              name='imageFile'
              accept='image/*'
              onChange={handleFileChange}
              className='file-input'
              disabled={isUploading}
            />
            <label htmlFor='imageFile' className='file-input-label'>
              {selectedFile ? selectedFile.name : '이미지 파일 선택'}
            </label>
          </div>
          <small className='form-help'>
            JPG, PNG, GIF 파일 (최대 5MB)를 선택하세요.
          </small>
          {isUploading && (
            <div className='upload-progress'>
              <div className='progress-bar'>
                <div 
                  className='progress-fill' 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span>업로드 중... {uploadProgress}%</span>
            </div>
          )}
        </div>
        
        <div className='form-group'>
          <label htmlFor='imageUrl'>이미지 URL</label>
          <input
            type='url'
            id='imageUrl'
            name='imageUrl'
            value={formData.image}
            onChange={handleImageUrlChange}
            placeholder='https://example.com/image.jpg'
            disabled={isUploading}
          />
          <small className='form-help'>
            파일 업로드 대신 이미지 URL을 직접 입력할 수도 있습니다.
          </small>
        </div>
        
        {(imagePreview || formData.image) && (
          <div className='image-preview'>
            <label>이미지 미리보기:</label>
            <img
              src={imagePreview || formData.image}
              alt='미리보기'
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className='image-error hidden'>
              이미지를 불러올 수 없습니다.
            </div>
          </div>
        )}
        
        <div className='form-actions'>
          <button 
            type='button' 
            onClick={onCancel} 
            className='btn-cancel'
            disabled={isUploading}
          >
            취소
          </button>
          <button 
            type='submit' 
            className='btn-save' 
            disabled={isUploading}
          >
            {isUploading ? '업로드 중...' : isEditing ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BannerEditModal;
