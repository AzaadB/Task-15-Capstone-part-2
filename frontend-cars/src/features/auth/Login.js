import { useRef, useState, useEffect } from "react";
//importing useRef, useState, useEffect hooks from react(line 1)
import { useNavigate, Link } from "react-router-dom";
//importing useNavigate, Link from react-router-dom(line 3)
import { useDispatch } from "react-redux";
//importing useDispatch from redux(line 5)
import { setCredentials } from "./authSlice";
//importing the setCredentials function from the authSlice(line 7)
import { useLoginMutation } from "./authApiSlice";
//importing the useLoginMutation from the authApiSlice file(line 9)
import usePersist from "../../hooks/usePersist";
//importing the usePersist hook that we created(line 11)//
const Login = () => {
  //creating a login function(line 13)//
  const userRef = useRef();
  //creating a userRef, that we will set to focus on the user input(line 15)
  const errRef = useRef();
  //creating an errRef, that we will set to focus if there is an error(line 17)
  const [username, setUsername] = useState("");
  //We have state for the username(line 18)//
  const [password, setPassword] = useState("");
  //We have state for the password(line 20)
  const [errMsg, setErrMsg] = useState("");
  //We have state for a possible error message(line 22)
  const [persist, setPersist] = usePersist("");
  //using persist(line 25)//
  const navigate = useNavigate();
  //We are using the useNavigate hook to bringin the navigate function(line 24)//
  const dispatch = useDispatch();
  //We are using the useDispatch hook to bringin the dispatch function(line 26)
  const [login, { isLoading }] = useLoginMutation();
  /*We are using our useLoginMutation hook and then we bringin a login function that can be used when we need it, and 
  it also has an isLoading state that we'll use(line 28)*/
  useEffect(() => {
    userRef.current.focus();
  }, []);
  /*The useEffect on(line 31) handles the userRef, and userRef.current.focus is an empty dependancy array 
  and useEffect, so it only happens when the component loads, it puts it's focus on the username field*/
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);
  /*The useEffect on(line 36) is for clearing the error message state when the username or password changes or is re-typed in*/
  const handleSubmit = async (e) => {
    /*The submit handler for the form is an async function with a event(line 40) and 
    we have e.preventDefault()(line 44), which we need when you submit a form because if we don't have it,
    then it will reload the page and we don't want that to happen*/
    e.preventDefault();
    //We have a trycatch block(lines 46-52)//
    try {
      /*Inside the try we are getting back oyur access token after we call the login mutation function,
       we await the results, we pass in the username and password state, when the username or password are complete,
       then we call unwrap at the end because we want to use it in a trycatch block instaead of using rtk query states,
       such as isError(line 51)*/
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      //Dispatching setCredentials and we are recieving an accessToken back(line 52)//
      setUsername("");
      //We have setUsername and it's set to blank because we want to empty out the state(line 54)//
      setPassword("");
      //We have setPassword and it's set to blank because we want to empty out the state(line 56)//
      navigate("/dash");
      //We have a navigate function, which will take us to the dash after we have logged in(line 57)//
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
        //if we don't have an error.status(line 61), then we set the error message to say that there was No Server Response(line 62)//
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
        //If the error status is 400(line 64), then either the username or password is missing(line 65)//
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
        /*If the error status is 401(line 67), 
        then we set the error message to say unauthorized(line 68) or it will be recieving err.data?.message 
        as a precaution we are using optional chaining(line 70)*/
      }
      errRef.current.focus();
      /*setting our errRef to errRef.current.focus which will be read by errRef class(line 95) 
      because we have aria-live set to "assertive"*/
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  //Have a username handler(line 84)//
  const handlePwdInput = (e) => setPassword(e.target.value);
  //Have a password handler(line 86)//
  const handleToggle = (e) => setPersist((prev) => !prev);
  /*handling the toggle of the persist(line 88) 
  and what we using is setPersist and taking the previous value and set it to the what is the opposite(line 88), 
  because it will just initallly just be a check box*/
  const errClass = errMsg ? "errmsg" : "offscreen";
  /*defining an error class and if there is an error message in our state, 
  then we'll apply the error class which is a ternary statement, otherwise the offscreen class will be applied*/
  if (isLoading) return <p>Loading...</p>;
  //Defining the content of the form//
  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Sign In</button>
          {/*Putting the check box under the signIn button (lines 131-140)*/}
          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};
export default Login;
