import { useState, useEffect } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import Challenge from './components/Challenge';
import Login from './components/Login';
import AppStateDisplay from './components/AppStateDisplay';
import './App.css';

function AppContent() {
  const [pageName, setPageName] = useState('login');
  const [challengeId, setChallengeId] = useState('');
  const { user, loading } = useUser();

  function onSelectPage(newPageName, newChallengeId) {
    setPageName(newPageName);
    if (newChallengeId) setChallengeId(newChallengeId);
  }

  if (loading) {
    return <AppStateDisplay loading={true} />;
  }

  // 로그인되지 않은 상태에서는 로그인/회원가입 페이지만 접근 가능
  if (!user && pageName !== 'login' && pageName !== 'register') {
    return <Login onSelectPage={onSelectPage} />;
  }

  // 이미 로그인된 상태에서 로그인/회원가입 페이지로 접근하면 챌린지 목록으로 리디렉션
  if (user && (pageName === 'login' || pageName === 'register')) {
    // 바로 setState를 호출하지 않고 렌더링을 통해 처리
    setTimeout(() => onSelectPage('challengeList'), 0);
    return <AppStateDisplay loading={true} />;
  }

  switch (pageName) {
    case 'login':
      return <Login onSelectPage={onSelectPage} />;
    case 'challengeList':
    case 'challengeDetail':
      return (
        <Challenge 
          onSelectPage={onSelectPage}
          pageName={pageName}
          challengeId={challengeId}
        />
      );
    default:
      return <Login onSelectPage={onSelectPage} />;
  }
}

function App() {
  const [theme, setTheme] = useState('light'); // 테마 상태 추가

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

  return (
    <>
      <UserProvider>
        <div className='wrap'>
          <AppContent />
        </div>
      </UserProvider>
    </>
  )
}


export default App
