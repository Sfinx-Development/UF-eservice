import { Route, Routes } from "react-router-dom";
import AdListPage from "./PAGES/AdListPage";
import DashboardPage from "./PAGES/Dashboard";
import IndexPage from "./PAGES/Index";
import Login from "./PAGES/Login";
import NewAdPage from "./PAGES/NewAdd";
import RegisterPage from "./PAGES/Register";
import RootLayout from "./PAGES/Rootlayout";
import ProtectedRoute from "./ProtectedRoute";
import AdDetailPage from "./PAGES/AdDetailPage";

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
        <Route path="newad" element={<ProtectedRoute element={NewAdPage} />} />
        <Route
          path="adlist"
          element={<ProtectedRoute element={AdListPage} />}
        />
        <Route
          path="addetail"
          element={<ProtectedRoute element={AdDetailPage} />}
        />

        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default Navigation;
