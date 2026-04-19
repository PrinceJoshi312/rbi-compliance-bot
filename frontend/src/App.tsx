import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import UploadCompliance from './components/UploadCompliance';
import DocumentStatus from './components/DocumentStatus';
import ComplianceBot from './components/ComplianceBot';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mode, setMode] = useState<'ask' | 'tasks'>('ask');
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [topic, setTopic] = useState('the uploaded circular');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<string>('');

  const handleFileUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    setIsUploading(true);
    setIsUploaded(false); // Reset status for new upload
    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setIsUploaded(true);
        setTopic(data.topic);
        setMessages([{ role: 'bot', content: `Hello! I've processed the circular regarding **${data.topic}**. You can now ask questions or generate actionable tasks.` }]);
        // Automatically switch to the bot view after upload
        setActiveView('bot');
      } else {
        alert(data.detail || 'Upload failed');
      }
    } catch {
      alert('Failed to connect to backend.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error processing your request.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: 'Connection to backend failed.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/tasks`, { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setTasks(data.response);
      }
    } catch {
      alert('Failed to generate tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearActivity = async () => {
    if (!confirm('Are you sure you want to clear all logs and activity? This will reset the current document session.')) return;
    
    setIsLoading(true);
    try {
      await fetch(`${API_BASE}/clear`, { method: 'POST' });
      setMessages([]);
      setTasks('');
      setIsUploaded(false);
      setTopic('the uploaded circular');
      alert('Activity cleared successfully.');
    } catch {
      alert('Failed to clear activity on server, but local logs cleared.');
      setMessages([]);
      setTasks('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'tasks' && isUploaded && !tasks) {
      // Use a small delay to avoid synchronous state update in effect
      const timer = setTimeout(() => {
        generateTasks();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [mode, isUploaded, tasks]);

  const renderTasks = (taskText: string) => {
    if (!taskText) return null;
    const sections = taskText.split('\n\n');
    return (
      <div className="task-grid">
        {sections.map((section, idx) => {
          const lines = section.split('\n');
          const title = lines[0].replace(':', '');
          const items = lines.slice(1).map(l => l.replace('- ', ''));
          return (
            <motion.div 
              key={idx} 
              className="task-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h4>{title}</h4>
              <ul>
                {items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return (
          <UploadCompliance 
            onUpload={handleFileUpload} 
            isUploading={isUploading} 
            isUploaded={isUploaded} 
          />
        );
      case 'reports':
        return <DocumentStatus />;
      case 'bot':
        if (!isUploaded) {
          return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <h3 style={{ marginBottom: '16px' }}>No Active Document</h3>
              <p style={{ color: 'var(--slate-500)', marginBottom: '24px' }}>Please upload a circular first to use the Compliance Assistant.</p>
              <button className="btn btn-primary" onClick={() => setActiveView('upload')}>Go to Upload</button>
            </div>
          );
        }
        return (
          <ComplianceBot 
            mode={mode}
            setMode={setMode}
            messages={messages}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            topic={topic}
            tasks={tasks}
            renderTasks={renderTasks}
          />
        );
      case 'logs':
        return (
          <div className="placeholder-view">
            <h2>Activity Logs</h2>
            <p>User activity and system logs will appear here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="placeholder-view">
            <h2>Settings</h2>
            <p style={{ marginBottom: '24px' }}>Configure your compliance bot preferences.</p>
            
            <div className="settings-section" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
              <h4 style={{ marginBottom: '16px' }}>Activity Management</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '16px' }}>
                Clearing activity will remove all chat history and reset the current document session.
              </p>
              <button 
                className="btn" 
                style={{ backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fecaca' }}
                onClick={handleClearActivity}
                disabled={isLoading}
              >
                {isLoading ? 'Clearing...' : 'Clear logs or activity'}
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app-shell ${isMenuOpen ? 'menu-open' : ''}`}>
      <Sidebar activeView={activeView} setActiveView={(view) => { setActiveView(view); setIsMenuOpen(false); }} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="main-container">
        <TopBar onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />
        
        <main className="content-wrapper">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
