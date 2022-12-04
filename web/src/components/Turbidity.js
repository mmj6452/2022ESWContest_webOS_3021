import { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import NumberPicker from "./NumberPicker";

function Turbidity({ value, ...props }) {
  const [modalShow, setModalShow] = useState(false);
  const [waterCycle, setWaterCycle] = useState(12);

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
              pathColor: "YellowGreen",
              textColor: "Black",
            })}
          />
          <Card.Title>탁도</Card.Title>
        </Card.Body>
      </Card>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        {...props}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>탁도</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>물갈이 주기 (일)</h4>
          <NumberPicker
            min="1"
            max="30"
            value={waterCycle}
            onChange={(value) => setWaterCycle(value)}
          />
        </Modal.Body>
        <Modal.Body>
          <Button>물갈이 주기 초기화</Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Turbidity;
