import { ChangeEvent, memo, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { clsx } from "clsx";
import truncate from "truncate";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";

import BackendApi from "@api/BackendApi";
import MyAnimeListSearchItem from "@interfaces/MyAnimeListSearchItem";
import useAnimeListRefreshContext from "@hooks/useAnimeListRefreshContext";
import Anime from "@interfaces/Anime";
import WatchingStatus, {
  WatchingStatusLabels,
} from "@interfaces/WatchingStatus";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import "@components/Search.scss";
import CircularProgressCustom from "@components/misc/CircularProgressCustom.tsx";

interface CreateAnimeFormData {
  open: boolean;
  data?: MyAnimeListSearchItem;
}

interface AddAnimeFormInputs {
  myAnimeListId: Anime["myAnimeListId"];
  watchingStatus: Anime["watchingStatus"];
}

const Search = () => {
  const { refreshData } = useAnimeListRefreshContext();

  // Show the search results block if "true".
  const [searchInputFocus, setSearchInputFocus] = useState<boolean>(false);

  const [waitingResponse, setWaitingResponse] = useState<boolean>(false);

  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [searchInputValueDebounce] = useDebounce(searchInputValue, 500);

  const [searchResult, setSearchResult] = useState<MyAnimeListSearchItem[]>([]);
  const [createAnimeForm, setCreateAnimeForm] = useState<CreateAnimeFormData>({
    open: false,
    data: undefined,
  });

  const { handleSubmit, reset, watch, setValue } = useForm<AddAnimeFormInputs>({
    defaultValues: {
      watchingStatus: WatchingStatus.Planning,
    },
  });

  const hasResults = searchResult.length !== 0;

  const wrapperClassNames = clsx("search", {
    "fixed w-screen h-screen flex flex-col z-[1200] bg-[#101010]":
      searchInputFocus,
  });
  const searchFieldIconClassNames = clsx(
    "absolute right-4 top-1/2 -translate-y-2/4 p-1.5 cursor-pointer",
  );

  const SearchFieldIcon = memo(() => {
    const iconColor = "#a8a29e";

    if (searchInputFocus) {
      return (
        <div
          className={searchFieldIconClassNames}
          onClick={() => {
            setWaitingResponse(false);
            setSearchInputFocus(false);
            setSearchInputValue("");
            setSearchResult([]);
            resetAnimeForm();
          }}
        >
          <CloseIcon htmlColor={iconColor} />
        </div>
      );
    }

    return (
      <div className={searchFieldIconClassNames}>
        <SearchIcon htmlColor={iconColor} />
      </div>
    );
  });

  // Disable body tag scrolling when search results appear.
  useEffect(() => {
    if (hasResults) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [hasResults]);

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchInputValue(value);

    if (value && value.length >= 3) {
      setWaitingResponse(true);
    } else if (waitingResponse) {
      setWaitingResponse(false);
    }
  };

  const onAnimeAddButtonClick = (selectedAnime: MyAnimeListSearchItem) => {
    setCreateAnimeForm({
      open: true,
      data: selectedAnime,
    });
    setValue("myAnimeListId", selectedAnime.node.id);
  };

  const onAddAnimeFormSubmit = (data: AddAnimeFormInputs) => {
    new BackendApi()
      .createAnimeFromMyAnimeList(data.myAnimeListId, data.watchingStatus)
      .then(() => {
        toast.success("Added new anime <3");
        refreshData();
        setWaitingResponse(false);
        setSearchInputFocus(false);
        setSearchInputValue("");
        setSearchResult([]);
        resetAnimeForm();
      })
      .catch(() => {
        toast.error("Failed to add anime...");
        resetAnimeForm();
      });
  };

  const resetAnimeForm = () => {
    setCreateAnimeForm({
      open: false,
      data: undefined,
    });
    reset();
  };

  useEffect(() => {
    if (searchInputValueDebounce && searchInputValueDebounce.length >= 3) {
      new BackendApi()
        .searchOnMyAnimeList(searchInputValueDebounce)
        .then((response) => {
          if (response.status === 200 && response.data?.data) {
            return setSearchResult(response.data.data);
          }
          setSearchResult([]);
          setWaitingResponse(false);
        });
    } else {
      setSearchResult([]);
    }
  }, [searchInputValueDebounce]);

  return (
    <div className={wrapperClassNames}>
      <div className="search-input relative py-2 px-2.5">
        <input
          className={clsx(
            "bg-stone-500 bg-opacity-20 rounded-full w-full py-3 pl-4 pr-12",
            "placeholder-stone-40 focus:outline-none font-nunito",
          )}
          type="search"
          placeholder="Search anime"
          value={searchInputValue}
          onChange={(event) => onSearch(event)}
          onFocusCapture={() => setSearchInputFocus(true)}
        />

        <SearchFieldIcon />
      </div>

      {searchInputFocus && (
        <div className="search-results w-full overflow-y-auto">
          {searchResult.length === 0 && !waitingResponse && (
            <h1 className="nunito-700 text-center text-stone-500 text-2xl mt-24">
              No results.
            </h1>
          )}

          {searchResult.length === 0 && waitingResponse && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-24">
              <CircularProgressCustom />
            </div>
          )}

          {searchResult.length !== 0 &&
            searchResult.map((item, index) => (
              <div key={index} className="search-item relative">
                <Button
                  color="info"
                  className="tab-item !items-start w-full !px-5 !py-4 gap-6 font-nunito !normal-case text-left"
                >
                  <div className="preview-section">
                    <img
                      className="rounded-md w-32 h-auto"
                      src={item.node.mainPicture.medium}
                      alt={item.node.title}
                    />
                  </div>

                  <div className="description-section w-full">
                    <div className="title nunito-700 text-lg text-slate-50 leading-none mb-2 pr-5">
                      {item.node.title}
                    </div>

                    <div className="description text-sm text-stone-500">
                      {truncate(item.node.description, 110)}
                    </div>
                  </div>
                </Button>

                <div className="menu-button absolute top-1.5 right-1.5">
                  <IconButton
                    aria-label="menu"
                    id="add-anime-item"
                    aria-controls={
                      createAnimeForm.open ? "add-anime-item" : undefined
                    }
                    aria-expanded={createAnimeForm.open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={() => onAnimeAddButtonClick(item)}
                  >
                    <AddIcon htmlColor="#78716c" />
                  </IconButton>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal
        open={createAnimeForm.open}
        onClose={resetAnimeForm}
        aria-labelledby="modal-anime-create-form"
        aria-describedby="modal-anime-create-form"
      >
        <div
          className={clsx(
            "add-anime-form-wrapper bg-[#101010] rounded-2xl w-96 max-w-[calc(100vw-2rem)] p-4",
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          )}
        >
          {createAnimeForm.data && (
            <div className="anime-add-preview flex gap-5">
              <div className="preview-section">
                <img
                  className="rounded-md w-32 h-auto"
                  src={createAnimeForm.data.node.mainPicture.medium}
                  alt={createAnimeForm.data.node.title}
                />
              </div>

              <div className="description-section w-full">
                <div className="title nunito-700 text-lg text-slate-50 leading-none mb-2 pr-5">
                  {createAnimeForm.data.node.title}
                </div>

                <div className="description text-sm text-stone-500">
                  {truncate(createAnimeForm.data.node.description, 110)}
                </div>
              </div>
            </div>
          )}

          <form
            className="add-anime-form mt-8"
            onSubmit={handleSubmit(onAddAnimeFormSubmit)}
          >
            <FormControl fullWidth>
              <InputLabel id="select-status-label">Watching status</InputLabel>
              <Select
                labelId="select-status-label"
                id="select-status-select"
                value={watch("watchingStatus")}
                label="Watching status"
                onChange={(event) =>
                  setValue(
                    "watchingStatus",
                    event.target.value as WatchingStatus,
                  )
                }
              >
                <MenuItem value={WatchingStatus.Planning}>
                  {WatchingStatusLabels[WatchingStatus.Planning]}
                </MenuItem>
                <MenuItem value={WatchingStatus.Watching}>
                  {WatchingStatusLabels[WatchingStatus.Watching]}
                </MenuItem>
                <MenuItem value={WatchingStatus.Finished}>
                  {WatchingStatusLabels[WatchingStatus.Finished]}
                </MenuItem>
                <MenuItem value={WatchingStatus.Abandoned}>
                  {WatchingStatusLabels[WatchingStatus.Abandoned]}
                </MenuItem>
              </Select>
            </FormControl>

            <Button className="!mt-3" fullWidth type="submit">
              Submit
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Search;
