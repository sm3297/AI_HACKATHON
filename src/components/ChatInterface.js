// import React, { useState, useEffect, useRef } from 'react';
// import MessageList from './MessageList';
// import MessageInput from './MessageInput';
// import './Chat.css';

// const ChatInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   // 세션 ID는 새로고침 전까지 유지되도록 useRef나 useState로 관리 (간단히 랜덤 문자열 생성)
//   const sessionIdRef = useRef('session-' + Math.random().toString(36).substr(2, 9));

//   // [중요] n8n Webhook URL
//   // 제공해주신 JSON의 Webhook ID(f2bddafa...)를 기반으로 한 주소입니다.
//   // 앞부분의 도메인(예: https://n8n.your-domain.com)은 본인의 n8n 주소로 꼭 바꿔주세요!
//   const N8N_WEBHOOK_URL = 'https://primary-production-b57a.up.railway.app/webhook-test/f2bddafa-e050-40c6-8a32-697c7dce9527';
  

//   const handleSendMessage = async (text) => {
//     if (!text.trim()) return;

//     // 1. 사용자 메시지 UI 추가
//     const userMessage = { sender: 'user', text: text };
//     setMessages((prev) => [...prev, userMessage]);
//     setIsLoading(true);

//     try {
//       // 2. n8n으로 데이터 전송
//       const response = await fetch(N8N_WEBHOOK_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           // n8n의 'Edit_Field1' 노드가 이 이름들을 기다리고 있습니다.
//           chatInput: text, 
//           sessionId: sessionIdRef.current 
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       // 3. 응답 처리
//       // 현재 워크플로우 상 AI가 '의도(intent)'를 분류해서 보내줍니다.
//       // 예: { intent: "PERSONAL_DB", ... }
      
//       let botText = "";
      
//       // 응답 데이터 구조에 따라 출력 메시지 결정
//       if (data.intent) {
//         botText = `[시스템 분석 결과]\n사용자의 의도는 "${data.intent}" 입니다.`;
//         // 추후 n8n에서 실제 답변 노드를 연결하면 data.output 등을 사용하면 됩니다.
//       } else if (data.output) {
//         botText = data.output;
//       } else {
//         botText = JSON.stringify(data); // 디버깅용: 날것의 데이터 보여주기
//       }

//       const botMessage = { sender: 'bot', text: botText };
//       setMessages((prev) => [...prev, botMessage]);

//     } catch (error) {
//       console.error('Error sending message:', error);
//       setMessages((prev) => [...prev, { 
//         sender: 'bot', 
//         text: '죄송합니다. 서버 연결에 실패했습니다. (CORS 또는 주소를 확인해주세요)' 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="chat-interface">
//       <div className="chat-header">
//         <h2>Bank AI Assistant</h2>
//       </div>
//       <MessageList messages={messages} />
//       {isLoading && <div className="loading-indicator">AI가 분석 중입니다...</div>}
//       <MessageInput onSendMessage={handleSendMessage} />
//     </div>
//   );
// };

// // export default ChatInterface;
// import React, { useState, useRef } from 'react';
// import MessageList from './MessageList';
// import MessageInput from './MessageInput';
// import './Chat.css';

// // ✅ Vercel Rewrite를 통해 Railway로 가는 '뒷문' 주소
// const N8N_WEBHOOK_URL = '/api/chat';

// const ChatInterface = () => {
//   const [messages, setMessages] = useState([
//     { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }
//   ]);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // ✅ 세션 ID 유지 (새로고침 전까지)
//   const sessionIdRef = useRef('session-' + Math.random().toString(36).substr(2, 9));

//   const handleSendMessage = async (text) => {
//     if (!text.trim()) return;

//     // 1. 내 메시지 화면에 표시
//     setMessages((prev) => [...prev, { sender: 'user', text: text }]);
//     setIsLoading(true);

//     try {
//       // 2. n8n으로 전송 (뒷문으로)
//       const response = await fetch(N8N_WEBHOOK_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           // ✅ n8n 워크플로우가 기다리는 정확한 이름!
//           chatInput: text, 
//           sessionId: sessionIdRef.current 
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Network error: ${response.status}`);
//       }

//       const data = await response.json();

//       // 3. n8n 응답 처리 (워크플로우 로직에 맞춤)
//       let botText = "죄송합니다. 답변을 이해하지 못했어요.";

//       if (data.intent) {
//          // 라우터 결과만 왔을 때
//         botText = `[분석 완료] 사용자의 의도: ${data.intent}`;
//       } else if (data.output) {
//          // 최종 답변이 왔을 때
//         botText = data.output;
//       } else if (data.text) {
//         botText = data.text;
//       } else {
//         // 디버깅용: 데이터 구조가 다를 때 원본 보여주기
//         botText = JSON.stringify(data); 
//       }

//       setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);

//     } catch (error) {
//       console.error('Error:', error);
//       setMessages((prev) => [...prev, { 
//         sender: 'bot', 
//         text: '서버 연결에 실패했습니다. (vercel.json 설정 확인 필요)' 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="chat-interface">
//       <div className="chat-header">
//         <h2>Bank AI (Proxy Mode)</h2>
//       </div>
//       {/* MessageList와 Input 컴포넌트에 props 이름 맞춤 */}
//       <MessageList messages={messages} />
//       {isLoading && <div className="loading">AI가 생각 중...</div>}
//       <MessageInput onSendMessage={handleSendMessage} />
//     </div>
//   );
// };

// export default ChatInterface;

import React, { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './Chat.css'; 

const CHAT_WEBHOOK_URL = "https://primary-production-b57a.up.railway.app/webhook/f2bddafa-e050-40c6-8a32-697c7dce9527"; 

const DEMO_CUSTOMER_ID = '홍길동20251140390';

function ChatInterface() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (inputText) => {
    setError(null);
    setMessages(prev => [...prev, { sender: 'user', text: inputText }]);
    setIsLoading(true);

    try {
        const response = await fetch(CHAT_WEBHOOK_URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                // 필요하다면 유지, n8n Webhook 설정에 따라 선택사항
                // 'X-Customer-Id': DEMO_CUSTOMER_ID 
            },
            body: JSON.stringify({
                // [수정 2] n8n 워크플로우 변수명과 일치시켰습니다. (message -> chatInput)
                chatInput: inputText,
                // [수정 3] n8n의 Edit_Field1에서 sessionId를 받으므로 추가했습니다.
                sessionId: DEMO_CUSTOMER_ID 
            })
        });

        if (!response.ok) {
            throw new Error(`API 응답 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json(); 
        console.log("n8n 전체 응답 확인:", data); // 브라우저 콘솔(F12)에서 응답 구조 확인용

        // [수정 4] n8n의 Respond to Webhook이 보내는 키값에 맞춰 수정해야 합니다.
        // 보통 AI Agent는 'output' 또는 'text'로 보냅니다. 
        // 만약 응답이 안 보이면 콘솔 로그를 보고 'data.output' 부분을 수정하세요.
        const botResponse = data.output || data.text || data.answer || JSON.stringify(data);

        setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);

    } catch (e) {
        setError('챗봇 응답을 받지 못했습니다. n8n 연결을 확인하세요.');
        console.error("Fetch Error:", e);
        setMessages(prev => [...prev, { sender: 'bot', text: '죄송합니다. 서버 통신에 실패했어요.' }]);
    } finally {
        setIsLoading(false); 
    }
};

  return (
    <div className="chat-interface">
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={handleSend} disabled={isLoading} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
export default ChatInterface;