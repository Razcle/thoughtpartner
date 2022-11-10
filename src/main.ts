import { Editor, Events, MarkdownView, Notice, Plugin } from "obsidian";
import { generate, GenerateResponse } from "./humanloop";
import { ThoughtPartnerSettingTab } from "./settings";
import { SidePane, SIDE_PANE_VIEW_TYPE } from "./view";

export enum GenerationEvents {
  Summarize = "GenerateSummarize",
  Critique = "GenerateCritique",
  Extend = "GenerateExtend",
  Proseify = "GenerateProseify",
}

interface ThoughtPartnerSettings {
  openai_api_key: string;
  humanloop_api_key: string;
  context: string;
  showStatusBar: boolean;
  max_tokens: number;
}

const DEFAULT_SETTINGS: ThoughtPartnerSettings = {
  openai_api_key: "",
  humanloop_api_key: "",
  context: "",
  showStatusBar: true,
  max_tokens: 256,
};

export default class ThoughtPartnerPlugin extends Plugin {
  settings: ThoughtPartnerSettings;
  statusBarItemEl: any;

  getActiveView() {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView !== null) {
      return activeView;
    } else {
      new Notice("The file type should be Markdown!");
      return null;
    }
  }

  insertGeneratedText(
    text: string,
    editor: Editor,
    location: "top" | "bottom" | "cursor" = "cursor"
  ) {
    if (location === "top") {
      editor.setCursor(0, 0);
      text += "\n\n";
    } else if (location === "bottom") {
      editor.setCursor(editor.lineCount(), 0);
      text = "\n\n" + text;
    }

    let cursor = editor.getCursor();
    // Insert at the end of any selection
    if (editor.listSelections().length > 0) {
      const anchor = editor.listSelections()[0].anchor;
      const head = editor.listSelections()[0].head;
      if (
        anchor.line > head.line ||
        (anchor.line === head.line && anchor.ch > head.ch)
      ) {
        cursor = editor.listSelections()[0].anchor;
      }
    }
    editor.replaceRange(text, cursor);
  }

  /*
	Prepare the request parameters
	*/
  prepareParameters(
    settings: ThoughtPartnerSettings,
    project_name: string = "Extend",
    editor: Editor
  ) {
    let bodyParams: any = {
      project: project_name,
      max_tokens: settings.max_tokens,
      inputs: { input: this.getContext(editor) },
      provider_api_keys: {
        OpenAI: settings.openai_api_key,
      },
    };
    console.log(bodyParams);
    return bodyParams;
  }

  async getGeneration(
    settings: ThoughtPartnerSettings,
    project_name: string,
    editor: Editor
  ): Promise<GenerateResponse> {
    const parameters = this.prepareParameters(settings, project_name, editor);
    try {
      return await generate(parameters, settings.humanloop_api_key);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Returns the selection, or
  getContext(editor: Editor) {
    let selectedText = editor.getSelection();
    if (selectedText.length === 0) {
      selectedText = editor.getValue();
    }
    return selectedText;
  }

  updateStatusBar(text: string) {
    if (this.settings.showStatusBar) {
      this.statusBarItemEl.setText(`Thought Partner: ${text}`);
    }
  }

  async onload() {
    console.log("loading thought-partner plugin");

    // TODO: Could use this to show if 'thought partner' is active
    // this.addStatusBarItem().setText("Status Bar Text");

    // TODO: Could trigger this to allow user to specify any instruction
    // this.addCommand({
    //   id: "open-sample-modal",
    //   name: "Open Sample Modal",
    //   // callback: () => {
    //   // 	console.log('Simple Callback');
    //   // },
    //   checkCallback: (checking: boolean) => {
    //     let leaf = this.app.workspace.activeLeaf;
    //     if (leaf) {
    //       if (!checking) {
    //         new ExampleModal(this.app).open();
    //       }
    //       return true;
    //     }
    //     return false;
    //   },
    // });

    this.registerDomEvent(document, "selectionchange", (evt: MouseEvent) => {
      console.log("selectionchange", evt);
    });

    this.app.workspace.on("editor-menu", (menu) => {
      menu.addItem((item) =>
        item
          .setTitle("Summarise")
          .setIcon("zap")
          .onClick(() => {
            this.summarise(this.getEditor());
          })
      );
      menu.addItem((item) =>
        item
          .setTitle("Critique")
          .setIcon("zap")
          .onClick(() => {
            this.critique(this.getEditor());
          })
      );
      menu.addItem((item) =>
        item
          .setTitle("Prose-ify")
          .setIcon("zap")
          .onClick(() => {
            this.proseify(this.getEditor());
          })
      );
    });

    this.registerView(
      SIDE_PANE_VIEW_TYPE,
      (leaf) => new SidePane(leaf, this.app, this)
    );
    this.addRibbonIcon("cloud-lightning", "Open Thought Partner", (event) => {
      this.activateView();
    });
    this.registerEvent(Events);

    await this.loadSettings();

    this.statusBarItemEl = this.addStatusBarItem();

    this.addCommand({
      id: "open-view",
      name: "Open Thought Partner",
      icon: "zap ",
      editorCallback: async (editor: Editor) => {
        this.activateView();
      },
    });

    this.addCommand({
      id: "extend-text",
      name: "continue writing",
      icon: "zap",
      hotkeys: [{ modifiers: ["Ctrl"], key: "j" }],
      editorCallback: async (editor: Editor) => {
        this.continueWriting(editor);
      },
    });

    this.addCommand({
      id: "summarise",
      name: "Summarise (tldr)",
      icon: "zap",
      hotkeys: [{ modifiers: ["Ctrl"], key: "t" }],
      editorCallback: async (editor: Editor) => {
        this.summarise(editor);
      },
    });

    this.addCommand({
      id: "critique",
      name: "critique",
      icon: "zap",
      hotkeys: [{ modifiers: ["Ctrl"], key: "q" }],
      editorCallback: async (editor: Editor) => {
        this.critique(editor);
      },
    });

    this.addCommand({
      id: "prose-ify",
      name: "prose-ify",
      icon: "zap",
      editorCallback: async (editor: Editor) => {
        this.proseify(editor);
      },
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new ThoughtPartnerSettingTab(this.app, this));
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(SIDE_PANE_VIEW_TYPE);
  }

  getEditor() {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      return activeView.editor;
    }
    return null;
  }

  async continueWriting(editor: Editor) {
    this.updateStatusBar(`writing... `);
    try {
      new Notice("Generating...");
      const response = await this.getGeneration(
        this.settings,
        "Extend",
        editor
      );
      window.dispatchEvent(
        new CustomEvent(GenerationEvents.Extend, { detail: response })
      );
      this.insertGeneratedText(response.data[0]?.raw_output, editor);
      this.updateStatusBar(``);
    } catch (error) {
      new Notice("Thought Partner: Error check console CTRL+SHIFT+I");
      this.updateStatusBar(`Error check console`);
      setTimeout(() => this.updateStatusBar(``), 3000);
    }
  }
  async summarise(editor: Editor) {
    this.updateStatusBar(`Summarising... `);
    try {
      new Notice("Summarising...");
      const response = await this.getGeneration(
        this.settings,
        "summarise",
        editor
      );
      window.dispatchEvent(
        new CustomEvent(GenerationEvents.Summarize, { detail: response })
      );
      this.insertGeneratedText(response.data[0]?.raw_output, editor, "top");
      this.updateStatusBar(``);
    } catch (error) {
      new Notice("Thought Partner: Error check console CTRL+SHIFT+I");
      this.updateStatusBar(`Error check console`);
      setTimeout(() => this.updateStatusBar(``), 3000);
    }
  }

  async proseify(editor: Editor) {
    this.updateStatusBar(`Prose-ifying... `);
    try {
      new Notice("Converting into fluid prose...");
      const response = await this.getGeneration(
        this.settings,
        "proseify",
        editor
      );
      window.dispatchEvent(
        new CustomEvent(GenerationEvents.Summarize, { detail: response })
      );
      this.insertGeneratedText(response.data[0]?.raw_output, editor);
      this.updateStatusBar(``);
    } catch (error) {
      new Notice("Thought Partner: Error check console CTRL+SHIFT+I");
      this.updateStatusBar(`Error check console`);
      setTimeout(() => this.updateStatusBar(``), 3000);
    }
  }

  async critique(editor: Editor) {
    this.updateStatusBar(`critiquing... `);
    try {
      new Notice("Hmmm... thinking...");
      const response = await this.getGeneration(
        this.settings,
        "critique",
        editor
      );
      window.dispatchEvent(
        new CustomEvent(GenerationEvents.Critique, { detail: response })
      );
      this.insertGeneratedText(response.data[0]?.raw_output, editor);
      this.updateStatusBar(``);
    } catch (error) {
      new Notice("Thought Partner: Error check console CTRL+SHIFT+I");
      this.updateStatusBar(`Error check console`);
      setTimeout(() => this.updateStatusBar(``), 3000);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
  async activateView() {
    this.app.workspace.detachLeavesOfType(SIDE_PANE_VIEW_TYPE);

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: SIDE_PANE_VIEW_TYPE,
      active: true,
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(SIDE_PANE_VIEW_TYPE)[0]
    );
  }

  /*
   * Listener used to trigger autocomplete
   * It intercepts inputs that could change the current line (e.g. ctrl+n)
   */
  private keyDownListener = (
    editor: CodeMirror.Editor,
    event: KeyboardEvent
  ) => {
    console.log("keydown", event);
    // const autocomplete = this.autocomplete;
    // const settings = this.settings;
    // const autoSelect = settings.autoSelect;

    // if (
    //   autocomplete.isShown &&
    //   autocomplete.tokenizer.isWordSeparator(event.key)
    // ) {
    //   this.autocomplete.removeViewFrom(editor);
    //   return;
    // } else if (autocomplete.isShown) return;

    // // Trigger like Vim autocomplete (ctrl+p/n)
    // if (
    //   isVimTrigger({
    //     triggerLikeVim: settings.triggerLikeVim,
    //     editor,
    //     event,
    //   })
    // ) {
    //   this.justTriggeredBy = "vim";

    //   autocomplete.toggleViewIn(editor, {
    //     autoSelect,
    //     showEmptyMatch: !settings.autoTrigger,
    //   });

    //   if (event.key === "p") autocomplete.selectLastSuggestion();
    // } else if (isAutoTrigger(editor, event, autocomplete.tokenizer, settings)) {
    //   this.justTriggeredBy = "autotrigger";

    //   autocomplete.toggleViewIn(editor, {
    //     autoSelect,
    //     showEmptyMatch: !settings.autoTrigger,
    //   });
    // }
  };
}
