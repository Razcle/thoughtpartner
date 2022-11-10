import { CheckIcon, ClipboardCopyIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Notice } from "obsidian";
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
  const handleSuggest = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode("suggestions");
    setResponse(event.detail);
  };

  useListener(GenerationEvents.Extend, handleExtend);
  useListener(GenerationEvents.Summarize, handleSummarize);
  useListener(GenerationEvents.Critique, handleCritique);
  useListener(GenerationEvents.Proseify, handleProseify);
  useListener(GenerationEvents.Suggest, handleSuggest);

  const [activeMode, setActiveMode] = React.useState<
    "extend" | "summarise" | "critique" | "proseify" | "suggestions" | null
  >(null);
  const [response, setResponse] = React.useState<GenerateResponse | null>(null);

  return (
    <div className="">
      {activeMode ? activeMode : "Call Thought Partner to see results here."}
      {activeMode !== null && <ResponseCard response={response} />}
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
      <div>
        <textarea className="prose w-full" rows={10}>
          {response?.data?.[0].output}
        </textarea>
        <div className="prose select-text cursor-pointer">{response?.data?.[0].output}</div>
        <div className="flex justify-between gap-4 mt-5 ">
          <Button
            onClick={() => {
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
          </Button>
          <div className="flex grow justify-end gap-2">
            <Button
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
              <CheckIcon /> Good
            </Button>
            <Button
              onClick={() => {
                new Notice("Marked as a poor generation");
                feedback(
                  {
                    group: "vote",
                    label: "downvote",
                    data_id: response.data?.[0].id,
                    user: "obsidian-user",
                  },
                  api_key
                );
              }}
            >
              <Cross1Icon />
              Bad
            </Button>
          </div>
        </div>
      </div>
      <pre className="">{JSON.stringify(response, null, 2)}</pre>
    </>
  );
};

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  className?: string;
}

const Button = ({ className, ...props }: ButtonProps) => {
  return <button className="flex gap-2 px-3 py-1" {...props} />;
};

export const ReactApp = () => {
  const { app } = useObsidianApp();

  return (
    <main>
      <h4 className="text-2xl leading-loose font-bold">Thought Partner</h4>
      <ResponseArea />
    </main>
  );
};
