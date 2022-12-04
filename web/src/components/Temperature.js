import { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import NumberPicker from "./NumberPicker";

function Temperature({ value, ws, ...props }) {
  const [modalShow, setModalShow] = useState(false);
  const [userTemperature, setUserTemperature] = useState(30);

  if (ws) {
    const msg = {
      method: "getUserTemperature",
    };
    ws.send(JSON.stringify(msg));
  }

  function handleChange(value) {
    setUserTemperature(value);

    if (ws) {
      const msg = {
        method: "setUserTemperature",
        value: value,
      };

      ws.send(JSON.stringify(msg));
    }
  }

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
            minValue="15"
            maxValue="35"
            value={userTemperature}
            onChange={handleChange}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Temperature;
