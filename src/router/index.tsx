import '../index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRoutes } from "react-router-dom";
import Loadable from "./Loadable";
import { lazy } from "react";
import SearchPage from '../pages/SearchPage/SearchPage';
import MovieSearchPage from '../pages/SearchPage/MovieSearchPage';
import ShowSearchPage from '../pages/SearchPage/ShowSearchPage';

// Error routes
const Error404Page = Loadable(lazy(() => import("../pages/NotFound/NotFound")));

// Main layout
const MainLayout = Loadable(lazy(() => import("../pages/MainLayout/MainLayout")));

// Pages
const Homepage = Loadable(lazy(() => import("../pages/Homepage/Homepage")));
const MovieWatchPage = Loadable(lazy(() => import("../pages/MovieWatchPage/MovieWatchPage")));
const WatchlistPage = Loadable(lazy(() => import("../pages/Watchlist/Watchlist")));

//Test
const LoginTest = Loadable(lazy(() => import("../pages/Test/LoginTest")));

const Router = () =>
  useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Homepage />,
        },
        {
          path: "watch/:type/:id",
          element: <MovieWatchPage />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
        {
          path: "explore/movies",
          element: <MovieSearchPage />,
        },
        {
          path: "explore/tv",
          element: <ShowSearchPage />,
        }, 
        {
          path: "watchlist",
          element: <WatchlistPage />,
        }, 
      ],
    },
    {
          path: "/test",
          element: <LoginTest/>
    },
    {
      path: "*",
      element: <Error404Page />,
    },
  ]);


export default Router;
