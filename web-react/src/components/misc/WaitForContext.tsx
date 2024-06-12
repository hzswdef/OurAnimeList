import { ReactNode } from "react";

import useAuth from "@hooks/useAuth";
import CircularProgressCustom from "@components/misc/CircularProgressCustom";

interface WaitForContextProps {
  children: ReactNode;
}

const WaitForContext = (props: WaitForContextProps) => {
  const { children } = props;

  const { dataIsLoading } = useAuth();

  if (dataIsLoading) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <CircularProgressCustom />
      </div>
    );
  }

  return <>{children}</>;
};

export default WaitForContext;
