import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand href="#" onClick={() => navigate("/")}>
          Rium Aqua
        </Navbar.Brand>
        <Nav>
          <Nav.Link onClick={() => navigate("/camera")}>Camera</Nav.Link>
          <Nav.Link onClick={() => navigate("/album")}>Album</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
