// Mock API endpoint for development
// This simulates a backend API response

export const mockAPI = {
  admin: {
    login: async (username: string, password: string) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock admin credentials
      if (username === 'admin' && password === 'admin123') {
        return {
          success: true,
          token: 'mock.jwt.token.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiYWRtaW4iOnRydWUsImV4cCI6MTk5OTk5OTk5OX0.mock-signature',
          user: {
            username: 'admin',
            role: 'administrator'
          }
        };
      } else {
        return {
          success: false,
          message: '아이디 또는 비밀번호가 올바르지 않습니다.'
        };
      }
    },
    
    getMe: async (token: string) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simple token validation (in real app, this would be done on server)
      if (token && token.includes('mock.jwt.token')) {
        return {
          success: true,
          user: {
            username: 'admin',
            role: 'administrator',
            lastLogin: new Date().toISOString()
          }
        };
      } else {
        return {
          success: false,
          message: '유효하지 않은 토큰입니다.'
        };
      }
    },
    
    createPost: async (postData: any, token: string) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple token validation
      if (!token || !token.includes('mock.jwt.token')) {
        return {
          success: false,
          message: '인증이 필요합니다.'
        };
      }
      
      // Mock successful post creation
      return {
        success: true,
        post: {
          id: Date.now(),
          ...postData,
          author: 'admin',
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0
        }
      };
    }
  }
};
