import { useState, useEffect } from "react";
//importing useState and useEffect hooks(line 1)
import { useAddNewUserMutation } from "./usersApiSlice";
//useAddNewUserMutation that was created in the usersApiSlice file//
import { useNavigate } from "react-router-dom";
//importing useNavigate from react-router-dom(line 5)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//importing FontAwesomeIcon(line 7), because we are using a faSave icon on(line 9) from it//
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Roles from "../../config/roles";
//importing the roles component that was creted(line 10) into the newUserForm, which will be used//

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
/*These regex constants(lines 13-14), that have been created and these are the things that only Pete or his manager,
will use to create new staff members who can create new users*/
const NewUserForm = () => {
  //the addnewUser(line 19) gives us a function, which when needed we can call it in the component//
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();
  //This object, which has isLoding, isSuccess, isError and error delivers the status when we call the addNewUser function//
  const navigate = useNavigate();
  //using the useNavigate hook(line 22)//

  //We have some individuale pieces of state(lines 26-30) such as username, password, validUsername, validUsername and roles//
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  //ValidUsername will only be true if it co-incides with the regex standards//
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  //ValidPassword will only be true if it co-incides with the regex standards//
  const [roles, setRoles] = useState(["Employee"]);
  /*The set value for the roles and setRoles is Employee by default, 
  and it is also an array due to that a user could assigned multiple roles*/
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);
  //We are testing the regex's for the username and password as they are changed(lines 36 and 40)//
  useEffect(() => {
    /*In the if statement(line 45), we are sying if it is successful, then we empty out all our individual state 
    and we are going to navigate to the /dash/users endpoint, which takes us to our user's list*/
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);
  //event handlers(lines 54-57)//
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRolesChanged = (e) => {
    //With the values we get we need to create an array(line 59)
    const values = Array.from(
      e.target.selectedOptions, //HTMLCollection
      //We also have a function that is set to option.value, which is why we use setRoles to store the values(line 64)
      (option) => option.value
    );
    setRoles(values);
  };
  //Defining a can save(line 67) before we allow the onSaveUserClicked function(line 70) to activate//
  const canSave =
    /*inside the can save(line 67),
    we have an array with roles.length, validUsername, validPassword inside(line 70) and we have the .every(boolean) method to it,
    we also have && !isloading, which says if we are not loading, then can save(line 67) will be true*/
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    //Inside our onSaveUserClicked function(line 73) we check the can save value(line 76)
    e.preventDefault();
    if (canSave) {
      //Inside the if statement(line 76), we call our addNewUser mutation(line 78), and we pass in the username, password and roles//
      await addNewUser({ username, password, roles });
    }
  };
  /*In this options variable(line 83) which, has Object.values(line 83) 
  and we pass in our Roles component that was imported on(line 10) and we get the values which are employee, manager and admin,
  and for each one we are creating an option(line 86) which will be inside the drop-down menue that we should have*/
  const options = Object.values(Roles).map((role) => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    );
  });
  //Defining classes on (lines 93-95), that we may or may not use for some elements within the form//
  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass = !validPassword ? "form__input--incomplete" : "";

  const content = (
    //Each part of the form is held inside the content variable on (line 97)
    //Using a fragment(line 100) as the the parent for the jsx//
    <>
      <p className={errClass}>{error?.data?.message}</p>
      {/*With in the paragraph element (line 101) we have the error class which will be either off-screen,
        if there is no error, but if there is an error it will display*/}
      <form className="form" onSubmit={onSaveUserClicked}>
        {/*On the form property(line 104) we have an onSubmit and we call our onSaveUserClicked function*/}
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              {/*If the requirements for saving a new user is false, then the button on(line 109), will be disabled*/}
              <FontAwesomeIcon icon={faSave} />
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
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />
        {/*Inside the input(line 118) we call the validUserClass, so if there is an issue with the username or it's blank,
        it will have to be filled in again, Also on (line 123) we set autoComplete to off,
         because we don't want prevous enterd names to pop-up*/}
        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />
        {/*Inside the input(line 133) we call the validPwdClass, so if there is an issue with the pwd or it's blank,
        it will have to be filled in again*/}
        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        {/*Inside the select(line 147) we have multiple set to true(line 150) so that we can assign more than one role so someone*/}
        <select
          id="roles"
          name="roles"
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
  //Defining our content (line 153)//
};
export default NewUserForm;
