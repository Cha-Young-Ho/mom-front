import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import Courses from './pages/Courses';
import Curriculum from './pages/Curriculum';
import Gallery from './pages/Gallery/Gallery';
import Home from './pages/Home/Home';
import News from './pages/News/News';
import { isAdmin } from './utils/auth';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          {/* Admin Login Route */}
          <Route path='/admin' element={<AdminLogin />} />

          {/* Main Site Routes (관리자도 여기서 작업) */}
          <Route
            path='/*'
            element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/curriculum' element={<Curriculum />} />
                    <Route path='/courses' element={<Courses />} />
                    <Route path='/gallery' element={<Gallery />} />
                    <Route path='/news' element={<News />} />
                  </Routes>
                </main>
                <Footer />
                <HiddenLoginButton />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// 숨겨진 로그인 버튼 컴포넌트
function HiddenLoginButton() {
  const location = useLocation();

  // 관리자가 이미 로그인되어 있거나 admin 페이지에 있으면 버튼 숨김
  if (isAdmin() || location.pathname === '/admin') {
    return null;
  }

  return (
    <Link to='/admin' className='hidden-login-btn' title='관리자 로그인'>
      •
    </Link>
  );
}

export default App;
