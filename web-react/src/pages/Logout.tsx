import { useNavigate } from "react-router";

import useAuth from "@hooks/useAuth";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  logout();
  navigate("/");

  return <></>;
};

export default Logout;
