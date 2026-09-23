import { themes } from "prism-react-renderer";
import { ComponentType, createContext } from "react";

export type LiveContextValue = {
  error?: string;
  element?: ComponentType | null;
  code: string;
  newCode?: string;
  disabled: boolean;
  language: string;
  theme?: typeof themes.nightOwl;
  onError(error: Error): void;
  onChange(value: string): void;
};

const LiveContext = createContext<LiveContextValue>({} as LiveContextValue);

export default LiveContext;
