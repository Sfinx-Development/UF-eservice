import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./SLICES/store";

interface ProtectedRouteProps {
  element: React.ComponentType<object>;
  [key: string]: unknown;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Component,
  ...rest
}) => {
  const user = useAppSelector((state) => state.userSlice.user);

  if (user) {
    return <Component {...(rest as object)} />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
