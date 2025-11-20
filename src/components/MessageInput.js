// import React, { useState } from 'react';

// function MessageInput({ onSend, disabled }) {
//   const [inputText, setInputText] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault(); // 폼 전송(새로고침) 방지
//     if (!inputText.trim() || disabled) return;
//     onSend(inputText);
//     setInputText(''); // 입력창 비우기
//   };

//   return (
//     <form onSubmit={handleSubmit} className="message-input-form">
//       <input
//         type="text"
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//         placeholder="메시지를 입력하세요..."
//         disabled={disabled}
//       />
//       <button type="submit" disabled={disabled}>
//         전송
//       </button>
//     </form>
//   );
// }
// export default MessageInput;

import React, { useState } from 'react';
import './Chat.css';

// ✅ 여기서 { onSendMessage }로 받아야 합니다! (이전엔 onSend 였을 수 있음)
const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 빈 메시지 방지
    if (!text.trim()) return;
    
    // ✅ 부모(ChatInterface)가 준 함수 실행
    onSendMessage(text);
    
    // 입력창 비우기
    setText('');
  };

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="메시지를 입력하세요..."
      />
      <button type="submit" className="send-button">
        전송
      </button>
    </form>
  );
};

export default MessageInput;