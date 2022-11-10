import { Editor, MarkdownView } from "obsidian";
import * as React from "react";
import { useObsidian } from "./AppContext";
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
  const [response, setResponse] = React.useState<GenerateResponse>(null);

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
        <button onClick={() => feedback("good", response.data?.[0].id)}>
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
  const { app, plugin, markdownView } = useObsidian();
  console.log({ md: markdownView, editor: markdownView?.editor });

  // console.log("ajksfhkjha");
  // app.workspace.iterateAllLeaves((leaf) => {
  //   console.log(leaf.getViewState().type);
  // });
  // app.workspace.getActiveViewOfType
  // console.log(app?.workspace?.getActiveViewOfType(MarkdownView));
  const getEditor = (): Editor | null => {
    // app?.workspace?.getActiveViewOfType.bind(app);
    // console.log(app?.workspace?.getActiveViewOfType());
    console.log({
      appname: app?.vault?.getName(),
      workspace: app?.workspace?.getActiveFile()?.basename,
      editor: app?.workspace?.getActiveViewOfType(MarkdownView),
      // view: plugin.getActiveView(),
    });
    const view = app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
      return view.editor;
    }
    return null;
  };

  const [context, setContext] = React.useState<string | null>(
    // plugin.getContext(getEditor())
    null
  );
  // plugin.getContext(getEditor())

  const handleClick = () => {
    const editor = getEditor();
    app.workspace.iterateAllLeaves((leaf) => {
      console.log(leaf.getViewState());
    });
    console.log({ editor });
    if (editor) {
      const context = plugin?.getContext(editor);
      console.log({ context });
      setContext(context);
    }
  };

  return (
    <main>
      <h4>Thought Partner</h4>
      {app?.vault?.getName() || "no vault"}
      {/* Editor content */}
      {app?.workspace?.getActiveFile()?.basename || "no file"}

      <button onClick={() => setTimeout(handleClick, 1000)}>get context</button>
      <br />
      {/* {getEditor()} */}
      {context}
      <ResponseArea />
    </main>
  );
};
