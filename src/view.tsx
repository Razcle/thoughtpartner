import { App, ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactApp } from "./ReactApp";
import { createRoot } from "react-dom/client";
import { AppContext } from "./AppContext";

export const SIDE_PANE_VIEW_TYPE = "thought-partner-view";

export class SidePane extends ItemView {
  constructor(leaf: WorkspaceLeaf, app: App) {
    super(leaf);
    this.app = app;
    console.log(app.vault.getName());
  }

  getViewType() {
    return SIDE_PANE_VIEW_TYPE;
  }

  getDisplayText() {
    return "Thought Partner";
  }

  async onOpen() {
    const root = createRoot(this.containerEl.children[1]);
    console.log("from open", this.app.vault.getName());
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
