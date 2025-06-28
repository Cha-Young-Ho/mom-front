import './App.css';
import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React S3 Static Website</h1>
        <p>
          S3 정적 웹호스팅을 위한 React 애플리케이션입니다.
        </p>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          marginTop: '20px',
          textAlign: 'left',
          fontSize: '14px'
        }}>
          <h3>🔧 환경 정보</h3>
          <p><strong>Environment:</strong> {process.env.REACT_APP_ENVIRONMENT || 'development'}</p>
          <p><strong>Version:</strong> {process.env.REACT_APP_VERSION || '0.1.0'}</p>
          <p><strong>Build Time:</strong> {process.env.REACT_APP_BUILD_TIME || 'N/A'}</p>
          <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:3001'}</p>
        </div>

        <div style={{ marginTop: '30px' }}>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://aws.amazon.com/s3/"
            target="_blank"
            rel="noopener noreferrer"
          >
            AWS S3
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;
