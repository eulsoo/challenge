// src/components/Login.jsx
import { useState } from 'react';
import { supabase } from '../supabase';

export default function Login({ onSelectPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // 로그인 성공 시 챌린지 목록 화면으로 이동
      onSelectPage('challengeList');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='app_head'>
        <h1 className='sub_title'>로그인</h1>
      </div>
      <main className='app_body'>
        <div className="login_container">
          {error && <div className="error_message">{error}</div>}
          
          <form onSubmit={handleLogin} className="login_form">
            <div className="form_group">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form_group">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          
          <div className="signup_link">
            <p>계정이 없으신가요? <button onClick={() => onSelectPage('register')} className="link_button">회원가입</button></p>
          </div>
        </div>
      </main>
    </>
  );
}