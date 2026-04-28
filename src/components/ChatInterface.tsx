'use client';

import React, { useState } from 'react';
import styles from './ChatInterface.module.css';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Analysis complete. What would you like to know about this COT report?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const newMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Based on the institutional positioning, the ${text.includes('divergence') ? 'divergence indicates a potential reversal' : 'data aligns with the current trend'}.`
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickPrompts = [
    "Explain the Asset Manager divergence",
    "What is the most likely scenario next week?",
    "Summarize the Dealer positioning"
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Interactive COT Assistant</h3>
      </div>
      
      <div className={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.wrapperUser : styles.wrapperAi}`}>
            <div className={`${styles.message} ${msg.role === 'user' ? styles.msgUser : styles.msgAi}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.messageWrapper} ${styles.wrapperAi}`}>
            <div className={`${styles.message} ${styles.msgAi} ${styles.typing}`}>
              ...
            </div>
          </div>
        )}
      </div>

      <div className={styles.quickPrompts}>
        {quickPrompts.map((prompt, idx) => (
          <button 
            key={idx} 
            className={styles.promptBtn}
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          placeholder="Ask a question about the analysis..." 
          className={styles.input}
        />
        <button 
          className={styles.sendBtn}
          onClick={() => handleSend(input)}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
