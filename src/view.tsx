import { App, ItemView, MarkdownView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactApp } from "./ReactApp";
import { createRoot } from "react-dom/client";
import { ObsidianPluginContext } from "./AppContext";
import ThoughtPartnerPlugin from "./main";

export const SIDE_PANE_VIEW_TYPE = "thought-partner-view";

export class SidePane extends ItemView {
  private plugin: ThoughtPartnerPlugin;
  private markdownView: MarkdownView;

  constructor(
    leaf: WorkspaceLeaf,
    app: App,
    plugin: ThoughtPartnerPlugin,
    markdownView: MarkdownView
  ) {
    super(leaf);
    this.app = app;
    this.plugin = plugin;
    this.markdownView = markdownView;
  }

  getViewType() {
    return SIDE_PANE_VIEW_TYPE;
  }

  getDisplayText() {
    return "Thought Partner";
  }

  async onOpen() {
    const root = createRoot(this.containerEl.children[1]);
    root.render(
      <ObsidianPluginContext.Provider
        value={{
          app: this.app,
          plugin: this.plugin,
          markdownView: this.markdownView,
        }}
      >
        <ReactApp />
      </ObsidianPluginContext.Provider>
    );
  }

  async onClose() {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }
}
