import Heading from "@enact/sandstone/Heading";
import RangePicker from "@enact/sandstone/RangePicker";

import LS2Request from "@enact/webos/LS2Request";

import { useCallback, useState } from "react";

const bridge = new LS2Request();
const serviceUrl = "luna://com.dabyeol.riumaqua.service";

function TemperatureTab() {
  const [currentTemp, setCurrentTemp] = useState(10);

  return (
    <>
      <Heading>Temperature</Heading>
      <RangePicker
        value={currentTemp}
        min={0}
        max={100}
        incrementIcon=" "
        decrementIcon=" "
        joined
        orientation="vertical"
      />
      <RangePicker
        value={currentTemp}
        min={0}
        max={100}
        joined
        orientation="vertical"
      />
    </>
  );
}

export default TemperatureTab;
