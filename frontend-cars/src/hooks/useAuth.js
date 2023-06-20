import { useSelector } from "react-redux";
//importing useSelector from redux(line 1)
import { selectCurrentToken } from "../features/auth/authSlice";
//importing selectCurrentToken function from our authApiSlice component(line 3)
import jwtDecode from "jwt-decode";
//importing jwtDecode from the jwt-decode dependency(line 5)//
const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  /*We are pulling in the token using the useSelector and selectCurrentToken selector from our state,
  which will be the current token that we have recieved which is also known as the accessToken(line 8)*/
  let isManager = false;
  //Setting value for isManager, which is false(line 11)//
  let isAdmin = false;
  //Setting value for isAdmin, which is false(line 13) //
  let status = "Employee";
  //The default value for status will be Employee(line 15)//
  if (token) {
    const decoded = jwtDecode(token);
    //So if we do have a token, then we'll decode it using jwtDecode(line 18)//
    const { username, roles } = decoded.UserInfo;
    /*and destructuring the username and roles(line 20) that are inside that token and the reason why we say decoded.UserInfo(line 20),
    is because on the backend we put the username and role inside of a UserInfo property when we stored it into the token*/
    isManager = roles.includes("Manager");
    /*Setting the value for isManager to check if the roles includes Manager, 
    because it's an array with different values inside of it(line 23)*/
    isAdmin = roles.includes("Admin");
    /*Setting the value for isAdmin to check if the roles includes Admin,
    because it's an array with different values inside of it(line 26)*/
    if (isManager) status = "Manager";
    /*Checking the status of isManager and then setting it to Manager(line 29), 
    instead of employee like it is above on (line 15), because manager in the case on(line 29) is the highest status*/
    if (isAdmin) status = "Admin";
    /*Checking the status of isAdmin and then setting it to Admin(line 32), 
    instead of employee like it is above on(line 15), if someone is an admin and a manager 
    their status will be set to Admin, because that is the highest status*/

    /*Whatever we store into status(line 15) is the highest role available to a user, 
    ie. if someon is an Employee, Manager and Admin, then their highest role available would be Admin,
    Likewise if they were a Manager, Admin, ect.*/
    return { username, roles, status, isManager, isAdmin };
    //returning the username, roles, status, isManager, isAdmin(line 38)
  }
  return { username: "", roles: [], isManager, isAdmin, status };
  /*returning an object which starts off with username and an empty string and then we have roles which will be an empty array
  and then we just bring in the isManager, isAdmin and status(line 41), 
  these things on(line 41) will only be returned if there is no token*/
};
export default useAuth;
