import { createContext } from "react";

export interface IAnimeListRefreshContext {
  refreshData: () => void;
}

const AnimeListRefreshContext = createContext<IAnimeListRefreshContext>({
  refreshData: () => {},
});

export default AnimeListRefreshContext;
