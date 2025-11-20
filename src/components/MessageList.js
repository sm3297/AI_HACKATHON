// import React, { useEffect, useRef } from 'react';

// function MessageList({ messages, isLoading }) {
//   const endOfMessagesRef = useRef(null); // 스크롤을 위한 Ref

//   // 새 메시지가 오면 맨 아래로 스크롤
//   useEffect(() => {
//     endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isLoading]);

//   return (
//     <div className="message-list">
//       {messages.map((msg, index) => (
//         <div key={index} className={`message-bubble ${msg.sender}`}>
//           {msg.text}
//         </div>
//       ))}
//       {/* 로딩 인디케이터  */}
//       {isLoading && (
//         <div className="message-bubble bot loading">
//           <span>.</span><span>.</span><span>.</span>
//         </div>
//       )}
//       {/* 스크롤 기준점 */}
//       <div ref={endOfMessagesRef} /> 
//     </div>
//   );
// }
// export default MessageList;


import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // 추가된 부분
import remarkGfm from 'remark-gfm';         // 추가된 부분

function MessageList({ messages, isLoading }) {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className={`message-bubble ${msg.sender}`}>
          {/* 일반 텍스트 대신 ReactMarkdown 컴포넌트 사용 */}
          {msg.sender === 'bot' ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} // 테이블, 리스트 등 지원 강화
              components={{
                // 링크가 있다면 새 창에서 열리도록 설정 (선택사항)
                a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
              }}
            >
              {msg.text}
            </ReactMarkdown>
          ) : (
            // 사용자가 보낸 메시지는 그냥 텍스트로 보여줘도 됨 (원하면 여기도 Markdown 적용 가능)
            msg.text
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="message-bubble bot loading">
          <span>.</span><span>.</span><span>.</span>
        </div>
      )}
      <div ref={endOfMessagesRef} /> 
    </div>
  );
}

export default MessageList;