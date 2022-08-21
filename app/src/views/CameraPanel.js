import kind from "@enact/core/kind";
import { Panel, Header } from "@enact/sandstone/Panels";

const CameraPanel = kind({
  name: "CameraPanel",

  render: (props) => (
    <Panel {...props}>
      <Header>
        <title>Rium</title>
        <subtitle>Aqua</subtitle>
      </Header>
    </Panel>
  ),
});

export default CameraPanel;
