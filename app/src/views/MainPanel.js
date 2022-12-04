import Button from "@enact/sandstone/Button";
import { Panel, Header } from "@enact/sandstone/Panels";
import Item from "@enact/sandstone/Item";
import Repeater from "@enact/ui/Repeater";
import Indicator from "../components/Indicator/Indicator";
import LS2Request from "@enact/webos/LS2Request";
import { useState, useEffect } from "react";

const bridge = new LS2Request();
const serviceUrl = "luna://com.dabyeol.riumaqua.service";

const MainPanel = ({
  onSelectAlbum,
  onSelectCamera,
  onSelectIndicator,
  ...rest
}) => {
  const [indicators, setIndicators] = useState([
    {
      title: "수온",
      color: "#00CED1",
      key: 0,
      progress: 15,
      min: 15,
      max: 35,
    },
    { title: "탁도", color: "#00AD83", key: 1, progress: 0 },
    { title: "먹이", color: "#C67700", key: 2, progress: 0 },
    { title: "조도", color: "#FFC72C", key: 3, progress: 0 },
  ]);
  const [waterChange, setWaterChange] = useState(14);

  const getData = () => {
    const request = {
      service: serviceUrl,
      method: "getData",
      onSuccess: (msg) => {
        setIndicators([
          {
            title: "수온",
            color: "#00CED1",
            key: 0,
            progress: msg.data.temperature,
            min: 15,
            max: 35,
          },
          {
            title: "탁도",
            color: "#00AD83",
            key: 1,
            progress: msg.data.turbidity,
          },
          {
            title: "먹이",
            color: "#C67700",
            key: 2,
            progress: msg.data.feed,
          },
          {
            title: "조도",
            color: "#FFC72C",
            key: 3,
            progress: msg.data.illuminance,
          },
        ]);
        setWaterChange(msg.data.waterChange);
      },
      onFailure: (e) => {
        console.log("failure - getData " + e.returnValue);
      },
    };
    bridge.send(request);
  };

  useEffect(() => {
    getData();
    const interval = setInterval(getData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel {...rest}>
      <Header>
        <slotAfter>
          <Button icon="recording" size="small" onClick={onSelectCamera} />
          <Button icon="samples" size="small" onClick={onSelectAlbum} />
        </slotAfter>
        <title>Rium Aqua</title>
      </Header>

      <div align="center">
        <Repeater
          childComponent={Indicator}
          indexProp="index"
          itemProps={{ onSelect: onSelectIndicator }}
        >
          {indicators}
        </Repeater>
      </div>
      <div>
        <Item>
          {waterChange
            ? `물갈이 ${waterChange}일 남았습니다.`
            : "물을 갈아주세요."}
        </Item>
        {indicators[1].progress >= 50 && (
          <Item>
            탁도가 높습니다. 여과기 필터 및 물고기 폐사 여부를 확인해주세요.
          </Item>
        )}
        {indicators[2].progress <= 15 && <Item>먹이를 보충해주세요.</Item>}
      </div>
    </Panel>
  );
};

export default MainPanel;
