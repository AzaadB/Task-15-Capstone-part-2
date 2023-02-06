import { useState, useEffect } from "react";
//importing useState and useEffect hooks(line 1)
import { useNavigate } from "react-router-dom";
//importing useNavigate from react-router-dom(line 3)
import { useAddNewCarMutation } from "./carsApiSlice";
//useAddNewCarMutation that was created in the carApiSlice file(line 5)//
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//importing FontAwesomeIcon(line 7), because we are using a faSave icon on(line 9) from it//
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewCarForm = () => {
  //the addnewCar(line 13) gives us a function, which when needed we can call it in the component//
  const [addNewCar, { isLoading, isSuccess, isError, error }] =
    useAddNewCarMutation();
  //This object, which has isLoding, isSuccess, isError and error delivers the status when we call the addNewCar function(line 13)//
  const navigate = useNavigate();
  //using the useNavigate hook(line 16)//

  //We have some individuale pieces of state for the Make, Model and Registration(lines 20-22)//
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [registration, setRegistration] = useState("");

  useEffect(() => {
    /*In the if statement(line 27), we are sying if it is successful, then we empty out all our individual state 
    and we are going to navigate to the /dash/cars endpoint, which takes us to our user's list*/
    if (isSuccess) {
      setMake("");
      setModel("");
      setRegistration("");
      navigate("/dash/cars");
    }
  }, [isSuccess, navigate]);
  //event handlers(lines 35-37)//
  const onMakeChanged = (e) => setMake(e.target.value);
  const onModelChanged = (e) => setModel(e.target.value);
  const onRegistrationChanged = (e) => setRegistration(e.target.value);
  //Defining a can save(line 39) before we allow the onSaveUserClicked function(line 70) to activate//
  const canSave = [make, model, registration].every(Boolean) && !isLoading;
  /*inside the can save(line 39),
    we have an array with make, model, registration inside(line 39) and we have the .every(boolean) method to it,
    we also have && !isloading, which says if we are not loading, then can save(line 39) will be true*/
  const onSaveCarClicked = async (e) => {
    //Inside our onSaveCarClicked function(line 43) we check the can save value(line 46)
    e.preventDefault();
    if (canSave) {
      //Inside the if statement(line 46), we call our addNewUser mutation(line 48), and we pass in the make, model and registration//
      await addNewCar({ make, model, registration });
    }
  };
  //Defining classes on (lines 52-55), that we may or may not use for some elements within the form//
  const errClass = isError ? "errmsg" : "offscreen";
  const validMakeClass = !make ? "form__input--incomplete" : "";
  const validModelClass = !model ? "form__input--incomplete" : "";
  const validRegistrationClass = !registration ? "form__input--incomplete" : "";

  const content = (
    //Each part of the form is held inside the content variable on (line 57)
    //Using a fragment(line 60) as the the parent for the jsx//
    <>
      <p className={errClass}>{error?.data?.message}</p>
      {/*With in the paragraph element (line 61) we have the error class which will be either off-screen,
        if there is no error, but if there is an error it will display*/}
      <form className="form" onSubmit={onSaveCarClicked}>
        {/*On the form property(line 64) we have an onSubmit and we call our onSaveUserClicked function*/}
        <div className="form__title-row">
          <h2>New Car</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              {/*If the requirements for saving a new car is false, then the button on(line 69), will be disabled*/}
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="make">
          Make:
        </label>
        <input
          className={`form__input ${validMakeClass}`}
          id="make"
          name="make"
          type="text"
          autoComplete="off"
          value={make}
          onChange={onMakeChanged}
        />
        {/*Inside the input(line 79) we call the validMakeClass, so if there is an issue with the make or it's blank,
        it will have to be filled in again, Also on (line 83) we set autoComplete to off,
         because we don't want prevous enterd names to pop-up*/}

        <label className="form__label" htmlFor="model">
          Model:
        </label>
        <textarea
          className={`form__input form__input--text ${validModelClass}`}
          id="model"
          name="model"
          value={model}
          onChange={onModelChanged}
        />
        <label className="form__label" htmlFor="registration">
          Registration:
        </label>
        <textarea
          className={`form__input form__input--text ${validRegistrationClass}`}
          id="registration"
          name="registration"
          value={registration}
          onChange={onRegistrationChanged}
        />
      </form>
    </>
  );

  return content;
};

export default NewCarForm;
