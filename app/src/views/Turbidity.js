import RangePicker from "@enact/sandstone/RangePicker";
import Button from "@enact/sandstone/Button";
import { Panel, Header } from "@enact/sandstone/Panels";
import Heading from "@enact/sandstone/Heading";
import BodyText from "@enact/sandstone/BodyText";
import { useCallback, useEffect, useState } from "react";

import LS2Request from "@enact/webos/LS2Request";

const bridge = new LS2Request();
const serviceUrl = "luna://com.dabyeol.riumaqua.service";

const Turbidity = (props) => {
  const [waterCycle, setWaterCycle] = useState(12);

  useEffect(() => {
    const request = {
      service: serviceUrl,
      method: "getWaterCycle",
      onSuccess: (msg) => {
        setWaterCycle(msg.data);
      },
      onFailure: (e) => {
        console.log("failure - getWaterCycle " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  const handleChange = useCallback((event) => {
    setWaterCycle(event.value);

    const request = {
      service: serviceUrl,
      parameters: {
        value: event.value,
      },
      method: "setWaterCycle",
      onSuccess: () => {
        console.log("success - setWaterCycle");
      },
      onFailure: (e) => {
        console.log("failure - setWaterCycle " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  const handleClick = useCallback(() => {
    const request = {
      service: serviceUrl,
      method: "resetWaterChange",
      onSuccess: () => {
        console.log("success - resetWaterChange");
      },
      onFailure: (e) => {
        console.log("failure - resetWaterChange " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  return (
    <Panel {...props}>
      <Header>
        <title>Rium Aqua</title>
        <subtitle>탁도</subtitle>
      </Header>

      <Heading>물갈이 주기 (일)</Heading>
      <RangePicker
        value={waterCycle}
        min={1}
        max={30}
        onChange={handleChange}
      />
      <BodyText />
      <Button onClick={handleClick}>주기 초기화</Button>
      <BodyText />
    </Panel>
  );
};

export default Turbidity;
