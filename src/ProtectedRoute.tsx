import { Navigate } from "react-router-dom";
import { useAppSelector } from "./SLICES/store";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const user = useAppSelector((state) => state.userSlice.user);

  if (user) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
