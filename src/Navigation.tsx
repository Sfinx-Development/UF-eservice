import { Route, Routes } from "react-router-dom";
import IndexPage from "./PAGES/Index";
import RootLayout from "./PAGES/Rootlayout";
import RegisterPage from "./PAGES/Register";

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
      </Route>
    </Routes>
  );
};

export default Navigation;
