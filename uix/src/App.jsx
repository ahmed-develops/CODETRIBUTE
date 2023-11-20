import {RouterProvider, createBrowserRouter} from "react-router-dom";
import { useState, useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import ContributorPortal from "./pages/contributor/ContributorPortal";
import PublisherPortal from "./pages/publisher/PublisherPortal";
import AdminPortal from "./pages/admin/AdminPortal";
import ViewProjects from "./pages/publisher/ViewProjects";
import ManageCommits from "./pages/publisher/ManageCommits";
import ViewCommits from "./pages/publisher/ViewCommits";
import ViewMyCommits from "./pages/contributor/ViewMyCommits";
import ViewAllListedProjects from "./pages/contributor/ViewAllListedProjects";
import Wallet from "./pages/Wallet";

import "./App.css";
import Button from "react-bootstrap/esm/Button";

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
    };
    setLoginCredentials(credentials);
    setLoginState(true);
    localStorage.setItem("loginCredentials", JSON.stringify(credentials));
  };

  const logout = () => {
    setLoginCredentials(null);
    setLoginState(false);
    localStorage.removeItem("loginCredentials");
    window.location = "/";
  };

  useEffect(() => {
    const storedLoginCredentials = localStorage.getItem("loginCredentials");
    if (storedLoginCredentials) {
      const parsedCredentials = JSON.parse(storedLoginCredentials);
      setLoginCredentials(parsedCredentials);
    }
  }, [loginState]);

  console.log(loginCredentials);

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
      element: <AdminPortal />,
    },
    {
      path: "/contributor-portal",
      element: <ContributorPortal loginCredentials={loginCredentials} />,
    },
    {
      path: "/publisher-portal",
      element: <PublisherPortal loginCredentials={loginCredentials} />,
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
  ]);

  return (
    <>
      {loginCredentials?.user_id && loginState ? (
        <>
          <div className="app-container">
            <Button
              className="logout-button"
              variant="primary"
              onClick={logout}
              
            >
              Logout
            </Button>
          </div>
          <RouterProvider router={router} />
        </>
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}

export default App;
