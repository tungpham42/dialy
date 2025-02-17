import React from "react";
import { Container } from "react-bootstrap";
import Game from "./components/Game";

function App() {
  return (
    <Container className="text-center mt-4">
      <h1>🌍 Game Địa Lý Việt Nam</h1>
      <p>Nhấp vào tỉnh/thành phố chính xác để ghi điểm!</p>
      <Game />
    </Container>
  );
}

export default App;
