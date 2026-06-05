import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTagStore = create(
  persist(
    (set) => ({
      tagMapping: [],
      tagMap: {},

      setTagMapping: (tags) =>
        set({
          tagMapping: tags,
          tagMap: Object.fromEntries(
            tags.map((t) => [t.tag_id, t.tag_name])
          ),
        }),

      clearTagMapping: () =>
        set({
          tagMapping: [],
          tagMap: {},
        }),
    }),
    {
      name: "tag-storage",
    }
  )
);