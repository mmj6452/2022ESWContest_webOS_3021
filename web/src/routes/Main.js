import { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Lighting from "../components/Lighting";
import Temperature from "../components/Temperature";
import Turbidity from "../components/Turbidity";

function Main() {
  const [temperature, setTemperature] = useState(26);
  const [turbidity, setTurbidity] = useState(10);
  const [feed, setFeed] = useState(90);
  const [illuminance, setIlluminance] = useState(50);
  const [waterChange, setWaterChange] = useState(14);

  return (
    <>
      <Header />
      <Container className="p-3">
        <div className="mb-4">
          <Row xs={4} md={4} className="g-3">
            <Col>
              <Temperature value={temperature} />
            </Col>
            <Col>
              <Turbidity value={turbidity} />
            </Col>
            <Col>
              <Feed value={feed} />
            </Col>
            <Col>
              <Lighting value={illuminance} />
            </Col>
          </Row>
        </div>

        {waterChange && <Alert variant="warning">물을 갈아주세요</Alert>}
        {feed <= 15 && <Alert variant="warning">먹이를 보충해주세요</Alert>}
      </Container>
    </>
  );
}

export default Main;
