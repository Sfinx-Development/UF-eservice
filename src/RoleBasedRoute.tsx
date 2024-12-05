import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./SLICES/store";

interface RoleBasedProtectedRouteProps {
  element: React.ComponentType<object>;
  allowAdmin?: boolean;
  [key: string]: unknown;
}

const RoleBasedProtectedRoute: React.FC<RoleBasedProtectedRouteProps> = ({
  element: Component,
  allowAdmin = true,
  ...rest
}) => {
  const user = useAppSelector((state) => state.userSlice.user);
  const admin = useAppSelector((state) => state.userSlice.admin);

  if (user || (allowAdmin && admin)) {
    // mm användaren är inloggad eller om admin är tillåten och inloggad
    return <Component {...(rest as object)} />;
  } else {
    // om ingen åtkomst, navigera till startsidan
    return <Navigate to="/" />;
  }
};

export default RoleBasedProtectedRoute;
