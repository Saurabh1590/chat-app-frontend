import type { ChatMessage } from "../types"

interface MessageBubbleProps {
  msg: ChatMessage;
  isMe: boolean;
}

export const MessageBubble = ({ msg, isMe }: MessageBubbleProps) => {
  if (msg.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <span className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
          {msg.message}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
        {/* Sender Name (only for others) */}
        {!isMe && msg.username && (
          <div className="text-xs text-slate-500 mb-1 ml-1">{msg.username}</div>
        )}
        
        <div className={`
          px-4 py-2 rounded-2xl shadow-sm break-words
          ${isMe 
            ? 'bg-indigo-600 text-white rounded-br-none' 
            : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'}
        `}>
          {msg.message}
        </div>
        
        {/* Timestamp */}
        <div className={`text-[10px] mt-1 opacity-60 ${isMe ? 'text-right mr-1' : 'text-left ml-1'}`}>
          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </div>
      </div>
    </div>
  );
};