import { useParams } from "react-router-dom";
//Importing useParams from react-router-dom(line 1), because we are getting the user id parammeter from the url//
import { useGetUsersQuery } from "./usersApiSlice";
//importing our useGetUsersQuery function from our usersApiSlice(line 3)
import ClipLoader from "react-spinners/ClipLoader";
//Importing ClipLoder component from the react-spinners package(line 5)//
import EditUserForm from "./EditUserForm";
//Importing the EditUserForm component(line 7)

const EditUser = () => {
  const { id } = useParams();
  /*Pulling the user id from the useParams(line 11), that we get from react-router, 
  which should give us the id value that is inside the url*/

  const { user } = useGetUsersQuery("userList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
    /*Defining our user from our useGetUsersQuery that is in the usersList(line 15) and, 
    then we selectFromResult function(line 16), so we know that we the result and we're just getting the data from it and,
    now we just passing in the id(line 17)*/
  });

  if (!user) return <ClipLoader color={"#FFF"} />;
  //If we don't have a user then we will return the ClipLoader(line 24), meaning that the data is still loading//
  const content = <EditUserForm user={user} />;
  //Otherwithe we will create the content(line 26) and then we return the content(line 28)//
  return content;
};

export default EditUser;
