import { Navigate, Route, Routes } from "react-router-dom";

import useAuth from "@hooks/useAuth";
import FrontPage from "@pages/FrontPage";
import Login from "@pages/Login";
import Logout from "@pages/Logout";

const AppRoutes = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <Routes>
        <Route index path="/" element={<FrontPage />} />
        <Route index path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route index path="/signin" element={<Login />} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};

export default AppRoutes;
