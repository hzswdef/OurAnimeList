import { useEffect, useState } from "react";

import BackendApi from "@api/BackendApi";
import Anime from "@interfaces/Anime";

export interface IGetAnime {
  data: {
    [key: number]: Anime[];
  };
  isLoading: boolean;
  hasError: boolean;
  refreshData: () => void;
}

const GetAnime = (): IGetAnime => {
  const filteredAnime: IGetAnime["data"] = {};

  const [anime, setAnime] = useState<Anime[]>();
  const [error, setError] = useState<IGetAnime["hasError"]>(false);
  const [isLoading, setIsLoading] = useState<IGetAnime["isLoading"]>(true);

  const fetchAnime = () => {
    setIsLoading(true);

    new BackendApi()
      .getAnime()
      .then((response) => {
        setAnime(response.data);
      })
      .catch((error) => {
        if (error?.response?.status !== 404) {
          setError(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  if (anime) {
    anime.map((item) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          filteredAnime,
          item.watchingStatus,
        )
      ) {
        filteredAnime[item.watchingStatus] = [];
      }
      filteredAnime[item.watchingStatus].push(item);
    });
  }

  return {
    data: filteredAnime,
    isLoading: isLoading,
    hasError: error,
    refreshData: fetchAnime,
  };
};

export default GetAnime;
