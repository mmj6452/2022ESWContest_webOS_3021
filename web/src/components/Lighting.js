import { useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import NumberPicker from "./NumberPicker";

function Lighting({ value, ...props }) {
  const [modalShow, setModalShow] = useState(false);
  const [lighting, setLighting] = useState(1);

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
            minValue="0"
            maxValue="100"
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              trailColor: "WhiteSmoke",
              pathColor: "Gold",
              textColor: "Black",
            })}
          />
          <Card.Title>조도</Card.Title>
        </Card.Body>
      </Card>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        {...props}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>조도</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>조명 세기</h4>
          <NumberPicker
            min="0"
            max="3"
            value={lighting}
            onChange={(value) => setLighting(value)}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Lighting;
