import { Alert, Container } from "react-bootstrap";
import Header from "../components/Header";

function Album() {
  return (
    <>
      <Header />
      <Container className="p-3">
        <Alert variant="warning">앨범</Alert>
      </Container>
    </>
  );
}

export default Album;
