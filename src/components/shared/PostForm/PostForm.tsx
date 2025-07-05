import React, { useEffect, useState } from 'react';
import { CreatePostRequest } from '../../../services/api';
import {
  createImagePreview,
  uploadImageToGalleryS3,
  uploadImageToNewsS3,
  UploadResult,
} from '../../../utils/imageUpload';
import Button from '../Button/Button';
import FormGroup from '../FormGroup/FormGroup';
import Modal from '../Modal/Modal';
import './PostForm.css';

interface PostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostRequest) => Promise<void>;
  type: 'news' | 'gallery';
  categories: string[];
  initialData?: Partial<CreatePostRequest>;
  title?: string;
}

const PostForm: React.FC<PostFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  categories,
  initialData,
  title = '새 게시글 작성',
}) => {
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    category: categories[0] || '',
    image_url: '',
    short_description: '',
    ...initialData,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 초기 데이터 설정
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        content: '',
        category: categories[0] || '',
        image_url: '',
        short_description: '',
        ...initialData,
      });
      setImagePreview(initialData?.image_url || null);
      setSelectedFile(null);
      setErrors({});
      setUploadProgress('');
    }
  }, [isOpen, initialData, categories]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSelectedFile(file);
      const preview = await createImagePreview(file);
      setImagePreview(preview);
    } catch (error) {
      console.error('이미지 미리보기 생성 실패:', error);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length > 100) {
      newErrors.title = '제목은 100자 이내로 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setUploading(true);
      let finalImageUrl = formData.image_url;

      // 새 이미지가 선택된 경우 업로드
      if (selectedFile) {
        setUploadProgress('이미지 업로드 중...');
        const uploadFn =
          type === 'news' ? uploadImageToNewsS3 : uploadImageToGalleryS3;
        const result: UploadResult = await uploadFn(selectedFile);

        if (result.success && result.url) {
          finalImageUrl = result.url;
        } else {
          throw new Error(result.error || '이미지 업로드에 실패했습니다.');
        }
      }

      setUploadProgress('게시글 저장 중...');
      await onSubmit({
        ...formData,
        image_url: finalImageUrl,
      });

      onClose();
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      alert(
        error instanceof Error ? error.message : '게시글 저장에 실패했습니다.'
      );
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size='large'
      className='post-form-modal'
    >
      <form onSubmit={handleSubmit} className='post-form'>
        <FormGroup label='제목' required error={errors.title} htmlFor='title'>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            placeholder='제목을 입력하세요'
            className='form-input'
            disabled={uploading}
            data-testid='title-input'
          />
        </FormGroup>

        <FormGroup
          label='카테고리'
          required
          error={errors.category}
          htmlFor='category'
        >
          <select
            id='category'
            name='category'
            value={formData.category}
            onChange={handleInputChange}
            className='form-select'
            disabled={uploading}
            data-testid='category-select'
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup label='요약' htmlFor='short_description'>
          <input
            type='text'
            id='short_description'
            name='short_description'
            value={formData.short_description}
            onChange={handleInputChange}
            placeholder='카드뷰에 표시될 짧은 설명을 입력하세요'
            className='form-input'
            disabled={uploading}
            data-testid='short-description-input'
          />
        </FormGroup>

        <FormGroup label='이미지 업로드' htmlFor='image-upload'>
          <div className='image-upload-section'>
            {imagePreview ? (
              <div className='image-preview'>
                <img src={imagePreview} alt='미리보기' />
                <Button
                  type='button'
                  variant='danger'
                  size='small'
                  onClick={handleRemoveImage}
                  disabled={uploading}
                  className='remove-image-btn'
                >
                  제거
                </Button>
              </div>
            ) : (
              <div className='upload-placeholder'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageSelect}
                  id='image-upload'
                  className='file-input'
                  disabled={uploading}
                  data-testid='image-upload-input'
                />
                <label
                  htmlFor='image-upload'
                  className={`upload-button ${uploading ? 'disabled' : ''}`}
                >
                  📷 이미지 선택
                </label>
                <p className='upload-hint'>
                  JPG, PNG, GIF 파일만 업로드 가능 (최대 5MB)
                </p>
              </div>
            )}
          </div>
        </FormGroup>

        <FormGroup
          label='내용'
          required
          error={errors.content}
          htmlFor='content'
        >
          <textarea
            id='content'
            name='content'
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            placeholder='내용을 입력하세요'
            className='form-textarea'
            disabled={uploading}
            data-testid='content-textarea'
          />
        </FormGroup>

        {uploadProgress && (
          <div className='upload-progress'>{uploadProgress}</div>
        )}

        <div className='form-actions'>
          <Button
            type='button'
            variant='secondary'
            onClick={onClose}
            disabled={uploading}
          >
            취소
          </Button>
          <Button
            type='submit'
            variant='primary'
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? uploadProgress || '처리 중...' : '저장'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PostForm;
