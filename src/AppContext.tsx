import { App, MarkdownView } from "obsidian";
import * as React from "react";
import ThoughtPartnerPlugin from "./main";

interface ObsidianPluginContextInterface {
  app: App;
  plugin: ThoughtPartnerPlugin;
  markdownView: MarkdownView;
}

export const ObsidianPluginContext =
  React.createContext<ObsidianPluginContextInterface | null>(null);

export const useObsidian = (): ObsidianPluginContextInterface | undefined => {
  return React.useContext(ObsidianPluginContext);
};
