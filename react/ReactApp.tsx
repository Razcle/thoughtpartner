import * as React from "react";
import { App } from "obsidian";
import { useObsidianApp } from "./AppContext";
export const AppContext = React.createContext<App>(undefined);

interface ResponseCardProps {
  response: string;
}
const ResponseCard = ({ response }: ResponseCardProps) => {
  return (
    <div className="">
      <div className="">{response}</div>
    </div>
  );
};

const handleClick = () => {
  console.log("clicked");
};

export const ReactApp = ({ something }: { something: string }) => {
  return (
    <main>
      <h4>Thought Partner {something}</h4>
      <button onClick={handleClick}>summarise</button>
    </main>
  );
};
