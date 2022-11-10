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
  // Could potentially handle these differently... that's why they're separate atm.
  const handleExtend = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode(GenerationEvents.Extend);
    setResponse(event.detail);
  };
  const handleSummarize = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode(GenerationEvents.Summarize);
    setResponse(event.detail);
  };
  const handleCritique = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode(GenerationEvents.Critique);
    setResponse(event.detail);
  };
  const handleProseify = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode(GenerationEvents.Proseify);
    setResponse(event.detail);
  };
  const handleSuggest = (event: CustomEvent) => {
    console.log({ event });
    setActiveMode(GenerationEvents.Suggest);
    setResponse(event.detail);
  };

  useListener(GenerationEvents.Extend, handleExtend);
  useListener(GenerationEvents.Summarize, handleSummarize);
  useListener(GenerationEvents.Critique, handleCritique);
  useListener(GenerationEvents.Proseify, handleProseify);
  useListener(GenerationEvents.Suggest, handleSuggest);

  const [activeMode, setActiveMode] = React.useState<GenerationEvents | null>(
    GenerationEvents.Extend
  );

  return (
    <div className="">
      <div className="my-2">
        {activeMode === null && "Call Thought Partner to see results here."}
        {activeMode === GenerationEvents.Suggest && "Suggstions"}
        {activeMode === GenerationEvents.Extend && "Extend"}
        {activeMode === GenerationEvents.Summarize && "Summary"}
        {activeMode === GenerationEvents.Critique && "Critique"}
        {activeMode === GenerationEvents.Proseify && "Proseify"}
      </div>

      {response?.data.map((data) => (
        <ResponseCard data={data} />
      ))}
    </div>
  );
};

interface ResponseCardProps {
  data: GenerateResponse["data"][0];
}

const ResponseCard = ({ data }: ResponseCardProps) => {
  const { plugin } = useObsidianApp();
  const api_key = plugin.settings.humanloop_api_key;
  return (
    <>
      <div>
        <textarea className="py-1 px-2 prose w-full" rows={10}>
          {data.output}
        </textarea>
        <div className="flex justify-between gap-4 mt-5 ">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(data.output);
              feedback(
                {
                  group: "actions",
                  label: "copied",
                  data_id: data.id,
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
                  { group: "vote", label: "upvote", data_id: data.id, user: "obsidian-user" },
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
                  { group: "vote", label: "downvote", data_id: data.id, user: "obsidian-user" },
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
      <pre className="">{JSON.stringify(data, null, 2)}</pre>
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
