import { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Lighting from "../components/Lighting";
import Temperature from "../components/Temperature";
import Turbidity from "../components/Turbidity";

function Main({ data, ws }) {
  return (
    <>
      <Header />
      <Container className="p-3">
        <div className="mb-4">
          <Row xs={4} md={4} className="g-3">
            <Col>
              <Temperature value={data.temperature} ws={ws} />
            </Col>
            <Col>
              <Turbidity value={data.turbidity} />
            </Col>
            <Col>
              <Feed value={data.feed} />
            </Col>
            <Col>
              <Lighting value={data.illuminance} />
            </Col>
          </Row>
        </div>

        {data.waterChange ? (
          <Alert>물갈이 {data.waterChange}일 남았습니다.</Alert>
        ) : (
          <Alert variant="warning">물을 갈아주세요.</Alert>
        )}
        {data.turbidity >= 50 && (
          <Alert variant="danger">
            탁도가 높습니다. 여과기 필터 및 물고기 폐사 여부를 확인해주세요.
          </Alert>
        )}
        {data.feed <= 15 && (
          <Alert variant="danger">먹이를 보충해주세요.</Alert>
        )}
      </Container>
    </>
  );
}

export default Main;
