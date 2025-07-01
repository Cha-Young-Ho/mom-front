import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Community from './pages/Community';
import Home from './pages/Home';
import PostEditor from './pages/PostEditor';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin routes - no header */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/posts/new" element={<PostEditor />} />
          
          {/* Public routes - with header */}
          <Route path="/*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/community" element={<Community />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
