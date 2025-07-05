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
import './Notice.css';

const Notice: React.FC = () => {
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

  const itemsPerPage = 9;

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
      console.error('게시글 로드 실패:', error);
      // 실패 시 기본 데이터 설정
      setPosts([
        {
          id: '1',
          title: '2025년 가족상담 프로그램 운영 안내',
          content:
            '가족의 건강한 소통과 화합을 위한 전문 상담 프로그램을 새롭게 선보입니다.',
          category: '프로그램소식',
          created_at: '2025-06-29T10:00:00Z',
          status: 'published',
          image_url: '/images/family-health.svg',
          short_description:
            '가족의 건강한 소통과 화합을 위한 전문 상담 프로그램',
        },
        {
          id: '2',
          title: '센터 창립 5주년 기념 행사 개최',
          content:
            '센터 창립 5주년을 맞아 지역주민과 함께하는 기념행사를 개최합니다.',
          category: '행사소식',
          created_at: '2025-06-28T10:00:00Z',
          status: 'published',
          image_url: '/images/health-service.svg',
          short_description: '센터 창립 5주년 기념행사 개최 안내',
        },
        {
          id: '3',
          title: '가족센터 이용 안내 및 시설 소개',
          content:
            '가족센터의 각종 시설과 이용방법에 대한 상세한 안내를 제공합니다.',
          category: '일반',
          created_at: '2025-06-27T10:00:00Z',
          status: 'published',
          short_description: '가족센터 시설 이용 안내',
        },
        {
          id: '4',
          title: '휴관일 안내 - 2025년 7월',
          content: '7월 휴관일을 안내드립니다. 센터 이용에 참고해주세요.',
          category: '공지',
          created_at: '2025-06-26T10:00:00Z',
          status: 'published',
          short_description: '7월 휴관일 안내',
        },
        {
          id: '5',
          title: '프로그램 시간 연장 건의',
          content:
            '많은 분들이 요청하신 프로그램 시간 연장에 대해 검토 중입니다.',
          category: '건의',
          created_at: '2025-06-25T10:00:00Z',
          status: 'published',
          short_description: '프로그램 시간 연장 검토',
        },
        {
          id: '6',
          title: '주차장 이용 관련 문의',
          content:
            '주차장 이용 시간과 요금에 대해 자주 묻는 질문을 정리했습니다.',
          category: '질문',
          created_at: '2025-06-24T10:00:00Z',
          status: 'published',
          short_description: '주차장 이용 안내',
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

    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await galleryAPI.deleteGalleryItem(postId);
        await loadPosts();
        alert('게시글이 삭제되었습니다.');
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  // 이미지 파일 선택 핸들러
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 미리보기 생성
      const preview = await createImagePreview(file);
      setSelectedFile(file);
      setImagePreview(preview);
    } catch (error) {
      console.error('이미지 미리보기 생성 실패:', error);
      alert('이미지 미리보기 생성에 실패했습니다.');
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setNewPost({ ...newPost, image_url: '' });
  };

  // 새 게시글 생성 핸들러 (관리자 전용)
  const handleCreatePost = async () => {
    if (!isAdmin()) {
      alert('관리자 권한이 필요합니다.');
      return;
    }

    try {
      setUploading(true);

      let imageUrl = newPost.image_url;

      // 선택된 파일이 있으면 S3에 업로드
      if (selectedFile) {
        const uploadResult: UploadResult = await uploadImageWithCompression(
          selectedFile
        );
        if (!uploadResult.success) {
          alert(uploadResult.error || '이미지 업로드에 실패했습니다.');
          return;
        }
        imageUrl = uploadResult.url || '';
      }

      // 게시글 생성
      const postData = {
        ...newPost,
        image_url: imageUrl,
      };

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

      await loadPosts();
      alert('게시글이 생성되었습니다.');
    } catch (error) {
      console.error('게시글 생성 실패:', error);
      alert('게시글 생성에 실패했습니다.');
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
    <div className='notice'>
      <div className='notice-header'>
        <h1>공지사항</h1>
        <p>센터의 다양한 소식과 프로그램 정보를 확인하세요.</p>
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
            새 게시글 작성
          </button>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading ? (
        <div className='loading'>데이터를 불러오는 중...</div>
      ) : (
        <>
          {/* 게시글 카드 그리드 */}
          <div className='notice-grid'>
            {currentPosts.map(post => (
              <div
                key={post.id}
                className='notice-card'
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

      {/* 게시글 생성 모달 (관리자 전용) */}
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
              <h2>새 게시글 작성</h2>
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
                        />
                        <label htmlFor='image-upload' className='upload-btn'>
                          📷 이미지 선택
                        </label>
                        <p>JPG, PNG, GIF, WebP (최대 5MB)</p>
                        <p>1MB 이상 파일은 자동으로 압축됩니다</p>
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

export default Notice;
