import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Simple markdown renderer: bold, inline code, code blocks, bullets
function RenderMarkdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: JSX.Element[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3)
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} style={{ background: 'rgba(0,0,0,0.08)', borderRadius: 6, padding: '8px 10px', fontSize: 11, overflowX: 'auto', margin: '4px 0', fontFamily: 'monospace' }}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      i++
      continue
    }

    // Heading
    if (line.startsWith('### ')) {
      elements.push(<p key={i} style={{ fontWeight: 700, fontSize: 12, margin: '6px 0 2px' }}>{line.slice(4)}</p>)
    } else if (line.startsWith('## ')) {
      elements.push(<p key={i} style={{ fontWeight: 700, fontSize: 13, margin: '6px 0 2px' }}>{line.slice(3)}</p>)
    } else if (line.startsWith('# ')) {
      elements.push(<p key={i} style={{ fontWeight: 700, fontSize: 14, margin: '6px 0 2px' }}>{line.slice(2)}</p>)
    } else if (line.match(/^[-*•] /)) {
      // Bullet
      elements.push(
        <div key={i} style={{ display: 'flex', gap: 6, margin: '1px 0' }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>•</span>
          <span>{inlineFormat(line.replace(/^[-*•] /, ''))}</span>
        </div>
      )
    } else if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\. /)?.[1]
      elements.push(
        <div key={i} style={{ display: 'flex', gap: 6, margin: '1px 0' }}>
          <span style={{ flexShrink: 0, fontWeight: 600, minWidth: 16 }}>{num}.</span>
          <span>{inlineFormat(line.replace(/^\d+\. /, ''))}</span>
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: 4 }} />)
    } else {
      elements.push(<p key={i} style={{ margin: '1px 0', lineHeight: 1.5 }}>{inlineFormat(line)}</p>)
    }
    i++
  }
  return <div style={{ fontSize: 12.5 }}>{elements}</div>
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} style={{ background: 'rgba(0,0,0,0.1)', padding: '0 3px', borderRadius: 3, fontFamily: 'monospace', fontSize: 11 }}>{part.slice(1, -1)}</code>
    return part
  })
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! 👋 I am your CareerNavigator AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content }))
      });
      setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.';
      setMessages([...newMessages, { role: 'assistant', content: `⚠️ ${msg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Career Assistant</h3>
                  <p className="text-xs text-blue-100">AI Powered Guide</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex flex-col gap-3"
            >
              {messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-indigo-600'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant'
                      ? <RenderMarkdown text={msg.content} />
                      : msg.content}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-indigo-600">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-sm flex gap-1 items-center">
                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 pl-4 rounded-full">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 py-2"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <Send size={16} className={input.trim() && !isLoading ? 'ml-0.5' : ''} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group"
          >
            <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
