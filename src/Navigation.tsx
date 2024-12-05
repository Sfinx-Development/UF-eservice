import { Route, Routes } from "react-router-dom";
import AdDetailPage from "./PAGES/AdDetailPage";
import AdListPage from "./PAGES/AdListPage";
import AdminAdListPage from "./PAGES/AdminAdList";
import AdminChatList from "./PAGES/AdminChatList";
import AdminDashboard from "./PAGES/AdminDashboard";
import AdminAdDetailPage from "./PAGES/AdminDetailPage";
import Chat from "./PAGES/Chat";
import ChatList from "./PAGES/ChatList";
import DashboardPage from "./PAGES/Dashboard";
import IndexPage from "./PAGES/Index";
import Login from "./PAGES/Login";
import LoginAdmin from "./PAGES/LogInAdmin";
import NewAdPage from "./PAGES/NewAdd";
import ProfilePage from "./PAGES/Profile";
import RegisterPage from "./PAGES/Register";
import RootLayout from "./PAGES/Rootlayout";
import Terms from "./PAGES/Terms";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import ProtectedRoute from "./ProtectedRoute";
import PrivacyPolicy from "./PAGES/PrivacyPolicy";
import CookieInfo from "./PAGES/CookieInfo";
import AdminChat from "./PAGES/AdminChat";

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
        <Route path="terms" element={<Terms />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="cookie-info" element={<CookieInfo />} />
        <Route
          path="dashboard"
          element={<ProtectedRoute element={DashboardPage} />}
        />
        <Route path="newad" element={<ProtectedRoute element={NewAdPage} />} />
        <Route
          path="profile"
          element={<ProtectedRoute element={ProfilePage} />}
        />
        <Route
          path="profile/:id"
          element={<ProtectedRoute element={ProfilePage} />}
        />
        <Route
          path="adlist"
          element={<ProtectedRoute element={AdListPage} />}
        />
        <Route
          path="addetail"
          element={<ProtectedRoute element={AdDetailPage} />}
        />
        <Route
          path="chatlist"
          element={<ProtectedRoute element={ChatList} />}
        />
        <Route
          path="chat/:chatId"
          element={<ProtectedRoute element={Chat} />}
        ></Route>

        <Route
          path="admin-dashboard"
          element={<ProtectedAdminRoute element={AdminDashboard} />}
        ></Route>

        <Route
          path="admin-chatlist"
          element={<ProtectedAdminRoute element={AdminChatList} />}
        ></Route>
        <Route
          path="support-chat/:chatId"
          element={<ProtectedRoute element={AdminChat} />}
        ></Route>
        <Route
          path="admin-addetail"
          element={<ProtectedAdminRoute element={AdminAdDetailPage} />}
        ></Route>
        <Route
          path="admin-adlist"
          element={<ProtectedAdminRoute element={AdminAdListPage} />}
        ></Route>

        <Route path="login" element={<Login />} />
        <Route path="admin-login" element={<LoginAdmin />} />
      </Route>
    </Routes>
  );
};

export default Navigation;
