import { useState, useEffect } from 'react';
import Challenge from './components/Challenge';
import { UserProvider, useUser } from './contexts/UserContext';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light'); // 테마 상태 추가
  const [pageName, setPageName] = useState('challengeList');
  const [challengeId, setChallengeId] = useState('');

  // 테마 변경 함수
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 초기 테마 설정
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // 시스템 테마 변경 감지
  useEffect(() => {
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      // 사용자가 수동으로 테마를 설정하지 않았을 경우에만 자동 변경
      if (!localStorage.getItem('theme')) {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  function onSelectPage(pageName, challengeId) {
    setPageName(pageName);
    setChallengeId(challengeId);
  }

  return (
    <>
      <UserProvider>
        <div className='wrap'>
          <div className='app_system'>
            {/* 테마 토글 버튼 추가 */}
            <button 
              onClick={toggleTheme} 
              className='theme-toggle'
              aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
            {
              <Challenge 
                onSelectPage={onSelectPage}
                pageName={pageName}
              />
            }  
        </div>
      </UserProvider>
    </>
  )
}


export default App
