import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/auth';
import './AdminDashboard.css';

interface AdminInfo {
  username: string;
  role: string;
  lastLogin: string;
}

const AdminDashboard: React.FC = () => {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthAndLoadData = async () => {
    if (!authAPI.hasToken()) {
      navigate('/admin');
      return;
    }

    try {
      const result = await authAPI.getMe();

      if (result.success && result.user) {
        setAdminInfo({
          username: result.user.username,
          role: result.user.role,
          lastLogin: new Date().toLocaleString('ko-KR')
        });
      } else {
        // 토큰이 유효하지 않으면 로그인 페이지로 이동
        authAPI.logout();
        navigate('/admin');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin');
  };

  const handleNewPost = () => {
    navigate('/admin/posts/new');
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>가족지원센터 관리 시스템</h1>
          <div className="admin-actions">
            <button onClick={handleNewPost} className="new-post-btn">
              ✏️ 새 게시글
            </button>
            <span className="welcome-text">
              환영합니다, {adminInfo?.username}님
            </span>
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📊 통계</h3>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">총 게시물</span>
                <span className="stat-value">42</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">신규 문의</span>
                <span className="stat-value">8</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>📝 콘텐츠 관리</h3>
            <div className="management-buttons">
              <button className="mgmt-btn" onClick={handleNewPost}>새 게시글 작성</button>
              <button className="mgmt-btn">게시물 관리</button>
              <button className="mgmt-btn">공지사항 관리</button>
              <button className="mgmt-btn">프로그램 관리</button>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>👥 사용자 관리</h3>
            <div className="management-buttons">
              <button className="mgmt-btn">회원 관리</button>
              <button className="mgmt-btn">상담 내역</button>
              <button className="mgmt-btn">문의 관리</button>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>⚙️ 시스템 설정</h3>
            <div className="management-buttons">
              <button className="mgmt-btn">사이트 설정</button>
              <button className="mgmt-btn">백업 관리</button>
              <button className="mgmt-btn">로그 조회</button>
            </div>
          </div>
        </div>

        <div className="recent-activities">
          <h3>최근 활동</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">2025-01-29 14:30</span>
              <span className="activity-desc">새로운 가족상담 문의가 등록되었습니다.</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">2025-01-29 13:15</span>
              <span className="activity-desc">프로그램 후기가 작성되었습니다.</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">2025-01-29 11:45</span>
              <span className="activity-desc">새로운 공지사항이 게시되었습니다.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
