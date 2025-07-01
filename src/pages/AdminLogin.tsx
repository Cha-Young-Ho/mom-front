import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/auth';
import './AdminLogin.css';

interface LoginData {
  username: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 이미 로그인된 상태면 대시보드로 리다이렉트
  useEffect(() => {
    if (authAPI.hasToken()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authAPI.login(loginData.username, loginData.password);

      if (result.success && result.token) {
        // JWT 토큰을 쿠키에 저장
        Cookies.set('admin_token', result.token, { 
          expires: 1, // 1일
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        // 관리자 대시보드로 이동
        navigate('/admin/dashboard');
      } else {
        setError(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('예상치 못한 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>관리자 로그인</h1>
          <p>가족지원센터 관리 시스템</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              placeholder="관리자 아이디를 입력하세요"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>문의사항이 있으시면 시스템 관리자에게 연락해주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
