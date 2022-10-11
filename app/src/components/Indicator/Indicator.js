import kind from "@enact/core/kind";
import Spottable from "@enact/spotlight/Spottable";
import ProgressBar from "react-customizable-progressbar";

import css from "./Indicator.module.less";

const Indicator = kind({
  name: "Indicator",
  styles: {
    css,
    className: "indicator",
  },
  defaultProps: {
    progress: 50,
    min: 0,
    max: 100,
    title: "Title",
    color: "#FFFFFF",
  },
  handlers: {
    onSelect: (ev, { index, onSelect }) => {
      if (onSelect) {
        onSelect({ index });
      }
    },
  },
  render: ({ onSelect, progress, min, max, title, color, ...rest }) => {
    delete rest.index;

    return (
      <div {...rest} onClick={onSelect}>
        <ProgressBar
          progress={progress - min}
          steps={max - min}
          radius="80"
          cut="120"
          rotate="150"
          strokeColor="none"
          trackStrokeWidth="24"
          trackStrokeColor={color}
          pointerRadius="12"
          pointerFillColor="none"
          pointerStrokeWidth="4"
          pointerStrokeColor="black"
        >
          <div className={css.child}>
            <div className={css.inner}>
              <div className={css.value}>{progress}</div>
              <div>{title}</div>
            </div>
          </div>
        </ProgressBar>
      </div>
    );
  },
});

export default Spottable(Indicator);
