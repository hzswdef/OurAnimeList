import { useEffect } from "react";

const siteName = import.meta.env.VITE_SITE_NAME;

const useTitle = (title: string = "", separator: string = " | ") => {
  useEffect(() => {
    return () => {
      document.title = title ? siteName + separator + title : siteName;
    };
  }, [title, separator]);
};

export default useTitle;
