import {
  CheckIcon,
  ClipboardCopyIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
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
  const handleProseify = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode("proseify");
    setResponse(event.detail);
  };

  useListener(GenerationEvents.Extend, handleExtend);
  useListener(GenerationEvents.Summarize, handleSummarize);
  useListener(GenerationEvents.Critique, handleCritique);
  useListener(GenerationEvents.Proseify, handleProseify);

  const [activeMode, setActiveMode] = React.useState<
    "extend" | "summarise" | "critique" | "proseify" | null
  >(null);
  const [response, setResponse] = React.useState<GenerateResponse | null>(null);

  return (
    <div className="">
      {activeMode ? activeMode : "Call Thought Partner to see results here."}
      {activeMode && <ResponseCard response={response} />}
    </div>
  );
};

interface ResponseCardProps {
  response: GenerateResponse;
}

const ResponseCard = ({ response }: ResponseCardProps) => {
  const { plugin } = useObsidianApp();
  const api_key = plugin.settings.humanloop_api_key;

  return (
    <>
      <div
        className=""
        style={{
          borderRadius: "4px",
          border: "2px solid #999",
          padding: "12px 16px",
        }}
      >
        {response?.data?.[0].output}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "8px",
            margin: "20px 0 0 0",
          }}
        >
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              gap: "4px",
            }}
          >
            <button
              style={{
                display: "flex",
                gap: "4px",
              }}
              onClick={() =>
                feedback(
                  {
                    group: "vote",
                    label: "upvote",
                    data_id: response.data?.[0].id,
                    user: "obsidian-user",
                  },
                  api_key
                )
              }
            >
              <CheckIcon />
              Good
            </button>
            <button
              style={{ display: "flex", gap: "4px" }}
              onClick={() =>
                feedback(
                  {
                    group: "vote",
                    label: "downvote",
                    data_id: response.data?.[0].id,
                    user: "obsidian-user",
                  },
                  api_key
                )
              }
            >
              <Cross1Icon />
              Bad
            </button>
          </div>
          <div>
            <button
              style={{ display: "flex", gap: "4px" }}
              onClick={() => {
                // Copy to clipboard
                navigator.clipboard.writeText(response.data?.[0].output);
                feedback(
                  {
                    group: "actions",
                    label: "copied",
                    data_id: response.data?.[0].id,
                    user: "obsidian-user",
                  },
                  api_key
                );
              }}
            >
              <ClipboardCopyIcon />
              Copy
            </button>
          </div>
        </div>
      </div>
      {/* <pre className="">{JSON.stringify(response, null, 2)}</pre> */}
    </>
  );
};

export const ReactApp = () => {
  const { app } = useObsidianApp();

  return (
    <main>
      <h4>Thought Partner</h4>
      <ResponseArea />
    </main>
  );
};
