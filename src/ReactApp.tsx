import { GenerationEvents } from "./main";
import { App } from "obsidian";
import * as React from "react";
import { feedback, GenerateResponse } from "./humanloop";
export const AppContext = React.createContext<App>(undefined);

const handleClick = () => {
  console.log("clicked");
};

const useListener = (eventName: string, handler: (event: Event) => void) => {
  React.useEffect(() => {
    window.addEventListener(eventName, handler, false);
    return () => {
      window.removeEventListener(eventName, handler, false);
    };
  }, []);
};

export const ResponseArea = () => {
  const handleExtend = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode("extend");
    setResponse(event.detail);
  };
  const handleSummarize = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode("summarize");
    setResponse(event.detail);
  };
  const handleCritique = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode("critique");
    setResponse(event.detail);
  };

  useListener(GenerationEvents.Extend, handleExtend);
  useListener(GenerationEvents.Summarize, handleSummarize);
  useListener(GenerationEvents.Critique, handleCritique);

  const [activeMode, setActiveMode] = React.useState<
    "extend" | "summarize" | "critique" | null
  >(null);
  const [response, setResponse] = React.useState<GenerateResponse>("");

  return (
    <div className="">
      {activeMode}
      <ResponseCard response={response} />
    </div>
  );
};

interface ResponseCardProps {
  response: GenerateResponse;
}

const ResponseCard = ({ response }: ResponseCardProps) => {
  return (
    <div
      className=""
      style={{ borderRadius: "4px", border: "4px solid blue", padding: "10px" }}
    >
      {response.logs?.[0].output}

      <button onClick={() => feedback("good")}>good</button>
      <button onClick={() => feedback("bad")}>bad</button>
    </div>
  );
};

export const ReactApp = () => {
  return (
    <main>
      <h4>Thought Partner</h4>
      <ResponseArea />
      <button onClick={handleClick}>summarise</button>
    </main>
  );
};
