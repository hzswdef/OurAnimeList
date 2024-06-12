import { useContext } from "react";

import AnimeListRefreshContext from "@contexts/AnimeListRefreshContext.ts";

const useAnimeListRefreshContext = () => {
  return useContext(AnimeListRefreshContext);
};

export default useAnimeListRefreshContext;
