import { useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import NumberPicker from "./NumberPicker";

function Temperature({ value, ...props }) {
  const [modalShow, setModalShow] = useState(false);
  const [userTemperature, setUserTemperature] = useState(30);

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
            text={value + "°"}
            minValue="15"
            maxValue="35"
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              trailColor: "WhiteSmoke",
              pathColor: "Turquoise",
              textColor: "Black",
            })}
          />
          <Card.Title>수온</Card.Title>
        </Card.Body>
      </Card>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        {...props}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>수온</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>희망온도</h4>
          <NumberPicker
            min="15"
            max="35"
            value={userTemperature}
            onChange={(value) => setUserTemperature(value)}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Temperature;
