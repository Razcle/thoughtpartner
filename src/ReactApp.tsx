import * as React from "react";
import { useObsidianApp } from "./AppContext";
import { feedback, GenerateResponse } from "./humanloop";
import { GenerationEvents } from "./main";

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
    setActiveMode("summarise");
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
    "extend" | "summarise" | "critique" | null
  >(null);
  const [response, setResponse] = React.useState<GenerateResponse | null>(null);

  return (
    <div className="">
      {activeMode !== null && <ResponseCard response={response} />}
    </div>
  );
};

interface ResponseCardProps {
  response: GenerateResponse;
}

const ResponseCard = ({ response }: ResponseCardProps) => {
  const { plugin } = useObsidianApp();
  const openai_api_key = plugin.settings.openai_api_key;

  return (
    <>
      <div
        className=""
        style={{
          borderRadius: "4px",
          border: "4px solid blue",
          padding: "10px",
        }}
      >
        {response?.data?.[0].output}

        <button
          onClick={() =>
            feedback(
              {
                group: "vote",
                label: "upvote",
                data_id: response.data?.[0].id,
                user: "obsidian-user",
              },
              openai_api_key
            )
          }
        >
          good
        </button>
        <button onClick={() => feedback("bad", response.data?.[0].id)}>
          bad
        </button>
      </div>
      <pre className="">{JSON.stringify(response, null, 2)}</pre>
    </>
  );
};

export const ReactApp = () => {
  const { app } = useObsidianApp();

  return (
    <main>
      <h4>Thought Partner</h4>
      {app?.vault?.getName() || "no vault"}
      <ResponseArea />
    </main>
  );
};
