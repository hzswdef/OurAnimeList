import React, { useRef, useState } from "react";
import { AppBar, Box, Tab, Tabs } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { CSSTransition } from "react-transition-group";

import { AnimeListRefreshContextProvider } from "@components/contexts/AnimeListRefreshContextProvider";
import GetAnime from "@data/GetAnime";
import FrontPageTab from "@components/FrontPageTab";
import Search from "@components/Search";
import WatchingStatus, {
  WatchingStatusLabels,
} from "@interfaces/WatchingStatus";

import "@pages/FrontPage.scss";

const FrontPage = () => {
  const nodeRef = useRef(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const { data, isLoading, hasError, refreshData } = GetAnime();

  // @TODO Let's tell more info here.
  if (hasError) {
    return <div className="text-white">Error...</div>;
  }

  const tabProps = (index: number) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setActiveTab(newValue);
  };

  const handleTabChangeIndex = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="frontpage">
      <AnimeListRefreshContextProvider refreshData={refreshData}>
        <CSSTransition
          in={!isLoading}
          nodeRef={nodeRef}
          timeout={3000}
          classNames="frontpage-content"
          unmountOnExit
        >
          <Box ref={nodeRef} height="100%">
            <Search />

            <AppBar position="sticky">
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                aria-label="our anime list"
              >
                <Tab
                  label={WatchingStatusLabels[WatchingStatus.Planning]}
                  {...tabProps(0)}
                />
                <Tab
                  label={WatchingStatusLabels[WatchingStatus.Watching]}
                  {...tabProps(1)}
                />
                <Tab
                  label={WatchingStatusLabels[WatchingStatus.Finished]}
                  {...tabProps(2)}
                />
                <Tab
                  label={WatchingStatusLabels[WatchingStatus.Abandoned]}
                  {...tabProps(3)}
                />
              </Tabs>
            </AppBar>
            <SwipeableViews
              index={activeTab}
              onChangeIndex={handleTabChangeIndex}
            >
              <FrontPageTab items={data[WatchingStatus.Planning]} />
              <FrontPageTab items={data[WatchingStatus.Watching]} />
              <FrontPageTab items={data[WatchingStatus.Finished]} />
              <FrontPageTab items={data[WatchingStatus.Abandoned]} />
            </SwipeableViews>
          </Box>
        </CSSTransition>
      </AnimeListRefreshContextProvider>
    </div>
  );
};

export default FrontPage;
