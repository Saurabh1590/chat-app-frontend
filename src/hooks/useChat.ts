import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types";

const WS_URL = "ws://localhost:8080";

export const useChat = (roomId: string, username: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      setConnectionStatus("connected");
      socket.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
            username,
            userId: localStorage.getItem("userId"), // ⭐ send existing ID
          },
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data: ChatMessage = JSON.parse(event.data);

        if (data.type === "welcome") {
          setMyUserId(data.userId || null);
          localStorage.setItem("userId", data.userId); // 🔥 persist userId
        } else if (data.type === "history" && data.messages) {
          setMessages(data.messages);
        } else if (data.type === "chat" || data.type === "system") {
          setMessages((prev) => [...prev, data]);
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    socket.onclose = () => {
      setConnectionStatus("disconnected");
    };

    return () => {
      socket.close();
    };
  }, [roomId, username]);

  const sendMessage = (text: string) => {
    if (!text.trim() || !ws.current) return;

    ws.current.send(
      JSON.stringify({
        type: "chat",
        payload: { message: text },
      })
    );
  };

  return { messages, sendMessage, connectionStatus, myUserId };
};
