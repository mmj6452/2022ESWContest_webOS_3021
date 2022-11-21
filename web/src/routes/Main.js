import { useState } from "react";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import Header from "../components/Header";

function Main() {
  const [waterChange, setWaterChange] = useState(14);

  return (
    <>
      <Header />
      <Container className="p-3">
        <div className="mb-4">
          <Row xs={2} xl={4} className="g-4">
            {[...Array(4)].map((_, index) => (
              <Col key={index}>
                <Card>
                  <Card.Body>Card</Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {waterChange ? <Alert variant="warning">물을 갈아주세요</Alert> : ""}
        <Alert variant="warning">먹이를 보충해주세요</Alert>
      </Container>
      {/* Modals */}
    </>
  );
}

export default Main;
