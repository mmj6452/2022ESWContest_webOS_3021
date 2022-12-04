import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Album from "./routes/Album";
import Camera from "./routes/Camera";
import Main from "./routes/Main";

function App() {
  const [items, setItems] = useState([]);

  const webSocketUrl = "ws://websocket.com";
  let ws = useRef(null);

  // 소켓 객체 생성
  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(webSocketUrl);
      ws.current.onopen = () => {
        console.log("connected to " + webSocketUrl);
      };
      ws.current.onclose = () => {
        console.log("disconnect from " + webSocketUrl);
      };
      ws.current.onerror = () => {
        console.log("connection error " + webSocketUrl);
      };
      ws.current.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log(data);
        setItems((prevItems) => [...prevItems, data]);
      };
    }

    return () => {
      console.log("clean up");
      ws.current.close();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/album" element={<Album />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
