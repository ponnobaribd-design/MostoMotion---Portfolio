import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../geminiService';

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Notify the app of messenger window toggle state change
    window.dispatchEvent(new CustomEvent('messenger-toggle', { detail: { open: isOpen } }));
  }, [isOpen]);

  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "I am Mosto's AI assistant, ready to provide you with all the information about his elite motion graphics and video editing services." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const aiMsg = await getAIResponse(userMsg);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: aiMsg }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div messenger-window-selector="" className="w-80 md:w-96 glass rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
          <div className="bg-neutral-800 p-4 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <i className="fas fa-robot text-cyan-400"></i>
              </div>
              <span className="header-font font-bold text-white text-[11px] tracking-widest uppercase">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-all">
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <div className="h-[350px] overflow-y-auto p-6 space-y-6 bg-[#030308]/98">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-neutral-800 text-white shadow-lg' 
                    : 'bg-white/5 text-gray-400 border border-white/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 text-gray-500 p-4 rounded-xl text-[10px] italic border border-white/5">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-neutral-900 flex gap-2 border-t border-white/5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ASK ABOUT SERVICES..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00ff9d] transition-all"
            />
            <button 
              onClick={handleSend}
              className="bg-white text-black w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#00ff9d] transition-all shadow-md"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 glass rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform group border border-white/10"
        >
          <i className="fas fa-comment-dots text-[#00ff9d] text-2xl"></i>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9d] opacity-40"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff9d] border-2 border-white shadow-sm"></span>
          </span>
        </button>
      )}
    </div>
  );
};

export default AIChatAssistant;
