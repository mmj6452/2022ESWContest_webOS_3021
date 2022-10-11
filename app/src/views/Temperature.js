import RangePicker from "@enact/sandstone/RangePicker";
import { Panel, Header } from "@enact/sandstone/Panels";
import Heading from "@enact/sandstone/Heading";
import BodyText from "@enact/sandstone/BodyText";
import { useCallback, useEffect, useState } from "react";

import LS2Request from "@enact/webos/LS2Request";

const bridge = new LS2Request();
const serviceUrl = "luna://com.dabyeol.riumaqua.service";

const Temperature = (props) => {
  const [userTemperature, setUserTemperature] = useState(30);

  useEffect(() => {
    const request = {
      service: serviceUrl,
      method: "getUserTemperature",
      onSuccess: (msg) => {
        setUserTemperature(msg.data);
      },
      onFailure: (e) => {
        console.log("failure - getUserTemperature " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  const handleChange = useCallback((event) => {
    setUserTemperature(event.value);

    const request = {
      service: serviceUrl,
      parameters: {
        value: event.value,
      },
      method: "setUserTemperature",
      onSuccess: () => {
        console.log("success - setUserTemperature");
      },
      onFailure: (e) => {
        console.log("failure - setUserTemperature " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  return (
    <Panel {...props}>
      <Header>
        <title>Rium Aqua</title>
        <subtitle>수온</subtitle>
      </Header>

      <Heading>희망온도</Heading>
      <RangePicker
        value={userTemperature}
        min={15}
        max={35}
        onChange={handleChange}
      />
      <BodyText />
    </Panel>
  );
};

export default Temperature;
