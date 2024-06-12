import WatchingStatus from "@interfaces/WatchingStatus";

interface Anime {
  id: number;
  myAnimeListId: number;
  watchingStatus: WatchingStatus;
  title: string;
  description: string;
  authorId: number;
  authoredOn: number;
}

export default Anime;
