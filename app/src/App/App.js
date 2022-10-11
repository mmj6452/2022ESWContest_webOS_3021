import kind from "@enact/core/kind";
import Changeable from "@enact/ui/Changeable";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import Panels from "@enact/sandstone/Panels";

import MainPanel from "../views/MainPanel";
import Camera from "../views/Camera";

import css from "./App.module.less";
import Temperature from "../views/Temperature";
import Turbidity from "../views/Turbidity";
import Feed from "../views/Feed";
import Lighting from "../views/Lighting";
import Album from "../views/Album";

const App = kind({
  name: "App",

  styles: {
    css,
    className: "app",
  },

  defaultProps: {
    index: 0,
  },

  handlers: {
    onNavigate: (ev, { onNavigate }) => {
      if (onNavigate) {
        onNavigate({
          index: 0,
        });
      }
    },
    onSelectCamera: (ev, { onNavigate }) => {
      if (onNavigate) {
        onNavigate({
          index: 1,
        });
      }
    },
    onSelectAlbum: (ev, { onNavigate }) => {
      if (onNavigate) {
        onNavigate({
          index: 2,
        });
      }
    },
    onSelectIndicator: (ev, { onNavigate }) => {
      if (onNavigate) {
        onNavigate({
          index: ev.index + 3,
        });
      }
    },
  },

  render: ({
    index,
    onSelectCamera,
    onSelectAlbum,
    onSelectIndicator,
    onNavigate,
    ...rest
  }) => (
    <Panels {...rest} index={index} onBack={onNavigate}>
      <MainPanel
        onSelectCamera={onSelectCamera}
        onSelectAlbum={onSelectAlbum}
        onSelectIndicator={onSelectIndicator}
      />
      <Camera />
      <Album />
      <Temperature />
      <Turbidity />
      <Feed />
      <Lighting />
    </Panels>
  ),
});

export default Changeable(
  { prop: "index", change: "onNavigate" },
  ThemeDecorator(App)
);
