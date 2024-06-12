import React from "react";

import Anime from "@interfaces/Anime";
import AnimeItem from "@components/AnimeItem";

import "@components/FrontPageTab.scss";
import NotFoundGif from "@assets/notfound.webm";

interface FrontPageTabProps {
  items: Anime[];
}

const FrontPageTab = (props: FrontPageTabProps) => {
  const { items } = props;

  if (!items) {
    return (
      <React.Fragment>
        <div className="w-full my-24 flex justify-center">
          <video
            className="w-96 max-w-[calc(100%-8rem)] rounded-xl"
            autoPlay={true}
            muted={true}
            loop={true}
          >
            <source src={NotFoundGif} type="video/webm" />
          </video>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {items && items.map((item, key) => <AnimeItem key={key} item={item} />)}
    </React.Fragment>
  );
};

export default FrontPageTab;
