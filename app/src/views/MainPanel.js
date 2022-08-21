import kind from "@enact/core/kind";
import Button from "@enact/sandstone/Button";
import { Panel, Header } from "@enact/sandstone/Panels";
import { TabLayout, Tab } from "@enact/sandstone/TabLayout";

import HomeTab from "./HomeTab";
import LightingTab from "./LightingTab";
import LogTab from "./LogTab";
import SettingsTab from "./SettingsTab";
import TemperatureTab from "./TemperatureTab";

const MainPanel = kind({
  name: "MainPanel",

  render: (props) => (
    <Panel {...props}>
      <Header>
        <slotAfter>
          <Button icon="recording" size="small" />
        </slotAfter>
        <title>Rium</title>
        <subtitle>Aqua</subtitle>
      </Header>
      <TabLayout>
        <Tab icon="home" title="Home">
          <HomeTab />
        </Tab>
        <Tab icon="arrowupdown" title="Temperature">
          <TemperatureTab />
        </Tab>
        <Tab icon="light" title="Lighting">
          <LightingTab />
        </Tab>
        <Tab icon="nowplaying" title="Log">
          <LogTab />
        </Tab>
        <Tab icon="gear" title="Settings">
          <SettingsTab />
        </Tab>
      </TabLayout>
    </Panel>
  ),
});

export default MainPanel;
