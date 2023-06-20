import { useState, useEffect } from "react";
//importing useState and useEffect hooks(line 1)
import { useUpdateCarMutation, useDeleteCarMutation } from "./carsApiSlice";
//importing useUpdateCarMutation, useDeleteCarMutation that was created from the carsApiSlice component(line 3)
import { useNavigate } from "react-router-dom";
//importing useNavigate from react-router-dom(line 5)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/*importing FontAwesomeIcon(line 7), because we are using a faSave icon on(line 10) 
and the faTrahCan icon which will be used for deleteing(line 10) from it*/
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditCarForm = ({ car }) => {
  //destructuring the user and car in the EditCarForm function(line 12)//
  //the updateCar(line 15) gives us a function, which when needed we can call it in the component//
  const { isManager, isAdmin } = useAuth();
  //destructuring isAdmin and isAdmin from the useAuth hook(line 16)
  const [updateCar, { isLoading, isSuccess, isError, error }] =
    useUpdateCarMutation();
  //This object, which has isLoding, isSuccess, isError and error delivers the status when we call the updateUser function(line 15)//
  const [
    deleteCar,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCarMutation();
  //the deleteCar(line 19) gives us a function, which when needed we can call it in the component//

  /*This object, which has isSuccess, isDelSuccess, isError: isDelError 
  and error: delerror delivers the status when we call the deleteUser function(line 19)*/
  const navigate = useNavigate();

  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [registration, setRegistration] = useState(car.registration);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setMake("");
      setModel("");
      setRegistration("");
      navigate("/dash/cars");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onMakeChanged = (e) => setMake(e.target.value);
  const onModelChanged = (e) => setModel(e.target.value);
  const onRegistrationChanged = (e) => setRegistration(e.target.value);

  const canSave = [make, model, registration].every(Boolean) && !isLoading;

  const onSaveCarClicked = async (e) => {
    if (canSave) {
      await updateCar({
        id: car.id,
        make,
        model,
        registration,
      });
    }
  };

  const onDeleteCarClicked = async () => {
    await deleteCar({ id: car.id });
  };


  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validMakeClass = !make ? "form__input--incomplete" : "";
  const validModelClass = !model ? "form__input--incomplete" : "";
  const validRegistrationClass = !registration ? "form__input--incomplete" : "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteCarClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Car#{car.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveCarClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label className="form__label" htmlFor="car-make">
          Make:
        </label>
        <input
          className={`form__input ${validMakeClass}`}
          id="car-make"
          name="make"
          type="text"
          autoComplete="off"
          value={make}
          onChange={onMakeChanged}
        />

        <label className="form__label" htmlFor="car-model">
          Model:
        </label>
        <textarea
          className={`form__input form__input--text ${validModelClass}`}
          id="car-model"
          name="model"
          value={model}
          onChange={onModelChanged}
        />
        <label className="form__label" htmlFor="car-registration">
          Registration:
        </label>
        <textarea
          className={`form__input form__input--text ${validRegistrationClass}`}
          id="car-registration"
          name="registration"
          value={registration}
          onChange={onRegistrationChanged}
        />
      </form>
    </>
  );

  return content;
};

export default EditCarForm;
