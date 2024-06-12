interface MyAnimeListSearchItem {
  node: {
    id: number;
    title: string;
    description: string;
    mainPicture: {
      medium: string;
      large: string;
    };
  };
}

export default MyAnimeListSearchItem;
