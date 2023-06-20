import { useLocation, Navigate, Outlet } from "react-router-dom";
//Importing useLocation, OutLet, Navigate from react-router-dom(line 2)//
import useAuth from "../../hooks/useAuth";
//importing the useAuth hook we created(line 3)//
const RequireAuth = ({ allowedRoles }) => {
  //passing allowedRoles into our requireAuth function(line 5)
  const location = useLocation();
  //getting the location from the useLocation hook(line 7)//
  const { roles } = useAuth();
  //Only bringing in the roles array from the useAuth hook(line 9)//
  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
  /*The content(line 11) is equal to the ternary statement(lines 11-15), 
    in which we use the roles array and attach the some method and inside the some method,
    we pass in the roles meaning if we find one of the roles it's good, we also pass in the allowedRoles,
    which has the includes method attached to it and we are checking all the roles, 
    So basically if allowedRoles includes one of the roles that the user has that we recieve from the useAuth hook, 
    then we'll have true and we return the OutLet(line 12), which is all the children*/

  /* and whatever routes we are going wrap this component around will be protected from anyone who does'nt have any access to, 
  and if they try to access that protected page, they'll be sent to the login page*/

  return content;
};
export default RequireAuth;
