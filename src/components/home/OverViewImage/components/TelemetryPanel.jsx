import React from "react";
import { Panel } from "./common/Panel";
import { Product } from "./common/Product";
import { hoverPrometheusData,hoverOpenTelemetryData } from "../utils";
import { ProductPanel } from "./common/ProductPanel";

export const TelemetryPanel = () => {
  return (
    <ProductPanel title="可观测" width="25%">
      {/* <Product
        image={
          "https://gw.alicdn.com/imgextra/i1/O1CN01JpJfq81KvYW9T8HlT_!!6000000001226-2-tps-216-174.png"
        }
        logo="https://gw.alicdn.com/imgextra/i3/O1CN01JPjgRH1fFyUa0oz1L_!!6000000003978-2-tps-72-72.png"
        label="SkyWalking"
        hoverContent={hoverSkyWalkingData}
      /> */}
      <Product
        logo="https://img.alicdn.com/imgextra/i3/O1CN01hTFdm51Jor72V1UQ9_!!6000000001076-2-tps-80-80.png"
        label="OpenTelemetry"
        hoverContent={hoverOpenTelemetryData}
      />
      <Product
        logo="https://img.alicdn.com/imgextra/i2/O1CN01xWWOPW1YLHmKw5I1Z_!!6000000003042-2-tps-80-80.png"
        label="Prometheus"
        hoverContent={hoverPrometheusData}
      />
    </ProductPanel>
  );
};
