import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Album from "./routes/Album";
import Camera from "./routes/Camera";
import Main from "./routes/Main";
import { w3cwebsocket } from "websocket";

const ws = new w3cwebsocket("ws://riumaqua.dabyeol.com:3001");

function App() {
  const [data, setData] = useState({
    temperature: 26,
    turbidity: 10,
    feed: 90,
    illuminance: 50,
    waterChange: 14,
  });

  // useEffect(() => {
  //   setInterval(() => {
  //     // ws.send();
  //   }, 1000);
  // });

  ws.onopen = () => {
    console.log("Websocket connected.");
  };

  ws.onmessage = (e) => {
    console.log("Receive: " + e.data);
    const msg = JSON.parse(e.data);
    if (msg.msgType === "data") {
      setData(msg.value);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main data={data} ws={ws} />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/album" element={<Album />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
