import React from "react";
import { useEffect } from "react";
//importing useEffect hook from react(line 2)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//Importing the FontAwesomeIcon component(line 4)//
import {
  faRightFromBracket,
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
/*Importing the faRightFromBracket, faFileCirclePlus, faFilePen, 
faUserGear and faUserPlus icons from the @fortawesome/free-solid-svg-icons library(line 6)*/
import { useNavigate, Link, useLocation } from "react-router-dom";
//Importing useNavigate, Link, useLocation from react-router-dom(line 9)//
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
//importing our  useSendLogoutMutation from our authApiSlice component(line 11)
import useAuth from "../hooks/useAuth";
//importing the useAuth hook we created(line 13)
const DASH_REGEX = /^\/dash(\/)?$/;
const CARS_REGEX = /^\/dash\/cars(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;
/*These regex constants(lines 12-14), we'll use to compare the location in the url to verify 
which url we are at i.e the users, dash or cars or not at and we can use them to decide weather we want something to display such as
a button in the header or not*/
const DashHeader = () => {
  const { isManager, isAdmin } = useAuth();
  //destructuring isManager and isAdmin from the useAuth hook(line 21)
  const navigate = useNavigate();
  //using the useNavigate hook to bring in the navigate function(line 18)
  const { pathname } = useLocation();
  //destructuring the pathname from the useLocation hook(line 19)//
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();
  /*Bringing in our useLogoutMutation hook and we're bringing in a sendLogout fuction that we can call whenever we need it(line 21)
  it's also going to have an isLoading,  isSuccess, isError, error state(line 21)*/
  useEffect(() => {
    /*This useEffect(line 27) is checking the status of isSuccess(line 30), 
    we also have to put in the navigate function(line 31) to appease the warnings that we might recieve inside the console 
    even though the navigate function won't change*/
    if (isSuccess) navigate("/");
    /*So if isSuccess(line 31), then we'll navigate to the root and this is because 
    it's a log out, so we'll go back to the root of the site*/
  }, [isSuccess, navigate]);
  /*creating handlers which have the navigate function(lines 47-50) and provides easy navigation for a user*/
  const onNewCarClicked = () => navigate("/dash/cars/new");
  const onNewUserClicked = () => navigate("/dash/users/new");
  const onCarsClicked = () => navigate("/dash/cars");
  const onUsersClicked = () => navigate("/dash/users");

  let dashClass = null;
  //defining a class for the dash(line 40)//
  if (!DASH_REGEX.test(pathname) && !CARS_REGEX.test(pathname) && !USERS_REGEX.test(pathname) ) {
    /*We checking that we're not on the dash path and we're not on the cars or users path either(lines 43-45), 
    and if we're not on either of them, then we'll set the dashClass(line 40) to a dash-header__container--small*/
    dashClass = "dash-header__container--small";
  }
  //defining the newCarButton with the keyword let and setting it to null(line 60)//
  let newCarButton = null;
  if (CARS_REGEX.test(pathname)) {
    newCarButton = (
      <button
        className="icon-button"
        title="New Note"
        onClick={onNewCarClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let carsButton = null;
  if (!CARS_REGEX.test(pathname) && pathname.includes("/dash")) {
    carsButton = (
      <button className="icon-button" title="Cars" onClick={onCarsClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }
  //defining a logoutButton(line 52)
  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? "errmsg" : "offscreen";

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>;
  } else {
    buttonContent = (
      <>
        {newCarButton}
        {newUserButton}
        {carsButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash">
            <h1 className="dash-header__title">Pete's Car Emporium</h1>
          </Link>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header>
    </>
  );

  return content;
};
export default DashHeader;
