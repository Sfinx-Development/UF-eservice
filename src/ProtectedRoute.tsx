import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./SLICES/store";

interface ProtectedRouteProps {
  element: React.ComponentType<object>; // Anger att Component är en React-komponent som tar ett objekt som props
  [key: string]: unknown; // För `rest` om du vill tillåta andra props
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Component,
  ...rest
}) => {
  const user = useAppSelector((state) => state.userSlice.user);

  if (user) {
    return <Component {...(rest as object)} />; // Typen för `rest` anges till `object` vid spridning
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
