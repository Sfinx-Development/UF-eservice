import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./SLICES/store";

interface ProtectedAdminRouteProps {
  element: React.ComponentType<object>; // Anger att Component är en React-komponent som tar ett objekt som props
  [key: string]: unknown; // För `rest` om du vill tillåta andra props
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  element: Component,
  ...rest
}) => {
  const admin = useAppSelector((state) => state.userSlice.admin);

  if (admin) {
    return <Component {...(rest as object)} />; // Typen för `rest` anges till `object` vid spridning
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedAdminRoute;
