import { useGetCarsQuery } from "./carsApiSlice";
//importing the useGetUsersQuery hook from the usersApiSlice component(line 1)//
import Car from "./Car";
//Importing the Car component(line 3)
import useAuth from "../../hooks/useAuth";
//importing the useAuth hook we created(line 5)
import ClipLoader from "react-spinners/ClipLoader";
//Importing ClipLoder component from the react-spinners package(line 7)//
const CarList = () => {
  /*Inside this functional component(line 6) we are using the useGetUsersQuery hook(line 10), 
  we are also getting a few things such as data which we rename as users, 
  we also getting several states that we have to monitor such as an isLoading, isSuccess, isError and 
  if there is an error we'll know what it is(line 10)*/
  const { isManager, isAdmin } = useAuth();
  //destructuring username, isManager and isAdmin from the useAuth hook(line 12)
  const {
    data: cars,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCarsQuery("carList", {
    //Passing in options into our useGetUsersQuery function(line 16)//
    pollingInterval: 15000,
    /*The pollingInterval is set to every 15 seconds, because the cars could be more active 
    and more than one person could be working on them, so every 15 seconds the most recent data will be shown */
    refetchOnFocus: true,
    /*refetchOnFocus(line 21) is saying if we go to a different window and then come back to the browser, 
    then we also refetch the data*/
    refetchOnMountOrArgChange: true,
    //refetchOnMountOrArgChange (line 24), is basically saying, if the component is remounted, then we refetch the data
  });
  let content;

  if (isLoading) content = <ClipLoader color={"#FFF"}/>;
  //If is loading is true, then we set the content to the ClipLoader spinner(line 35)//
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities} = cars;
    /*Inside the if statement(line 39) we check if isSuccess is true and if it is, 
    then we destructure the ids and entities(line 40)from the useGetCarsQuery hook on(line 20)*/

    //On (line 40) the ids and entities are just an array of the cars id's and entities//

    //creating a filteredIds(line 47)//
    let filteredIds
    /*Now we checking if we have a manager or admin(line 50), the filteredIds are going to be similar to the actual ids array,
    but we are going to create a whole new array that holds the filteredIds, so that the ids array are spread(line 51)*/
    if (isManager || isAdmin) {
      filteredIds = [...ids]
      /*else if we're just an employee, then the filteredIds are going to equal the ids array that are filtered, 
      where each carId is going to be used on the entities, so that entity can be identified and 
      then we're looking at the username for that specific note and if it matches the username of the employee(line 55)*/
  } else {
      filteredIds = ids.filter(carId => entities[carId])
  }
    /*So for the map method on(line 59), we are saying if the ids array have length, 
    then we are attaching the filteredIds array to the map method instead*/
    const tableContent = ids?.length && filteredIds.map(carId => <Car key={carId} carId={carId}/>)

     /*We are also checking if there are ids that have the length of that array(line 34),
    and if they do, then we are mapping over those ids and passing in the carId ,
    and then we provide a car component and it recieves the car id and there also has to be a key(line 39), 
    if there is no link to the ids array, then then it just becomes null(line 40)*/
    content = (
      //creating a table for the content(lines 43-68)
      <table className="table table--cars">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th car__make">
              Make
            </th>
            <th scope="col" className="table__th car__model">
              Model
            </th>
            <th scope="col" className="table__th car__registration">
              Registration
            </th>
            <th scope="col" className="table__th car__created">
              Created
            </th>
            <th scope="col" className="table__th car__updated">
              Updated
            </th>
            <th scope="col" className="table__th car__edit">
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
export default CarList;
