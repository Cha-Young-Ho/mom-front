import React, { useCallback, useEffect, useState } from 'react';
import { API_CONFIG } from '../../config/api';
import {
  CreatePostRequest,
  galleryAPI,
  getCategoryColor,
  Post,
} from '../../services/api';
import { isAdmin } from '../../utils/auth';
import {
  createImagePreview,
  uploadImageWithCompression,
  UploadResult,
} from '../../utils/imageUpload';
import './Gallery.css';

const Gallery: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState<CreatePostRequest>({
    title: '',
    content: '',
    category: API_CONFIG.galleryCategories[0],
    image_url: '',
    short_description: '',
  });

  // 이미지 업로드 관련 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const itemsPerPage = 12;

  // 데이터 로드
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        selectedCategories.length > 0
          ? await galleryAPI.getGallery(selectedCategories)
          : await galleryAPI.getGallery();
      setPosts(response.posts);
    } catch (error) {
      console.error('갤러리 로드 실패:', error);
      // 실패 시 기본 데이터 설정
      setPosts([
        {
          id: '1',
          title: '2025년 센터 운영 관련 공지사항',
          content:
            '새해를 맞이하여 센터 운영 시간 및 프로그램 변경사항을 안내드립니다.',
          category: '공지사항',
          created_at: '2025-06-29T10:00:00Z',
          status: 'published',
          short_description: '센터 운영 시간 및 프로그램 변경사항 안내',
        },
        {
          id: '2',
          title: '가족상담 신청서 양식 및 이용 안내',
          content:
            '가족상담 프로그램 신청을 위한 양식과 이용방법을 안내합니다.',
          category: '참고자료',
          created_at: '2025-06-28T10:00:00Z',
          status: 'published',
          short_description: '가족상담 프로그램 신청 양식 및 이용방법 안내',
        },
        {
          id: '3',
          title: '건강가정지원센터 2025년 사업계획 발표',
          content: '올해 추진할 주요 사업과 프로그램 계획을 발표합니다.',
          category: '기관소식',
          created_at: '2025-06-27T10:00:00Z',
          status: 'published',
          short_description: '2025년 주요 사업 및 프로그램 계획 발표',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategories]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // 카테고리 필터 핸들러
  const handleCategoryFilter = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // 게시글 삭제 핸들러 (관리자 전용)
  const handleDeletePost = async (postId: string) => {
    if (!isAdmin()) {
      alert('관리자 권한이 필요합니다.');
      return;
    }

    if (window.confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      try {
        await galleryAPI.deleteGalleryItem(postId);
        await loadPosts();
        alert('항목이 삭제되었습니다.');
      } catch (error) {
        console.error('항목 삭제 실패:', error);
        alert('항목 삭제에 실패했습니다.');
      }
    }
  };

  // 이미지 파일 선택 핸들러
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 파일 유효성 검사
      const validation = await import('../../utils/imageUpload').then(module =>
        module.validateImageFile(file)
      );

      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      // 미리보기 생성
      const preview = await createImagePreview(file);
      setSelectedFile(file);
      setImagePreview(preview);

      // URL 입력 필드 초기화 (파일 업로드와 URL 입력 중 하나만 사용)
      setNewPost({ ...newPost, image_url: '' });
    } catch (error) {
      console.error('이미지 미리보기 생성 실패:', error);
      alert('이미지 미리보기 생성에 실패했습니다.');
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setUploadProgress('');
    setNewPost({ ...newPost, image_url: '' });
  };

  // 새 항목 생성 핸들러 (관리자 전용)
  const handleCreatePost = async () => {
    if (!isAdmin()) {
      alert('관리자 권한이 필요합니다.');
      return;
    }

    // 필수 필드 검증
    if (!newPost.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!newPost.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setUploading(true);

      let imageUrl = newPost.image_url;

      // 선택된 파일이 있으면 S3에 업로드
      if (selectedFile) {
        console.log('이미지 업로드 시작:', selectedFile.name);
        setUploadProgress('이미지 업로드 중...');

        const uploadResult: UploadResult = await uploadImageWithCompression(
          selectedFile,
          true, // 압축 활성화
          1200, // 최대 너비
          0.8 // 품질
        );

        if (!uploadResult.success) {
          setUploadProgress('');
          alert(uploadResult.error || '이미지 업로드에 실패했습니다.');
          return;
        }

        imageUrl = uploadResult.url || '';
        setUploadProgress('이미지 업로드 완료!');
        console.log('이미지 업로드 완료:', imageUrl);

        // 잠깐 성공 메시지 표시 후 진행
        setTimeout(() => {
          setUploadProgress('게시글 생성 중...');
        }, 500);
      } else {
        setUploadProgress('게시글 생성 중...');
      }

      // 게시글 생성
      const postData = {
        ...newPost,
        image_url: imageUrl,
      };

      console.log('게시글 생성 요청:', postData);
      await galleryAPI.createGalleryItem(postData);

      // 폼 리셋
      setIsCreateModalOpen(false);
      setNewPost({
        title: '',
        content: '',
        category: API_CONFIG.galleryCategories[0],
        image_url: '',
        short_description: '',
      });
      setSelectedFile(null);
      setImagePreview(null);
      setUploadProgress('');

      await loadPosts();
      alert('항목이 생성되었습니다.');
    } catch (error) {
      console.error('항목 생성 실패:', error);
      setUploadProgress('');
      alert('항목 생성에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 페이지네이션
  const totalPages = Math.ceil((posts || []).length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = (posts || []).slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='gallery'>
      <div className='gallery-header'>
        <h1>주요정보</h1>
        <p>센터의 자료와 정보를 확인하세요.</p>
      </div>

      {/* 카테고리 필터 */}
      <div className='category-filter'>
        <button
          className={selectedCategories.length === 0 ? 'active' : ''}
          onClick={() => setSelectedCategories([])}
        >
          전체
        </button>
        {API_CONFIG.galleryCategories.map(category => (
          <button
            key={category}
            className={selectedCategories.includes(category) ? 'active' : ''}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 관리자 컨트롤 */}
      {isAdmin() && (
        <div className='admin-controls'>
          <button
            className='admin-btn create'
            onClick={() => setIsCreateModalOpen(true)}
          >
            새 항목 추가
          </button>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading ? (
        <div className='loading'>데이터를 불러오는 중...</div>
      ) : (
        <>
          {/* 갤러리 그리드 */}
          <div className='gallery-grid'>
            {currentPosts.map(post => (
              <div
                key={post.id}
                className='gallery-card'
                onClick={() => handlePostClick(post)}
              >
                {post.image_url && (
                  <div className='card-image'>
                    <img src={post.image_url} alt={post.title} />
                  </div>
                )}
                <div className='card-content'>
                  <div className='card-header'>
                    <span
                      className={`category-tag ${getCategoryColor(
                        post.category,
                        'gallery'
                      )}`}
                    >
                      {post.category}
                    </span>
                    {isAdmin() && (
                      <button
                        className='delete-btn'
                        onClick={e => {
                          e.stopPropagation();
                          handleDeletePost(post.id);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <h3 className='card-title'>{post.title}</h3>
                  <p className='card-description'>{post.short_description}</p>
                  <div className='card-meta'>
                    <span>
                      {new Date(post.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className='pagination'>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={currentPage === page ? 'active' : ''}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {/* 상세보기 모달 */}
      {isModalOpen && selectedPost && (
        <div className='modal-overlay' onClick={() => setIsModalOpen(false)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>{selectedPost.title}</h2>
              <button
                className='close-btn'
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className='modal-meta'>
              <span
                className={`category-tag ${getCategoryColor(
                  selectedPost.category,
                  'gallery'
                )}`}
              >
                {selectedPost.category}
              </span>
              <span>
                {new Date(selectedPost.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
            {selectedPost.image_url && (
              <div className='modal-image'>
                <img src={selectedPost.image_url} alt={selectedPost.title} />
              </div>
            )}
            <div className='modal-body'>
              <p>{selectedPost.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* 항목 생성 모달 (관리자 전용) */}
      {isCreateModalOpen && isAdmin() && (
        <div
          className='modal-overlay'
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className='modal-content write-modal'
            onClick={e => e.stopPropagation()}
          >
            <div className='modal-header'>
              <h2>새 항목 추가</h2>
              <button
                className='close-btn'
                onClick={() => setIsCreateModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className='modal-body'>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleCreatePost();
                }}
              >
                <div className='form-group'>
                  <label>제목 *</label>
                  <input
                    type='text'
                    value={newPost.title}
                    onChange={e =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    placeholder='제목을 입력하세요'
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>카테고리 *</label>
                  <select
                    value={newPost.category}
                    onChange={e =>
                      setNewPost({ ...newPost, category: e.target.value })
                    }
                  >
                    {API_CONFIG.galleryCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>짧은 설명</label>
                  <input
                    type='text'
                    value={newPost.short_description}
                    onChange={e =>
                      setNewPost({
                        ...newPost,
                        short_description: e.target.value,
                      })
                    }
                    placeholder='카드뷰에 표시될 짧은 설명을 입력하세요'
                  />
                </div>

                <div className='form-group'>
                  <label>이미지 업로드</label>
                  <div className='image-upload-area'>
                    {imagePreview ? (
                      <div className='image-preview'>
                        <img src={imagePreview} alt='미리보기' />
                        <button
                          type='button'
                          className='remove-image-btn'
                          onClick={handleRemoveImage}
                          disabled={uploading}
                        >
                          × 제거
                        </button>
                      </div>
                    ) : (
                      <div className='upload-placeholder'>
                        <input
                          type='file'
                          accept='image/*'
                          onChange={handleImageSelect}
                          id='image-upload'
                          style={{ display: 'none' }}
                          disabled={uploading}
                        />
                        <label
                          htmlFor='image-upload'
                          className={`upload-btn ${
                            uploading ? 'disabled' : ''
                          }`}
                        >
                          📷 이미지 선택
                        </label>
                        <p>JPG, PNG, GIF, WebP (최대 5MB)</p>
                        <p>1MB 이상 파일은 자동으로 압축됩니다</p>
                      </div>
                    )}

                    {/* 업로드 진행 상태 표시 */}
                    {uploadProgress && (
                      <div className='upload-progress'>
                        <div className='progress-text'>{uploadProgress}</div>
                        <div className='progress-bar'>
                          <div
                            className='progress-bar-fill'
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type='url'
                    value={newPost.image_url}
                    onChange={e =>
                      setNewPost({ ...newPost, image_url: e.target.value })
                    }
                    placeholder='또는 이미지 URL을 직접 입력하세요'
                    disabled={uploading || !!selectedFile}
                  />
                </div>

                <div className='form-group'>
                  <label>내용 *</label>
                  <textarea
                    value={newPost.content}
                    onChange={e =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    rows={6}
                    placeholder='내용을 입력하세요'
                    required
                  />
                </div>

                <div className='form-actions'>
                  <button
                    type='button'
                    onClick={() => setIsCreateModalOpen(false)}
                    disabled={uploading}
                  >
                    취소
                  </button>
                  <button
                    type='submit'
                    disabled={uploading}
                    className={uploading ? 'uploading' : ''}
                  >
                    {uploading ? '업로드 중...' : '등록'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
