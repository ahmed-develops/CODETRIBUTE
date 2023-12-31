import {RouterProvider, createBrowserRouter} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Button from "react-bootstrap/esm/Button";

import LandingPage from "./pages/LandingPage";
import ContributorPortal from "./pages/contributor/ContributorPortal";
import PublisherPortal from "./pages/publisher/PublisherPortal";
import AdminPortal from "./pages/admin/AdminPortal";
import ViewProjects from "./pages/publisher/ViewProjects";
import ManageCommits from "./pages/publisher/ManageCommits";
import ViewCommits from "./pages/publisher/ViewCommits";
import ViewMyCommits from "./pages/contributor/ViewMyCommits";
import ViewAllListedProjects from "./pages/contributor/ViewAllListedProjects";
import ManageUserProfile from "./pages/admin/ManageUserProfile";
import Wallet from "./pages/Wallet";
import ViewSystemLogs from "./pages/admin/ViewSystemLogs";
import ViewActivityLogs from "./pages/ViewActivityLogs";
import Leaderboard from "./pages/Leaderboard";

function App() {
  
  const [loginCredentials, setLoginCredentials] = useState(null);
  const [loginState, setLoginState] = useState(false);

  const setLogin = (userdata) => {
    const credentials = {
      user_id: userdata.user_id,
      name: userdata.name,
      email: userdata.email,
      password: userdata.password,
      phone_number: userdata.phone_number,
      privilege: userdata.privilege,
      status: userdata.status
    };
    
    setLoginCredentials(credentials);
    
    if (userdata.status == "Active") {
      localStorage.setItem("loginCredentials", JSON.stringify(credentials));
    }
  };

  useEffect(() => {
    const getStoredLoginCreds = async () => {
      const storedLoginCredentials = localStorage.getItem("loginCredentials");
      if (storedLoginCredentials) {
        const parsedCredentials = JSON.parse(storedLoginCredentials);
        if (parsedCredentials) {
        await setLoginCredentials(parsedCredentials);
        }
      }
    };
  
    getStoredLoginCreds();
  }, []);
  

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage setLogin={setLogin} />
    },
    {
      path: "/wallet",
      element: <Wallet loginCredentials={loginCredentials}/>
    },
    {
      path: "/admin-portal",
      element: <AdminPortal loginCredentials={loginCredentials}/>,
    },
    {
      path: "/contributor-portal",
      element: <ContributorPortal loginCredentials={loginCredentials} />,
    },
    {
      path: "/publisher-portal",
      element: <PublisherPortal loginCredentials={loginCredentials} />,
    },

    // Admin
    {
      path: "/admin/manage-user-profile",
      element: <ManageUserProfile loginCredentials={loginCredentials}/>
    },
    {
      path: "/admin/view-system-logs",
      element: <ViewSystemLogs loginCredentials={loginCredentials}/>
    },

    // Publisher
    {
      path: "/publisher/view-projects",
      element: <ViewProjects loginCredentials={loginCredentials} />,
    },
    {
      path: "/publisher/manage-commits",
      element: <ManageCommits loginCredentials={loginCredentials} />,
    },
    {
      path: "/publisher/view-commits",
      element: <ViewCommits loginCredentials={loginCredentials} />,
    },

    // Contributor
    {
      path: "/contributor/view-all-listed-projects",
      element: <ViewAllListedProjects loginCredentials={loginCredentials} />,
    },
    {
      path: "/contributor/view-my-commits",
      element: <ViewMyCommits loginCredentials={loginCredentials} />,
    },
    {
      path: "/view-activity-logs",
      element: <ViewActivityLogs loginCredentials={loginCredentials}/>
    },
    {
      path: "/view-leaderboard",
      element: <Leaderboard loginCredentials={loginCredentials}/>
    },
  ]);

  return (
    <>
        <RouterProvider router={router} />
    </>
  );
}

export default App;