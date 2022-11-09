import * as React from "react";
import { App } from "obsidian";
import { useObsidianApp } from "./AppContext";
import { GenerationEvents } from "main";
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

const handleExtend = (event: Event) => {
  console.log({ event });
  alert("handleExtend");
};
const handleSummarize = (event: Event) => {
  console.log({ event });
  alert("handleSummarize");
};
const handleCritique = (event: Event) => {
  console.log({ event });
  alert("handleCritique");
};

const useListener = (eventName: string, handler: (event: Event) => void) => {
  React.useEffect(() => {
    window.addEventListener(eventName, handler, false);
    return () => {
      window.removeEventListener(eventName, handler, false);
    };
  }, []);
};

export const ReactApp = ({ something }: { something: string }) => {
  useListener(GenerationEvents.Extend, handleExtend);
  useListener(GenerationEvents.Summarize, handleSummarize);
  useListener(GenerationEvents.Critique, handleCritique);

  return (
    <main>
      <h4>Thought Partner {something}</h4>
      <button onClick={handleClick}>summarise</button>
    </main>
  );
};
