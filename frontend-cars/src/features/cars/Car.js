import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//Importing the FontAwesomeIcon component(line 1)//
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
//Importing the faPenToSquare icon from the @fortawesome/free-solid-svg-icons library(line 3)//
import { useNavigate } from "react-router-dom";
//Importing useNavigate from react-router-dom(line 5)//
import { useGetCarsQuery } from "./carsApiSlice";
//importing our useGetCarsQuery function from our carsApiSlice(line 7)
import { memo } from "react";
//importing memo from react(line 9)
const Car = ({ carId }) => {
  const { car } = useGetCarsQuery("carList", {
    selectFromResult: ({ data }) => ({
      car: data?.entities[carId],
    }),
    /*Defining our car from our useGetCarsQuery that is in the carsList(line 10) and, 
    then we selectFromResult function(line 11), so we know that we the result and we're just getting the data from it and,
    now we just passing in the carId(line 12)*/
  });
  const navigate = useNavigate();

  if (car) {
    const created = new Date(car.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(car.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    /*Inside this if statement(line 18), we have a created and updated date provided by mongoDB, and, we add .toLocaleString to it
    and we adding in en-US due to where Pete's Car Emporium is located(lines 19-24)*/

    //Now for both the created and updated dates we are providing the day value as numeric and the month as long(lines 20, 21, 25 and 26)/

    /*On (line 35) we have handle edit function, which will navigate to /dash/cars and we are passing in
    whatever the carId is, it will finish off the url(line 30)*/
    const handleEdit = () => navigate(`/dash/cars/${carId}`);

    return (
      <tr className="table__row">
        <td className="table__cell car__make">{car.make}</td>
        <td className="table__cell car__model">{car.model}</td>
        <td className="table__cell car__registration">{car.registration}</td>
        <td className="table__cell car__created">{created}</td>
        <td className="table__cell car__updated">{updated}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};
const memoizedCar = memo(Car);
//destructuring memo and passing in the Car(line 58)
export default memoizedCar;
/*Instead of exporting the Car we are exporting the memoizedCar(line 61), 
now This component will only re-render if there are changes in the data*/
