enum WatchingStatus {
  Planning,
  Watching,
  Finished,
  Abandoned,
}

export const WatchingStatusLabels = {
  [WatchingStatus.Planning]: "Planning",
  [WatchingStatus.Watching]: "Watching",
  [WatchingStatus.Finished]: "Finished",
  [WatchingStatus.Abandoned]: "Abandoned",
};

export default WatchingStatus;
