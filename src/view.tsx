import { App, ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContext, ReactApp } from "./ReactApp";
import { createRoot } from "react-dom/client";

export const SIDE_PANE_VIEW_TYPE = "thought-partner-view";

export class SidePane extends ItemView {
  constructor(leaf: WorkspaceLeaf, app: App) {
    super(leaf);
    this.app = app;
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
      <AppContext.Provider value={this.app}>
        <ReactApp />
      </AppContext.Provider>
    );
  }

  async onClose() {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }
}
