// import React, { useState } from 'react';
// import { GoogleLogin } from '@react-oauth/google'; // 구글 로그인 버튼
// import { jwtDecode } from 'jwt-decode';
// import './App.css';
// import ChatInterface from './components/ChatInterface'; // (다음 단계에서 만들 파일)

// function App() {
//   // 1. 'user'라는 상태를 만듭니다.
//   // null이면 비로그인, 객체가 있으면 로그인 상태입니다.
//   const [user, setUser] = useState(null);

//   // 2. 로그인 성공 시 호출될 함수
//   const handleLoginSuccess = (credentialResponse) => {
//     console.log(credentialResponse);
//     // 3. 받아온 토큰(credential)을 디코딩합니다.
//     const userObject = jwtDecode(credentialResponse.credential);
//     console.log(userObject);
//     setUser(userObject); // 사용자 정보를 user 상태에 저장 -> 리액트가 화면을 다시 그림
//   };

//   // 4. 로그인 실패 시
//   const handleLoginError = () => {
//     console.log('Login Failed');
//     alert('로그인에 실패했습니다.');
//   };

//   // 5. 로그아웃 (간단한 예시)
//   const handleLogout = () => {
//     setUser(null); // user 상태를 null로 바꿔 로그아웃
//   };

//   return (
//     <div className="App">
//       {/* 6. 조건부 렌더링 */}
//       {!user ? (
//         // 7. user가 null일 때 (비로그인): 로그인 화면 표시
//         <div className="login-screen">
//           <h1>IM Bank ChatBot</h1>
//           <p>시작하려면 구글 계정으로 로그인하세요.</p>
//           <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
//         </div>
//       ) : (
//         // 8. user가 객체일 때 (로그인): 챗봇 화면 표시
//         <div className="chat-app">
//           <header className="app-header">
//             <h3>{user.given_name}님, 환영합니다!</h3>
//             <img src={user.picture} alt="profile" style={{width: 30, borderRadius: '50%'}} />
//             <button onClick={handleLogout} className="logout-button">로그아웃</button>
//           </header>
          
//           <ChatInterface />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google'; // 구글 로그인 버튼
import { jwtDecode } from 'jwt-decode';
import './App.css';
import ChatInterface from './components/ChatInterface'; // (다음 단계에서 만들 파일)

function App() {
  // 1. 'user'라는 상태를 만듭니다.
  // null이면 비로그인, 객체가 있으면 로그인 상태입니다.
  const [user, setUser] = useState(null);

  // 2. 로그인 성공 시 호출될 함수
  const handleLoginSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    // 3. 받아온 토큰(credential)을 디코딩합니다.
    const userObject = jwtDecode(credentialResponse.credential);
    console.log(userObject);
    setUser(userObject); // 사용자 정보를 user 상태에 저장 -> 리액트가 화면을 다시 그림
  };

  // 4. 로그인 실패 시
  const handleLoginError = () => {
    console.log('Login Failed');
    alert('로그인에 실패했습니다.');
  };

  // 5. 로그아웃 (간단한 예시)
  const handleLogout = () => {
    setUser(null); // user 상태를 null로 바꿔 로그아웃
  };

  return (
    <div className="App">
      {/* 6. 조건부 렌더링 */}
      {!user ? (
        // 7. user가 null일 때 (비로그인): 로그인 화면 표시
        <div className="login-screen">
          <h1>IM Bank ChatBot</h1>
          <p>시작하려면 구글 계정으로 로그인하세요.</p>
          <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
        </div>
      ) : (
        // 8. user가 객체일 때 (로그인): 챗봇 화면 표시
        <div className="chat-app">
          <header className="app-header">
            <h3>{user.given_name}님, 환영합니다!</h3>
            <img src={user.picture} alt="profile" style={{width: 30, borderRadius: '50%'}} />
            <button onClick={handleLogout} className="logout-button">로그아웃</button>
          </header>
          
          <ChatInterface />
        </div>
      )}
    </div>
  );
}

export default App;