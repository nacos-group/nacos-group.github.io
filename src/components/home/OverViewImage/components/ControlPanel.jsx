import React from "react";
import { Panel } from "./common/Panel";
import { Product } from "./common/Product";
import { hoverOpenkruiseData,hoverKubernetesData } from "../utils";
import { ProductPanel } from "./common/ProductPanel";

export const ControlPanel = ({}) => {
  return (
    <ProductPanel title="控制面">
      {/* <Product
        image={
          "https://gw.alicdn.com/imgextra/i2/O1CN01S2OTiK1o8wxUvatne_!!6000000005181-2-tps-216-170.png"
        }
        logo="https://gw.alicdn.com/imgextra/i4/O1CN01ch91fH1kEfRHCN1iT_!!6000000004652-2-tps-56-64.png"
        label="KubeVela"
        hoverContent={hoverKubeVelaData}
      /> */}
      <Product
        // image={
        //   "https://gw.alicdn.com/imgextra/i2/O1CN01S2OTiK1o8wxUvatne_!!6000000005181-2-tps-216-170.png"
        // }
        logo="https://img.alicdn.com/imgextra/i1/O1CN01wGWLaP1WHVHF2P73D_!!6000000002763-2-tps-80-80.png"
        label="Openkruise"
        hoverContent={hoverOpenkruiseData}
        direction="bottom"
      />
      <Product
        image={
          "https://gw.alicdn.com/imgextra/i4/O1CN01b9Zgrx1px9zjkxaBN_!!6000000005426-2-tps-216-160.png"
        }
        logo="https://img.alicdn.com/imgextra/i1/O1CN01FxpqPp1Q3rn1Xh6N1_!!6000000001921-2-tps-80-80.png"
        label="Kubernetes"
        hoverContent={hoverKubernetesData}
        direction="bottom"
      />
    </ProductPanel>
  );
};
