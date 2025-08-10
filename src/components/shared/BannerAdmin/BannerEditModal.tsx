import React, { useEffect, useState } from 'react';
import { uploadAPI } from '../../../services/api';
import { BannerSlide } from '../../../services/bannerAPI';
import { createImagePreview, validateImageFile } from '../../../utils/imageUpload';
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
  const [uploadProgress, setUploadProgress] = useState<string>('');

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
    setUploadProgress('');
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 파일 유효성 검사
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      setSelectedFile(file);
      const preview = await createImagePreview(file);
      setImagePreview(preview);
    } catch (error) {
      console.error('이미지 미리보기 생성 실패:', error);
      alert('이미지 미리보기 생성에 실패했습니다.');
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: '',
    }));
  };

  const handleImageUpload = async (): Promise<string> => {
    if (!selectedFile) {
      return formData.image;
    }

    try {
      setIsUploading(true);
      setUploadProgress('이미지 업로드 중...');

      // S3 presigned URL을 사용한 이미지 업로드
      const fileUrl = await uploadAPI.uploadFile(selectedFile);
      
      setUploadProgress('업로드 완료!');
      return fileUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formData.image.trim() && !selectedFile) {
      alert('이미지를 선택해주세요.');
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
            disabled={isUploading}
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
            disabled={isUploading}
          />
        </div>
        
        <div className='form-group'>
          <label htmlFor='imageFile'>이미지 업로드 *</label>
          <div className='image-upload-section'>
            {imagePreview ? (
              <div className='image-preview'>
                <img src={imagePreview} alt='미리보기' />
                <button
                  type='button'
                  className='remove-image-btn'
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                >
                  제거
                </button>
              </div>
            ) : (
              <div className='upload-placeholder'>
                <input
                  type='file'
                  id='imageFile'
                  name='imageFile'
                  accept='image/*'
                  onChange={handleFileChange}
                  className='file-input'
                  disabled={isUploading}
                />
                <label htmlFor='imageFile' className='upload-button'>
                  📷 이미지 선택
                </label>
                <p className='upload-hint'>
                  JPG, PNG, GIF 파일만 업로드 가능 (최대 5MB)
                </p>
              </div>
            )}
          </div>
          {uploadProgress && (
            <div className='upload-progress'>{uploadProgress}</div>
          )}
        </div>
        
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
            {isUploading ? uploadProgress || '업로드 중...' : isEditing ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BannerEditModal;
