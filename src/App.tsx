import { useState, useEffect } from "react";
import { JoinScreen } from "./components/JoinScreen";
import { ChatRoom } from "./screens/ChatRoom";
import type { UserCredentials } from "./types";

function App() {
  const [joined, setJoined] = useState(false);
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: "",
    roomId: "",
  });

  // ⭐ Auto-restore session on page refresh
  useEffect(() => {
    const username = localStorage.getItem("username");
    const roomId = localStorage.getItem("roomId");

    if (username && roomId) {
      setCredentials({ username, roomId });
      setJoined(true);
    }
  }, []);

  // ⭐ Save username + roomId on join
  const handleJoin = (username: string, roomId: string) => {
    localStorage.setItem("username", username);
    localStorage.setItem("roomId", roomId);

    setCredentials({ username, roomId });
    setJoined(true);
  };

  // ⭐ Clear storage when leaving room manually
  const handleLeave = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("roomId");
    localStorage.removeItem("userId"); 

    setJoined(false);
    setCredentials({ username: "", roomId: "" });
  };

  if (!joined) {
    return <JoinScreen onJoin={handleJoin} />;
  }

  return (
    <ChatRoom
      username={credentials.username}
      roomId={credentials.roomId}
      onLeave={handleLeave}
    />
  );
}

export default App;
