import React, { useState, useEffect, useRef } from 'react';
import { Send, LogOut, MessageSquare } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from '../components/MessageBubble';

interface ChatRoomProps {
  username: string;
  roomId: string;
  onLeave: () => void;
}

export const ChatRoom = ({ username, roomId, onLeave }: ChatRoomProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use our custom hook!
  const { messages, sendMessage, connectionStatus, myUserId } = useChat(roomId, username);

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">#{roomId}</h2>
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                {connectionStatus === 'connected' ? 'Live' : 'Disconnected'}
              </div>
            </div>
          </div>
          <button 
            onClick={onLeave}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Leave Room"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <MessageBubble 
              key={idx} 
              msg={msg} 
              isMe={msg.senderId === myUserId} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-100 text-slate-900 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || connectionStatus !== 'connected'}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full p-3 transition-colors shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};