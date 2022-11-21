import { BrowserRouter, Route, Routes } from "react-router-dom";
import Album from "./routes/Album";
import Camera from "./routes/Camera";
import Main from "./routes/Main";

function App() {
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
