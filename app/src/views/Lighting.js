import RangePicker from "@enact/sandstone/RangePicker";
import { Panel, Header } from "@enact/sandstone/Panels";
import Heading from "@enact/sandstone/Heading";
import BodyText from "@enact/sandstone/BodyText";
import { useCallback, useEffect, useState } from "react";

import LS2Request from "@enact/webos/LS2Request";
// import TimePicker from "@enact/sandstone/TimePicker";

const bridge = new LS2Request();
const serviceUrl = "luna://com.dabyeol.riumaqua.service";

const Lighting = (props) => {
  const [lighting, setLighting] = useState(1);

  useEffect(() => {
    const request = {
      service: serviceUrl,
      method: "getLighting",
      onSuccess: (msg) => {
        setLighting(msg.data);
      },
      onFailure: (e) => {
        console.log("failure - getLighting " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  const handleChange = useCallback((event) => {
    setLighting(event.value);

    const request = {
      service: serviceUrl,
      parameters: {
        value: event.value,
      },
      method: "setLighting",
      onSuccess: () => {
        console.log("success - setLighting");
      },
      onFailure: (e) => {
        console.log("failure - setLighting " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  return (
    <Panel {...props}>
      <Header>
        <title>Rium Aqua</title>
        <subtitle>조명</subtitle>
      </Header>

      <Heading>조명 세기</Heading>
      <RangePicker value={lighting} min={0} max={3} onChange={handleChange} />
      <BodyText />

      {/* <Heading>조명 켜기 예약</Heading>
      <TimePicker value={new Date()} noLabel />
      <BodyText />

      <Heading>조명 끄기 예약</Heading>
      <TimePicker value={new Date()} noLabel />
      <BodyText /> */}
    </Panel>
  );
};

export default Lighting;
