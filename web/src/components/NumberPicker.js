import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BsDash, BsPlus } from "react-icons/bs";

function NumberPicker({ value = 0, min = 0, max = 100, onChange, ...props }) {
  const [number, setNumber] = useState(value);

  function onIncrease() {
    if (number < max) {
      onChange(number + 1);
      setNumber((value) => value + 1);
    }
  }

  function onDecrease() {
    if (number > min) {
      onChange(number - 1);
      setNumber((value) => value - 1);
    }
  }

  return (
    <InputGroup {...props}>
      <Button
        variant="outline-secondary"
        onClick={onDecrease}
        className="d-flex align-items-center"
      >
        <BsDash />
      </Button>
      <Form.Control className="text-center" value={number} readOnly />
      <Button
        variant="outline-secondary"
        onClick={onIncrease}
        className="d-flex align-items-center"
      >
        <BsPlus />
      </Button>
    </InputGroup>
  );
}

export default NumberPicker;
