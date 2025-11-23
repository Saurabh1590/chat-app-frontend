export interface ChatMessage {
  type: 'chat' | 'system' | 'history' | 'welcome';
  message?: string;
  username?: string;
  senderId?: string;
  timestamp?: number;
  messages?: ChatMessage[]; // For history payload
  userId?: string; // For welcome payload
}

export interface UserCredentials {
  username: string;
  roomId: string;
}