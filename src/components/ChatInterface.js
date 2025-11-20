import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './Chat.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // 세션 ID는 새로고침 전까지 유지되도록 useRef나 useState로 관리 (간단히 랜덤 문자열 생성)
  const sessionIdRef = useRef('session-' + Math.random().toString(36).substr(2, 9));

  // [중요] n8n Webhook URL
  // 제공해주신 JSON의 Webhook ID(f2bddafa...)를 기반으로 한 주소입니다.
  // 앞부분의 도메인(예: https://n8n.your-domain.com)은 본인의 n8n 주소로 꼭 바꿔주세요!
  const N8N_WEBHOOK_URL = 'https://primary-production-b57a.up.railway.app/webhook-test/f2bddafa-e050-40c6-8a32-697c7dce9527';
  

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // 1. 사용자 메시지 UI 추가
    const userMessage = { sender: 'user', text: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 2. n8n으로 데이터 전송
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // n8n의 'Edit_Field1' 노드가 이 이름들을 기다리고 있습니다.
          chatInput: text, 
          sessionId: sessionIdRef.current 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 3. 응답 처리
      // 현재 워크플로우 상 AI가 '의도(intent)'를 분류해서 보내줍니다.
      // 예: { intent: "PERSONAL_DB", ... }
      
      let botText = "";
      
      // 응답 데이터 구조에 따라 출력 메시지 결정
      if (data.intent) {
        botText = `[시스템 분석 결과]\n사용자의 의도는 "${data.intent}" 입니다.`;
        // 추후 n8n에서 실제 답변 노드를 연결하면 data.output 등을 사용하면 됩니다.
      } else if (data.output) {
        botText = data.output;
      } else {
        botText = JSON.stringify(data); // 디버깅용: 날것의 데이터 보여주기
      }

      const botMessage = { sender: 'bot', text: botText };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { 
        sender: 'bot', 
        text: '죄송합니다. 서버 연결에 실패했습니다. (CORS 또는 주소를 확인해주세요)' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Bank AI Assistant</h2>
      </div>
      <MessageList messages={messages} />
      {isLoading && <div className="loading-indicator">AI가 분석 중입니다...</div>}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;

// import React, { useState } from 'react';
// import MessageList from './MessageList';
// import MessageInput from './MessageInput';
// import './Chat.css'; // 챗봇 전용 CSS

// const CHAT_WEBHOOK_URL = "https://primary-production-b57a.up.railway.app/webhook/f2bddafa-e050-40c6-8a32-697c7dce9527"; 

// // [중요] 로그인 후에는 고객 ID를 보내야 하므로 임시 ID를 사용합니다.
// const DEMO_CUSTOMER_ID = 'customer-1234';

// function ChatInterface() {
//   // 1. 메시지 목록 상태
//   const [messages, setMessages] = useState([
//     { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }
//   ]);
//   // 2. 로딩 상태 (API 응답 대기 중) 
//   const [isLoading, setIsLoading] = useState(false);
//   // 3. 오류 상태 
//   const [error, setError] = useState(null);

//   // 4. 메시지 전송 처리 함수 (나중에 n8n 연동)
//   const handleSend = async (inputText) => {
//     setError(null);
//     setMessages(prev => [...prev, { sender: 'user', text: inputText }]);
//     setIsLoading(true);

//     try {
//         // 실제 n8n API 호출 시작
//         const response = await fetch(CHAT_WEBHOOK_URL, {
//             method: 'POST', // Webhook은 보통 POST 방식을 사용합니다.
//             headers: {
//                 'Content-Type': 'application/json',
//                 // 11/16 문서에 따라 로그인 후에는 'customer_id'를 헤더로 보냅니다.
//                 'X-Customer-Id': DEMO_CUSTOMER_ID 
//             },
//             body: JSON.stringify({
//                 // n8n 워크플로우로 보낼 데이터 (메시지 내용)
//                 message: inputText
//                 // 기타 필요 데이터(예: user_id 등)를 추가할 수 있습니다.
//             })
//         });

//         // HTTP 오류 코드 (4xx, 5xx) 처리
//         if (!response.ok) {
//             throw new Error(`API 응답 오류! 상태 코드: ${response.status}`);
//         }

//         // n8n이 응답한 JSON 데이터를 받습니다. (예: { "answer": "챗봇 답변입니다" })
//         const data = await response.json(); 

//         // 봇의 응답을 UI에 추가
//         // (n8n 응답 필드명에 따라 data.answer 부분을 수정해야 할 수 있습니다.)
//         setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);

//     } catch (e) {
//         setError('챗봇 응답을 받지 못했습니다. n8n 연결 또는 워크플로우를 확인하세요.');
//         console.error("Fetch Error:", e);
//         setMessages(prev => [...prev, { sender: 'bot', text: '죄송합니다. 서버 통신에 실패했어요.' }]);
//     } finally {
//         setIsLoading(false); // 로딩 종료
//     }
// };

//   return (
//     <div className="chat-interface">
//       <MessageList messages={messages} isLoading={isLoading} />
//       <MessageInput onSend={handleSend} disabled={isLoading} />
//       {error && <div className="error-message">{error}</div>}
//     </div>
//   );
// }
// export default ChatInterface;