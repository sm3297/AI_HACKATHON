import React, { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './Chat.css'; 

const CHAT_WEBHOOK_URL = "https://primary-production-b57a.up.railway.app/webhook/f2bddafa-e050-40c6-8a32-697c7dce9527"; 

const DEMO_CUSTOMER_ID = 'customer-1234';

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
            credentials: 'omit', // CORS 문제 방지
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