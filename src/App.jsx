import { useState, useEffect } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import Challenge from './components/Challenge';
import Login from './components/Login';
import AppStateDisplay from './components/AppStateDisplay';
import './App.css';

// 페이지 상수 정의
const PAGES = {
  LOGIN: 'login',
  CHALLENGE_LIST: 'challengeList',
  CHALLENGE_DETAIL: 'challengeDetail'
};
// 인증 상태에 따른 페이지 접근 권한 설정
const AUTH_RULES = {
  [PAGES.LOGIN]: { requiresAuth: false },
  [PAGES.CHALLENGE_LIST]: { requiresAuth: true },
  [PAGES.CHALLENGE_DETAIL]: { requiresAuth: true }
};

function AppContent() {
  const [pageName, setPageName] = useState('login');
  const [challengeId, setChallengeId] = useState('');
  const { user, loading } = useUser();
  console.log('현재 페이지:', pageName);

  // 페이지 전환 함수
  function navigateTo(targetPage, params = {}) {
    if (params.challengeId) setChallengeId(params.challengeId);
    setPageName(targetPage);
  }
  // 인증 상태 변경 시 페이지 재검증
  useEffect(() => {
    console.log('인증 상태 변경 감지:', { user, loading, pageName });
    if (loading) return;
    
    const currentPageRule = AUTH_RULES[pageName];
    
    // 인증이 필요한 페이지인데 사용자가 없으면 로그인으로 리디렉션
    if (currentPageRule?.requiresAuth && !user) {
      navigateTo(PAGES.LOGIN);
    }
    
    // 이미 로그인된 상태에서 로그인 페이지에 있으면 챌린지 목록으로 리디렉션
    if (pageName === PAGES.LOGIN && user) {
      navigateTo(PAGES.CHALLENGE_LIST);
    }
  }, [user, pageName, loading]);

  if (loading) {
    return <AppStateDisplay loading={true} />;
  }
  // 현재 인증 상태와 페이지에 따라 적절한 컴포넌트 렌더링
  function renderPage() {
    // 인증이 필요한 페이지인데 사용자가 없는 경우
    const currentPageRule = AUTH_RULES[pageName];
    if (currentPageRule?.requiresAuth && !user) {
      return <Login onSelectPage={navigateTo} />;
    }

    // 페이지별 렌더링
    switch (pageName) {
      case PAGES.LOGIN:
        return <Login onSelectPage={navigateTo} />;
      
      case PAGES.CHALLENGE_LIST:
      case PAGES.CHALLENGE_DETAIL:
        return (
          <Challenge 
            onSelectPage={navigateTo}
            pageName={pageName}
            challengeId={challengeId}
          />
        );
        
      default:
        return <AppStateDisplay error="페이지를 찾을 수 없습니다" />;
    }
  }

  return renderPage();

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
