import React = require("react");

export interface IGreetingTextProps {
  name?: string;
}

export const GreetingText = React.memo(
  (props: IGreetingTextProps) => {
    return <div>{props.name}</div>;
  }
);


