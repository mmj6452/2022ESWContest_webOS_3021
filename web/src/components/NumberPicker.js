import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BsDash, BsPlus } from "react-icons/bs";

function NumberPicker({
  value = 0,
  minValue = 0,
  maxValue = 100,
  onChange,
  ...props
}) {
  const [number, setNumber] = useState(value);

  useEffect(() => setNumber(value), [value]);

  function onIncrease() {
    if (number < maxValue) {
      onChange(number + 1);
      setNumber((value) => ++value);
    }
  }

  function onDecrease() {
    if (number > minValue) {
      onChange(number - 1);
      setNumber((value) => --value);
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
