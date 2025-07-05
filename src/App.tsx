import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import AdminLogin from './pages/AdminLogin';
import Courses from './pages/Courses';
import Curriculum from './pages/Curriculum';
import Gallery from './pages/Gallery/Gallery';
import Home from './pages/Home/Home';
import News from './pages/News/News';

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
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
