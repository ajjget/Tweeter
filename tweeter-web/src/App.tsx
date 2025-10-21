import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/paged_item/FolloweePresenter";
import { FollowerPresenter } from "./presenter/paged_item/FollowerPresenter";
import { FeedPresenter } from "./presenter/paged_item/FeedPresenter";
import { StoryPresenter } from "./presenter/paged_item/StoryPresenter";
import { PagedItemView } from "./presenter/paged_item/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const createStatusItem = (featurePath: string) => {
  return (status: Status) => <StatusItem status={status} featurePath={featurePath} />;
};

const createUserItem = (featurePath: string) => {
  return (user: User) => <UserItem user={user} featurePath={featurePath} />;
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route 
          path="feed/:displayedUser" 
          element={
            <ItemScroller 
              key={`feed-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<Status>) => new FeedPresenter(view)}
              itemComponentGenerator={createStatusItem("/feed")}
            />
          } 
        />
        <Route 
          path="story/:displayedUser" 
          element={
            <ItemScroller 
              key={`story-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<Status>) => new StoryPresenter(view)}
              itemComponentGenerator={createStatusItem("/story")}
            />
          } 
        />
        <Route 
          path="followees/:displayedUser" 
          element={
            <ItemScroller 
              key={`followees-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<User>) => new FolloweePresenter(view)}
              itemComponentGenerator={createUserItem("/followees")}
            />
          } 
        />
        <Route 
          path="followers/:displayedUser" 
          element={
            <ItemScroller 
              key={`followers-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<User>) => new FollowerPresenter(view)}
              itemComponentGenerator={createUserItem("/followers")}
            />
          } 
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      <Route path="*" element={
        <Login originalUrl={location.pathname}/>} />
    </Routes>
  );
};

export default App;
