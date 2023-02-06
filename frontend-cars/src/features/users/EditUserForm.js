import { useState, useEffect } from "react";
//Importing useState, useEffect hooks from react(line 1)
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
//importing useUpdateUserMutation, useDeleteUserMutation that was created from the usersApiSlice component(line 3)
import { useNavigate } from "react-router-dom";
//importing useNavigate from react-router-dom(line 5)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/*importing FontAwesomeIcon(line 7), because we are using a faSave icon on(line 10)
and the faTrahCan icon which will be used for deleteing(line 10) from it*/
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Roles from "../../config/roles";
//importing the roles component that was creted(line 11) into the newUserForm, which will be used//
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
/*These regex constants(lines 13-14), that have been created and these are the things that only Pete or his manager,
will use to create new staff members who can create new users*/
const EditUserForm = ({ user }) => {
  //destructuring the user in the EditUserForm function(line 17)//
  //the updateUser(line 20) gives us a function, which when needed we can call it in the component//
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();
  //This object, which has isLoding, isSuccess, isError and error delivers the status when we call the updateUser function(line 20)//
  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();
  //the deleteUser(line 24) gives us a function, which when needed we can call it in the component//

  /*This object, which has isSuccess, isDelSuccess, isError: isDelError
  and error: delerror delivers the status when we call the deleteUser function(line 24)*/
  const navigate = useNavigate();
  //using the useNavigate hook(line 31)//
  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  //ValidUsername will only be true if it co-incides with the regex standards(line  13)//
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  //ValidPassword will only be true if it co-incides with the regex standards(line 14)//
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);
  /*The active and setActive state that we have brought in(line 40), will help us remove access of a user,
but make sure that they don't have any cars assigned to them*/
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);
  //We are testing the regex's for the username and password as they are changed(lines 44 and 48)//
  useEffect(() => {
    /*In the if statement(line 55), we are sying if it is successful, then we empty out all our individual state
    and we are going to navigate to the /dash/users endpoint, which takes us to our user's list*/
    console.log(isSuccess);
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
    //In the if statement on (line 55) we're checking i
  }, [isSuccess, isDelSuccess, navigate]);
  /*This useEffect(line 51) is checcking the status of isSuccess of the updateUser function
  and the isDelSuccess for the deleteUser function*/

  //event handlers(lines 66-77)//
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };
  //The on ActiveChange handler(line 78) just sets the previous status active to the opposite//
  const onActiveChanged = () => setActive((prev) => !prev);
  /*In this onSaveUserClicked(line 82), we have to check if there is a password(line 83)
  and reason being is because we do'nt want to be required to update the password every time we edit a user,
  therefore we call the updateUser function in 2 ways one with the password(line 84)and one without the password(line 86)*/
  const onSaveUserClicked = async (e) => {
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };
  //Inside the onDeleteUserClicked(line 90), we call the deleteUser function(line 91)
  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };
  /*In this options variable(line 96) which, has Object.values(line 96)
  and we pass in our Roles component that was imported on(line 10) and we get the values which are employee, manager and admin,
  and for each one we are creating an option(line 98) which will be inside the drop-down menue that we should have*/
  const options = Object.values(Roles).map((role) => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    );
  });
  //This can save(line 105) is also checking to see if there is a password(line 106)//
  let canSave;
  if (password) {
    //If there is a password, then can save will use the validPassword in the array(line 109)//
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }
  //Defining classes on (lines 114-117), that we may or may not use for some elements within the form//
  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass =
    password && !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    //Each part of the form is held inside the content variable on (line 121)
    //Using a fragment(line 124) as the the parent for the jsx//
    <>
      <p className={errClass}>{errContent}</p>
      {/*With in the paragraph element (line 101) we have the error class which will be either off-screen,
        if there is no error, but if there is an error it will display*/}
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        {/*On the form property(line 128) we have an onSubmit and we call our onSaveUserClicked function*/}
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              {/*If the requirements for saving a new user is false, then the button on(line 109), will be disabled*/}
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />
        {/*Inside the input(line 157) we call the validUserClass, so if there is an issue with the username or it's blank,
        it will have to be filled in again, Also on (line 162) we set autoComplete to off,
         because we don't want prevous enterd names to pop-up*/}
        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[empty = no change]</span>{" "}
          <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />
        {/*Inside the input(line 173) we call the validPwdClass, so if there is an issue with the pwd or it's blank,
        it will have to be filled in again*/}
        <label
          className="form__label form__checkbox-container"
          htmlFor="user-active"
        >
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChanged}
          />
        </label>

        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        {/*Inside the select(line 202) we have multiple set to true(line 206) so that we can assign more than one role so someone*/}
        <select
          id="roles"
          name="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};
export default EditUserForm;
