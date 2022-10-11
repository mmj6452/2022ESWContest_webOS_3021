import RangePicker from "@enact/sandstone/RangePicker";
import Button from "@enact/sandstone/Button";
import { Panel, Header } from "@enact/sandstone/Panels";
import Heading from "@enact/sandstone/Heading";
import BodyText from "@enact/sandstone/BodyText";
import { useCallback, useEffect, useState } from "react";

import LS2Request from "@enact/webos/LS2Request";

const bridge = new LS2Request();
const serviceUrl = "luna://com.dabyeol.riumaqua.service";

const Feed = (props) => {
  const [feedingInterval, setFeedingInterval] = useState(12);

  useEffect(() => {
    const request = {
      service: serviceUrl,
      method: "getFeedingInterval",
      onSuccess: (msg) => {
        setFeedingInterval(msg.data);
      },
      onFailure: (e) => {
        console.log("failure - getFeedingInterval " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  const handleChange = useCallback((event) => {
    setFeedingInterval(event.value);

    const request = {
      service: serviceUrl,
      parameters: {
        value: event.value,
      },
      method: "setFeedingInterval",
      onSuccess: () => {
        console.log("success - setFeedingInterval");
      },
      onFailure: (e) => {
        console.log("failure - setFeedingInterval " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  const handleClick = useCallback(() => {
    const request = {
      service: serviceUrl,
      method: "resetFeed",
      onSuccess: () => {
        console.log("success - resetFeed");
      },
      onFailure: (e) => {
        console.log("failure - resetFeed " + e.returnValue);
      },
    };
    bridge.send(request);
  }, []);

  return (
    <Panel {...props}>
      <Header>
        <title>Rium Aqua</title>
        <subtitle>먹이</subtitle>
      </Header>

      <Heading>급여 간격 (시간)</Heading>
      <RangePicker
        value={feedingInterval}
        min={6}
        max={24}
        onChange={handleChange}
      />
      <BodyText />
      <Button onClick={handleClick}>먹이량 초기화</Button>
      <BodyText />
    </Panel>
  );
};

export default Feed;
