import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import challengeImage from '@/assets/temp_default0.jpg'
import badge_10d  from '@/assets/badge_10d.svg'
import badge_30d  from '@/assets/badge_30d.svg'
import badge_60d  from '@/assets/badge_60d.svg'
import badge_100d  from '@/assets/badge_100d.svg'

function App() {
  const [count, setCount] = useState(0);
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
      <div className='wrap'>
        <div className='system'>
          {/* 테마 토글 버튼 추가 */}
          <button 
            onClick={toggleTheme} 
            className='theme-toggle'
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        <div className='app_head'>
          <button className='ico_btn back'>
          <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path style={{fill: 'var(--text-primary)'}} d="M15.707 4.293C15.8945 4.48053 15.9998 4.73484 15.9998 5C15.9998 5.26516 15.8945 5.51947 15.707 5.707L9.41403 12L15.707 18.293C15.8892 18.4816 15.99 18.7342 15.9877 18.9964C15.9854 19.2586 15.8803 19.5094 15.6948 19.6948C15.5094 19.8802 15.2586 19.9854 14.9964 19.9877C14.7342 19.99 14.4816 19.8892 14.293 19.707L7.29303 12.707C7.10556 12.5195 7.00024 12.2652 7.00024 12C7.00024 11.7348 7.10556 11.4805 7.29303 11.293L14.293 4.293C14.4806 4.10553 14.7349 4.00021 15 4.00021C15.2652 4.00021 15.5195 4.10553 15.707 4.293Z"/>
          </svg>
          </button>
          <h1 className='sub_title'>챌린지</h1>
        </div>
        <main className='app_body'>
          <ul className='challenges'>
            <li className='challenge_item' style={{
              background: `
                linear-gradient(
                  180deg, rgba(196, 36, 36, 0.00) 18.75%, #2DA562 55.38%), url(${challengeImage}
                ) lightgray left top / 100% auto no-repeat
              `,
              backgroundClip: 'border-box',
              backgroundOrigin: 'border-box'
            }}>
              <div className='title'>
                <h2>예수님과 동행하는<br/>행복한 30일</h2>
              </div>
              <div className='challengers'>
                <span>정민교</span>
                <span>정을수</span>
                <span>최성훈</span>
                <span>김정아</span>
                <span>방예지</span>
                <span>고아리</span>
                <b>6명 참여</b>
              </div>
              <div className='info'>
                <div className='badge'><img src={badge_10d} /></div>
                <p className='description'>새로운 다짐과 함께 새해를 여는</p>
                <button className='btn trans small'>시작하기</button>
              </div>
            </li>
          </ul>
        </main>
        {/* <BrowserRouter>
          <nav>
            <ul>
              <li><Link to="/" role="menuitem">투데이</Link></li>
              <li><Link to="/write" role="menuitem">쓰기</Link></li>
              <li><Link to="/mydiary" role="menuitem">정을수</Link></li>
              <li><Link to="/nanum" role="menuitem">나눔방</Link></li>
              <li><Link to="/more" role="menuitem">더보기</Link></li>
            </ul>
          </nav>
        </BrowserRouter> */}
      </div>
    </>
  )
}


export default App
