import kind from "@enact/core/kind";
import Image from "@enact/sandstone/Image";
import { Panel, Header } from "@enact/sandstone/Panels";

const Album = kind({
  name: "CameraPanel",

  render: (props) => (
    <Panel {...props}>
      <Header>
        <title>Rium Aqua</title>
        <subtitle>앨범</subtitle>
      </Header>

      <Image />
    </Panel>
  ),
});

export default Album;
