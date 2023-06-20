import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//Importing the FontAwesomeIcon component(line 1)//
import { faHouse } from "@fortawesome/free-solid-svg-icons";
//Importing the faHouse icon from the @fortawesome/free-solid-svg-icons library(line 3)//
import { useNavigate, useLocation } from "react-router-dom";
//Importing useNavigate and useLocation from react-router-dom(line 5)//
import useAuth from "../hooks/useAuth";
//importing the useAuth hook we created(line 7)
const DashFooter = () => {
  //Destructuring the useAuth hook by pulling in the username and status and setting them to useAuth(line 11)//
  const { username, status } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  //destructuring pathname from the useLocation hook(line 10)
  const onGoHomeClicked = () => navigate("/dash");

  let goHomeButton = null;
  if (pathname !== "/dash") {
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }

  const content = (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );
  return content;
};
export default DashFooter;
