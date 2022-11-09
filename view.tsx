import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContext, ReactApp } from "./react/ReactApp";
import { createRoot } from "react-dom/client";

export const VIEW_TYPE_EXAMPLE = "thought-partner-view";

export class SidePane extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return "Thought Partner";
  }

  async onOpen() {
    const root = createRoot(this.containerEl.children[1]);
    root.render(<ReactApp something="arse" />);
  }

  async onClose() {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }
}
