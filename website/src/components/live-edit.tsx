import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

type Props = {
  noInline?: boolean;
  code: string;
};

export const DemoLiveEditor = ({ noInline = false, code }: Props) => {
  return (
    <LiveProvider code={code} noInline={noInline}>
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <LiveEditor className="font-mono" />
        <LivePreview />
      </div>
      <LiveError className="text-red-800 bg-red-100 mt-2" />
    </LiveProvider>
  );
};
