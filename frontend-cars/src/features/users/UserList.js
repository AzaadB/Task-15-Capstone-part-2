import { useGetUsersQuery } from "./usersApiSlice";
//importing the useGetUsersQuery hook from the usersApiSlice component(line 1)//
import User from "./User";

const UsersList = () => {
  /*Inside this functional component(line 5) we are using the useGetUsersQuery hook(line 16), 
  we are also getting a few things such as data which we rename as users, 
  we also getting several states that we have to monitor such as an isLoading, isSuccess, isError and 
  if there is an error we'll know what it is(lines 11-15)*/
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery('userList', {
    //Passing in options into our useGetUsersQuery function(line 16)//
    pollingInterval: 60000,
    /*The pollingInterval is set to 60 000 milliseconds, 
    so every minute it requeries the data and if the pages is open to a users list, then we will recieve new data again*/
    refetchOnFocus: true,
    /*refetchOnFocus(line 22) is saying if we go to a different window and then come back to the browser, 
    then we also refetch the data*/
    refetchOnMountOrArgChange: true,
    //refetchOnMountOrArgChange (line 23), is basically saying, if the component is remounted, then we refetch the data
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;
  //If is loading is true, then we set the content to loading(line 20)

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;
    /*Inside the if statement(line 27) we check if isSuccess is true and if it is, 
    then we destructure the ids from the data that was renamed to users on (line 11) (line 28)*/

    /*We are also checking if there are ids that have the length of that array(line 34),
    and if they do, then we are mapping over those ids and passing in the userId ,
    and then we provide a user component and it recieves the user id and there also has to be a key(line 37), 
    if there is no link to the ids array, then then it just becomes null(line 38)*/
    const tableContent = ids?.length 
       && ids.map((userId) => <User key={userId} userId={userId} />)

    content = (
      //creating a table for the content(lines 42-57)
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default UsersList;
