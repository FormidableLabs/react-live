import { Language, PrismTheme } from "prism-react-renderer";
import { ComponentType, createContext } from "react";

type ContextValue = {
  error?: string;
  element?: ComponentType | null;
  code: string;
  disabled: boolean;
  language: Language;
  theme?: PrismTheme;
  onError(error: Error): void;
  onChange(value: string): void;
}

const LiveContext = createContext<ContextValue>({} as ContextValue);

export default LiveContext;
