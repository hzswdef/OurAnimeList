import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { Button } from "@mui/material";

import useAuth from "@hooks/useAuth";
import BackendApi from "@api/BackendApi";
import ApiErrorHandle from "@helpers/ApiErrorHandle";

import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => onSuccessLogin(tokenResponse),
    flow: "implicit",
  });

  const onSuccessLogin = (tokenResponse: TokenResponse) => {
    new BackendApi()
      .userGoogleLogin(tokenResponse.access_token)
      .then((response) => login(response.data.token))
      .catch((error) =>
        ApiErrorHandle(error, {
          403: "You're not whitelisted.",
        }),
      );
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Button
        className="!normal-case nunito-400"
        size="large"
        onClick={() => googleLogin()}
        startIcon={<GoogleIcon />}
      >
        Sign In with Google
      </Button>
    </div>
  );
};

export default Login;
