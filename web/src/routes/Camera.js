import { Alert, Container } from "react-bootstrap";
import Header from "../components/Header";

function Camera() {
  return (
    <>
      <Header />
      <Container className="p-3">
        <Alert variant="warning">카메라</Alert>
      </Container>
    </>
  );
}

export default Camera;
