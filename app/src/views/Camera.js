import { Panel, Header } from "@enact/sandstone/Panels";
import Image from "@enact/sandstone/Image";
import { useEffect, useState } from "react";

import LS2Request from "@enact/webos/LS2Request";

const bridge = new LS2Request();
const serviceUrl = "luna://com.dabyeol.riumaqua.service";

const Camera = (props) => {
  const [image, setImage] = useState();

  const getImage = () => {
    const request = {
      service: serviceUrl,
      method: "getImage",
      onSuccess: (msg) => {
        setImage(msg.data);
      },
      onFailure: (e) => {
        console.log("failure - getImage " + e.returnValue);
      },
    };
    bridge.send(request);
  };

  useEffect(() => {
    getImage();
    const interval = setInterval(getImage, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel {...props}>
      <Header>
        <title>Rium Aqua</title>
        <subtitle>카메라</subtitle>
      </Header>

      <Image
        src={`data:image/jpeg;base64,${image}`}
        style={{ height: 400, width: 600 }}
      />
    </Panel>
  );
};

export default Camera;
