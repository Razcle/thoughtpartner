import { App } from "obsidian";
import * as React from "react";

export const AppContext = React.createContext<App>(null);

export const useObsidianApp = (): App | undefined => {
  return React.useContext(AppContext);
};
