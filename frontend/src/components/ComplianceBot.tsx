import React, { useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Briefcase, 
  Send, 
  Loader2,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface ComplianceBotProps {
  mode: 'ask' | 'tasks';
  setMode: (mode: 'ask' | 'tasks') => void;
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
  topic: string;
  tasks: string;
  renderTasks: (taskText: string) => React.ReactNode;
}

const ComplianceBot: React.FC<ComplianceBotProps> = ({ 
  mode, 
  setMode, 
  messages, 
  input, 
  setInput, 
  isLoading, 
  onSendMessage,
  topic,
  tasks,
  renderTasks
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="compliance-bot-view" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Compliance Assistant</h2>
          <p>Analyzing: <strong style={{ color: 'var(--primary-600)' }}>{topic}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--slate-100)', padding: '4px', borderRadius: '8px' }}>
          <button 
            className={`btn ${mode === 'ask' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={() => setMode('ask')}
          >
            <MessageSquare size={14} style={{ marginRight: '6px' }} />
            Q&A
          </button>
          <button 
            className={`btn ${mode === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={() => setMode('tasks')}
          >
            <Briefcase size={14} style={{ marginRight: '6px' }} />
            Tasks
          </button>
        </div>
      </div>

      <div className="bot-content-area" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--slate-200)', marginTop: '16px' }}>
        <AnimatePresence mode="wait">
          {mode === 'ask' ? (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ flex: 1, overflowY: 'auto', padding: '24px' }}
            >
              {messages.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-400)', textAlign: 'center' }}>
                  <Bot size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p>Ask anything about the uploaded RBI circular.</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  className={`message ${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    marginBottom: '16px', 
                    display: 'flex', 
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' 
                  }}
                >
                  <div style={{ 
                    maxWidth: '80%', 
                    padding: '12px 16px', 
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    backgroundColor: msg.role === 'user' ? 'var(--primary-600)' : 'var(--slate-100)',
                    color: msg.role === 'user' ? 'white' : 'var(--slate-800)',
                    borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                    borderBottomLeftRadius: msg.role === 'bot' ? '2px' : '12px',
                  }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="message bot" style={{ display: 'flex', marginBottom: '16px' }}>
                  <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--slate-100)', borderBottomLeftRadius: '2px' }}>
                    <Loader2 className="spin" size={20} color="var(--primary-600)" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </motion.div>
          ) : (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ flex: 1, overflowY: 'auto', padding: '24px' }}
            >
              {isLoading && !tasks ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Loader2 className="spin" size={48} color="var(--primary-600)" />
                  <p style={{ marginTop: '16px', color: 'var(--slate-500)' }}>Analyzing circular for department tasks...</p>
                </div>
              ) : (
                <div className="tasks-container">
                  {renderTasks(tasks)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {mode === 'ask' && (
          <div className="bot-input-area" style={{ padding: '16px', borderTop: '1px solid var(--slate-200)' }}>
            <div className="input-wrapper" style={{ display: 'flex', gap: '8px' }}>
              <input 
                className="form-input"
                style={{ flex: 1, borderRadius: '24px', paddingLeft: '20px' }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                placeholder={`Ask about ${topic}...`}
              />
              <button 
                className="btn btn-primary"
                style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={onSendMessage}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .task-card {
          background-color: white;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid var(--slate-200);
        }
        .task-card h4 {
          color: var(--primary-700);
          margin-bottom: 12px;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--slate-100);
          padding-bottom: 8px;
        }
        .task-card ul {
          padding-left: 16px;
          list-style-type: disc;
        }
        .task-card li {
          font-size: 0.8rem;
          margin-bottom: 8px;
          color: var(--slate-600);
        }
      `}</style>
    </div>
  );
};

export default ComplianceBot;
