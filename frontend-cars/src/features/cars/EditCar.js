import { useParams } from "react-router-dom";
//Importing useParams from react-router-dom(line 1), because we are getting the user id parammeter from the url//
import { useGetCarsQuery } from "./carsApiSlice";
//Importing useSelector from react-redux(line 3)
import { useGetUsersQuery } from "../users/usersApiSlice";
//Pulling the car data and how we do that is getting it from the selectCarById that we get from our carsApiSlice component(line 5)
import EditCarForm from "./EditCarForm";
//Importing the EditCarForm component(line 7)
import useAuth from "../../hooks/useAuth";
//importing the useAuth hook we created(line 9)
import ClipLoader from "react-spinners/ClipLoader";
//Importing ClipLoder component from the react-spinners package(line 11)//
const EditCar = () => {
  const { id } = useParams();
  /*Pulling the user id from  the useParams(line 14), that we get from react-router, 
  which should give us the id value that is inside the url*/
  const { username, isManager, isAdmin } = useAuth();
  //destructuring username, isManager and isAdmin from the useAuth hook(line 17)

  const { car } = useGetCarsQuery("carsList", {
    selectFromResult: ({ data }) => ({
      car: data?.entities[id],
    }),
    /*Defining our car from our useGetCarsQuery that is in the carsList(line 20) and, 
    then we selectFromResult function(line 21), so we know that we the result and we're just getting the data from it and,
    now we just passing in the carId(line 22)*/
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
    /*Defining our car from our useGetUsersQuery that is in the userList(line 29) and, 
    then we selectFromResult function(line 30), so we know that we the result and we're just getting the data from it and,
    now we just passing in the carId(line 31)*/
  });

  if (!car || !users?.length) return <ClipLoader color={"#FFF"} />;
  /*If we don't have a car or the user doesn't have length, then we will return the ClipLoader(line 24), 
  meaning that the data is still loading*/
  if (!isManager && !isAdmin) {
    if (car.username !== username) {
      return <p className="errmsg">No access</p>;
    }
    /*If the user is not a manager or Admin(line 41) or if their username does'nt match that of a manager or admin(line 42), 
    then they have no access to edit a car(line 43)*/
  }

  const content = <EditCarForm car={car} users={users} />;
  //But if they are a manager or Admin, then the edit form will be displayed with the info of the car they are editing
  return content;
};
export default EditCar;
