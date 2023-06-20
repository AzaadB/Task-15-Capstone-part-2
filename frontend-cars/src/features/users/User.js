import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//Importing the FontAwesomeIcon component(line 1)//
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
//Importing the faPenToSquare icon from the @fortawesome/free-solid-svg-icons library(line 3)//
import { useNavigate } from "react-router-dom";
//Importing useNavigate from react-router-dom(line 5)//
import { useGetUsersQuery } from "./usersApiSlice";
//importing our useGetUsersQuery function from our usersApiSlice(line 7)
import { memo } from "react";
//importing memo from react(line 9)
const User = ({ userId }) => {
  const { user } = useGetUsersQuery("userList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
    /*Defining our car from our useGetUsersQuery that is in the userList(line 12) and, 
    then we selectFromResult function(line 13), so we know that we the result and we're just getting the data from it and,
    now we just passing in the carId(line 14)*/
  });
  //Puling the navigate function from useNavigate(line 21)//
  const navigate = useNavigate();

  if (user) {
    /*Inside this if statement(line 18) we have handle edit function, which will navigate to /dash/users and,
    whatever the userId is, it will finish off the url(line 21)*/
    const handleEdit = () => navigate(`/dash/users/${userId}`);
    /*Pulling all the user roles from the array and setting them to a string(line 24), 
    we also are replacing the commas with commas and a space (line 24)*/
    const userRolesString = user.roles.toString().replaceAll(",", ", ");
    //Defining a cell status on the active user to see if they're incative or not(line 26)
    const cellStatus = user.active ? "" : "table__cell--inactive";

    return (
      <tr className="table__row user">
        <td className={`table__cell ${cellStatus}`}>{user.username}</td>
        <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};
const memoizedUser = memo(User);
//destructuring memo and passing in the User(line 46)
export default memoizedUser;
/*Instead of exporting the User we are exporting the memoizedUser(line 48), 
now This component will only re-render if there are changes in the data*/