import { useEffect, useRef, useState } from "react"

function App() {

  const [messages, setMessages] = useState(["hello everyone", "Good Morning"]);
  const wsRef = useRef();

  

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"  
        }
      }))
    }
  }, [])

  return (
    <div className="h-full w-screen bg-[#634A92]">
      <div className="h-[95vh] m-4 border-solid border outline-white rounded-md">
        {
          messages.map((msg) => 
          <div className="m-5">
            <span className="bg-white text-[#634A92] p-2 rounded-md">{msg}</span>
          </div>)
        }
      </div>
      <div className="p-2 m-4 border-solid border-2 outline-white rounded-md flex justify-between">
        <input id="input" className="bg-[#1b0c37] w-full rounded-md" type="text"></input>
        <button onClick={() => {
          const message = document.getElementById("input")?.value;

          wsRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
              message: message,
            }
          }))
        }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ml-2">Send</button>
      </div>
    </div>
  )
}

export default App
