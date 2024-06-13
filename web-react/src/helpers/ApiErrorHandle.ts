import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface customErrorMessageObjectInterface {
  [httpStatusCode: number]: string;
}

const ApiErrorHandle = (
  error: AxiosError,
  customErrorMessage:
    | string
    | customErrorMessageObjectInterface
    | undefined = undefined,
) => {
  if (error.code === "ERR_NETWORK") {
    return toast.error("Backend unavailable...");
  }

  if (customErrorMessage !== undefined) {
    if (typeof customErrorMessage === "string") {
      return toast.error(customErrorMessage);
    } else {
      if (error?.response && customErrorMessage[error.response.status]) {
        toast.error(customErrorMessage[error.response.status]);
      }
    }
  }

  if (error?.response) {
    if (error.response.status === 500) {
      return toast.error("Internal Server Error.");
    }
  }
};

export default ApiErrorHandle;
