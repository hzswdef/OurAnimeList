import React from "react";

import AnimeListRefreshContext from "@contexts/AnimeListRefreshContext.ts";

interface AnimeListRefreshContextProps {
  children: React.ReactNode;
  refreshData: () => void;
}

export const AnimeListRefreshContextProvider = ({
  children,
  refreshData,
}: AnimeListRefreshContextProps) => {
  return (
    <AnimeListRefreshContext.Provider value={{ refreshData }}>
      {children}
    </AnimeListRefreshContext.Provider>
  );
};
