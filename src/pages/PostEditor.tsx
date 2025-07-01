import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/auth';
import './PostEditor.css';

interface PostFormData {
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
}

const PostEditor: React.FC = () => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    category: '가족상담',
    isPublished: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['가족상담', '교육정보', '프로그램후기', '생활정보'];

  // 관리자 권한 확인
  useEffect(() => {
    const checkAuth = async () => {
      if (!authAPI.hasToken()) {
        navigate('/admin');
        return;
      }

      const result = await authAPI.getMe();
      if (!result.success) {
        navigate('/admin');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // API 호출 (실제 구현 시 서버로 전송)
      const headers = {
        'Content-Type': 'application/json',
        ...authAPI.getAuthHeaders()
      };
      
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || '게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Post creation error:', error);
      setError('서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 삭제됩니다. 정말 취소하시겠습니까?')) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="post-editor">
      <div className="editor-container">
        <div className="editor-header">
          <h1>새 게시글 작성</h1>
          <div className="header-actions">
            <button onClick={handleCancel} className="cancel-btn">
              취소
            </button>
            <button 
              onClick={handleSubmit} 
              className="save-btn"
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : '게시글 등록'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">카테고리</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                즉시 게시
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="게시글 제목을 입력하세요"
              disabled={isLoading}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="게시글 내용을 입력하세요"
              disabled={isLoading}
              rows={15}
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostEditor;
