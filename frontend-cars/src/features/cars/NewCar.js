import NewCarForm from "./NewCarForm";
//Importing the NewCarForm component(line 5)
import { useGetUsersQuery } from "../users/usersApiSlice";
//importing our useGetUsersQuery function from our usersApiSlice(line 3)
import ClipLoader from "react-spinners/ClipLoader";
//Importing ClipLoder component from the react-spinners package(line 5)//

const NewCar = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
    /*Defining our users from our useGetUsersQuery that is in the userList(line 12) and, 
    then we selectFromResult function(line 10), so we know that we the result and we're just getting the data from it and,
    now we just passing in the id(line 11)*/
  });

  if (!users?.length) return <ClipLoader color={"#FFF"} />;
  //If the users does'nt have length then we'll return the ClipLoader(line 18)//
  const content = <NewCarForm users={users} />;
  //Otherwise we create the content(line 20) and return it(line 22)
  return content;
};
export default NewCar;
