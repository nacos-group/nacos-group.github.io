import React from "react";
import classnames from "classnames";
import { getLink } from "../../utils";
import "./index.scss";

export type ButtonType = "primary" | "normal";
type Props = {
  type: string;
  link: string;
  target: string;
  children?: React.ReactNode;
  language?: string;
  customStyle?: React.CSSProperties;
};

const defaultProps: Props = {
  type: "primary",
  link: "",
  target: "_self",
  customStyle: {},
};
const Button = (props = defaultProps) => {
  return (
    <a
      className={classnames({
        button: true,
        [`button-${props.type}`]: true,
      })}
      target={props.target || "_self"}
      href={getLink(props.link, props.language)}
      style={props.customStyle}
    >
      {props.children}
    </a>
  );
};
export default Button;
