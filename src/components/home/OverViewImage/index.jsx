import React from "react";
import "tailwindcss/tailwind.css";
import "./style.css";
import { Arrow } from "./components/common/Arrow";
import { Panel } from "./components/common/Panel";
import { Product } from "./components/common/Product";

import { PopupContent } from "./components/common/PopupContent";
import { GovernancePanel } from "./components/GovernancePanel";
import { ControlPanel } from "./components/ControlPanel";
import { OpsPanel } from "./components/OpsPanel";
import { TelemetryPanel } from "./components/TelemetryPanel";
import { DataPanel } from "./components/DataPanel";
import { AppContext } from "./context";

const defaultColorConfig = {
  panelColor: "linear-gradient(0deg, #FBFDFF 0%, #F4F8FF 100%)",
  arrowColor: "#2491FF",
  background:
    "url('https://gw.alicdn.com/imgextra/i3/O1CN01kMsmPQ1rqrmbBpNo1_!!6000000005683-0-tps-3600-1440.jpg')",
  normalFontColor: "#5C6170",
  highlightFontColor: "#567BE1",
  panelTitleColor: "#1F36AD",
  tagBgColor:'#e6f4ff',
  tagBorderColor:'#91caff',
  tagFontColor:'#1677ff',
  starForkFontColor:'#8498ee',
  starForkBgColor:'#ced3f1',
  linkColor:'#a3e635'
};

function App({ colors = defaultColorConfig,linkStyle="text-sm",className = '',...props }) {
  return (
    <AppContext.Provider
      value={{
        linkStyle,
        colors: {
          ...defaultColorConfig,
          ...colors,
        },
      }}
    >
      <div
        class={` flex flex-col justify-around px-2 pt-14 pb-2 overflow-hidden ` + className}
        id="overview-image-root"
        style={{
          background: colors.background,
        }}
        {...props}
      >
        <div class="flex justify-around flex-1 items-center">
          <GovernancePanel />
          <ControlPanel />
        </div>
        <div class="flex justify-around flex-[2]">
          <DataPanel />
        </div>
        <div class="flex justify-around flex-1">
          <OpsPanel />
          <TelemetryPanel />
        </div>
        {/* <Demo /> */}
      </div>
    </AppContext.Provider>
  );
}

// render(<App height="900px" />, document.getElementById("app"));
export const OverviewImage = App;
