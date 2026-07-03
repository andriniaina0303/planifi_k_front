import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTagStore = create(
  persist(
    (set) => ({
      tagMapping: [],
      tagMap: {},
      countries: [],

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

export const useCountryStore = create(
  persist(
    (set) => ({
      // État initial : un tableau vide
      countries: [],

      // Action pour stocker les pays directement (sans mapping)
      setCountries: (countriesList) => 
        set({ countries: countriesList }),

      // Action pour vider le store si besoin
      clearCountries: () => 
        set({ countries: [] }),
    }),
    {
      name: "country-storage", // Clé différente dans le localStorage pour éviter les conflits
    }
  )
);