import Heading from "@enact/sandstone/Heading";
import SwitchItem from "@enact/sandstone/SwitchItem";

import LS2Request from "@enact/webos/LS2Request";

import { useCallback, useState } from "react";

const bridge = new LS2Request();
const serviceUrl = "luna://com.dabyeol.riumaqua.service";

function LightingTab() {
  const [ledStatus, setLedStatus] = useState(false);

  const handleLed = useCallback((event) => {
    const request = {
      service: serviceUrl,
      method: "setLedState",
      parameters: {
        value: event.selected,
      },
      onSuccess: () => console.log("success - set value gpio4"),
      onFailure: (e) =>
        console.log("failure - set value gpio4 " + e.returnValue),
    };
    bridge.send(request);

    setLedStatus(event.selected);
  }, []);

  return (
    <>
      <Heading>Lighting</Heading>
      <SwitchItem selected={ledStatus} onToggle={handleLed}>
        Light is {ledStatus ? "on" : "off"}.
      </SwitchItem>
    </>
  );
}

export default LightingTab;
