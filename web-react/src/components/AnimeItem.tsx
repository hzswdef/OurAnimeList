import { useState, MouseEvent, memo } from "react";
import { Button, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import truncate from "truncate";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";

import useAnimeListRefreshContext from "@hooks/useAnimeListRefreshContext";
import BackendApi from "@api/BackendApi";
import GetUsername from "@data/GetUsername";
import Anime from "@interfaces/Anime";

import "@components/AnimeItem.scss";
import WatchingStatus, {
  WatchingStatusLabels,
} from "@interfaces/WatchingStatus";

const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

interface AnimeItemProps {
  item: Anime;
}

const AnimeItem = memo((props: AnimeItemProps) => {
  const { item } = props;

  const { refreshData } = useAnimeListRefreshContext();
  const authorUsername = GetUsername(item.authorId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuIsOpen = Boolean(anchorEl);

  const handleMenuButtonClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (action: WatchingStatus | "item-delete") => {
    setAnchorEl(null);

    switch (action) {
      case WatchingStatus.Planning:
      case WatchingStatus.Watching:
      case WatchingStatus.Finished:
      case WatchingStatus.Abandoned:
        new BackendApi()
          .patchAnime({ ...item, watchingStatus: action })
          .then(() => {
            refreshData();
            toast.success(
              `Moved "${item.title}" to ${WatchingStatusLabels[action]}.`,
            );
          })
          .catch(() => {
            toast.error("Failed to change status.");
          });
        break;
      case "item-delete":
        new BackendApi()
          .deleteAnime(item.id)
          .then(() => {
            refreshData();
            toast.success(`Deleted the "${item.title}".`);
          })
          .catch(() => {
            toast.error("Failed to delete.");
          });
        break;
    }
  };

  return (
    <div className="anime-item relative">
      <Button
        color="info"
        className="tab-item !items-start w-full !px-5 !py-4 gap-6 font-nunito !normal-case text-left"
      >
        <div className="preview-section">
          <img
            className="rounded-md w-32 h-auto"
            src={`${backendBaseUrl}/static/${item.id}.jpg`}
            alt={item.title}
          />
        </div>

        <div className="description-section w-full">
          <div className="title nunito-700 text-lg text-slate-50 leading-none mb-2 pr-3.5">
            {item.title}
          </div>

          <div className="author text-stone-500 text-sm leading-none mb-2">
            {authorUsername}
          </div>

          <div className="description text-sm text-stone-500">
            {truncate(item.description, 100)}
          </div>
        </div>
      </Button>

      <div className="menu-button absolute top-1.5 right-1.5">
        <IconButton
          aria-label="menu"
          id="anime-item-menu-button"
          aria-controls={menuIsOpen ? "anime-item-menu-button" : undefined}
          aria-expanded={menuIsOpen ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleMenuButtonClick}
        >
          <MoreVertIcon htmlColor="#78716c" />
        </IconButton>

        <Menu
          id="anime-item-menu"
          className="anime-item-menu"
          MenuListProps={{
            "aria-labelledby": "anime-item-menu-button",
          }}
          anchorEl={anchorEl}
          open={menuIsOpen}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            className="w-44"
            onClick={() => handleMenuItemClick(WatchingStatus.Planning)}
          >
            {WatchingStatusLabels[WatchingStatus.Planning]}
          </MenuItem>

          <MenuItem
            className="w-44"
            onClick={() => handleMenuItemClick(WatchingStatus.Watching)}
          >
            {WatchingStatusLabels[WatchingStatus.Watching]}
          </MenuItem>

          <MenuItem
            className="w-44"
            onClick={() => handleMenuItemClick(WatchingStatus.Finished)}
          >
            {WatchingStatusLabels[WatchingStatus.Finished]}
          </MenuItem>

          <MenuItem
            className="w-44"
            onClick={() => handleMenuItemClick(WatchingStatus.Abandoned)}
          >
            {WatchingStatusLabels[WatchingStatus.Abandoned]}
          </MenuItem>

          <Divider sx={{ bgcolor: "#505050" }} />

          <MenuItem
            className="w-44"
            onClick={() => handleMenuItemClick("item-delete")}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
});

export default AnimeItem;
