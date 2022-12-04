import { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import NumberPicker from "./NumberPicker";

function Feed({ value, ...props }) {
  const [modalShow, setModalShow] = useState(false);
  const [feedingInterval, setWaterCycle] = useState(12);

  return (
    <>
      <Card
        {...props}
        className="text-center"
        onClick={() => setModalShow(true)}
      >
        <Card.Body>
          <CircularProgressbar
            value={value}
            text={value + "%"}
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              trailColor: "WhiteSmoke",
              pathColor: "Peru",
              textColor: "Black",
            })}
          />
          <Card.Title>먹이</Card.Title>
        </Card.Body>
      </Card>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        {...props}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>먹이</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>급여 간격 (시간)</h4>
          <NumberPicker
            min="6"
            max="24"
            value={feedingInterval}
            onChange={(value) => setWaterCycle(value)}
          />
        </Modal.Body>
        <Modal.Body>
          <Button>먹이량 초기화</Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Feed;
