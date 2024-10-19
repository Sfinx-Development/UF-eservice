import { Route, Routes } from "react-router-dom";
import DashboardPage from "./PAGES/Dashboard";
import IndexPage from "./PAGES/Index";
import Login from "./PAGES/Login";
import RegisterPage from "./PAGES/Register";
import RootLayout from "./PAGES/Rootlayout";
import ProtectedRoute from "./ProtectedRoute";

const Navigation = () => {
  // const [userLoaded, setUserLoaded] = useState(false);
  // const user = useAppSelector((state) => state.userSlice.user);

  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(getUserAsync()).then(() => {
  //     setUserLoaded(true);
  //   });
  // }, []);

  // const location = useLocation();

  // useEffect(() => {
  //   if (
  //     location.pathname === "/chooseteam" ||
  //     location.pathname === "/signin"
  //   ) {
  //     console.log("choose team");
  //     dispatch(resetActiveProile());
  //     dispatch(resetActiveTeam());
  //   }
  // }, [dispatch, location]);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (userLoaded && !user) {
  //     navigate("/signin", { replace: true });
  //   }
  // }, [userLoaded, user]);

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="dashboard"
          element={<ProtectedRoute element={DashboardPage} />}
        />

        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default Navigation;
