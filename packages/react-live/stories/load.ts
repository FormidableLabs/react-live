import type { StoredStory } from "./story";

/**
 * Discovery lives apart from `story()` on purpose: this module imports every
 * `*.stories.tsx`, and those import `story()` back. In one file that is a
 * cycle, and the eager glob then reads `story` before it is initialised --
 * which fails at import time, where no type-check would have caught it.
 */
export type LoadedStory = StoredStory & {
  id: string;
  group: string;
  name: string;
};

type StoryModule = { title?: string; [name: string]: unknown };

const isStory = (value: unknown): value is StoredStory =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as StoredStory).render === "function";

/**
 * Discover every story once, for both the dev harness and the smoke test --
 * adding a `*.stories.tsx` file puts it in the sidebar and under test together.
 */
export const loadStories = (): LoadedStory[] => {
  const modules = import.meta.glob<StoryModule>("./*.stories.tsx", {
    eager: true,
  });

  return Object.entries(modules).flatMap(([path, mod]) => {
    const group = mod.title ?? path;
    return Object.entries(mod).flatMap(([name, value]) =>
      isStory(value) ? [{ ...value, id: `${group}/${name}`, group, name }] : [],
    );
  });
};
