import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

export const DemoLiveEditor = ({ noInline, code }) => {
  return (
    <LiveProvider code={code} noInline={noInline}>
      <div className="grid lg:grid-cols-2 gap-4">
        <LiveEditor className="font-mono" />
        <LivePreview />
      </div>
      <LiveError className="text-red-800 bg-red-100 mt-2" />
    </LiveProvider>
  );
};
