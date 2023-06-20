//This component will assist us in staying logged in even if we refresh the application//
import { Outlet, Link } from "react-router-dom";
//Importing OutLet, Link from react-router-dom(line 2)//
import { useEffect, useRef, useState } from "react";
//importing useRef, useState, useEffect hooks from react(line 4)
import { useRefreshMutation } from "./authApiSlice";
//importing our  useRefreshMutation hook from our authApiSlice component(line 6)
import usePersist from "../../hooks/usePersist";
//importing the usePersist hook that we created(line 8)//
import { useSelector } from "react-redux";
//importing useSelector from redux(line 10)
import { selectCurrentToken } from "./authSlice";
//importing selectCurrentToken function from our authApiSlice component(line 12)
const PersistLogin = () => {
  const [persist] = usePersist();
  //We are just using persist from the usePersist hook(line 15)
  const token = useSelector(selectCurrentToken);
  /*We are pulling in the token using the useSelector and selectCurrentToken selector from our state,
  which will be the current token that we have recieved which is also known as the accessToken(line 17)*/
  const effectRan = useRef(false);
  /*We are defining effectRan which will help us in hadling react strict mode(line 20) and 
  then we are setting useRef to false and it is the effectRan value(line 20)*/
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [
    refresh,
    {
      isUninitialized,
      //isUninitialized means that the refresh function has'nt been called yet(line 26)//
      isLoading,
      isSuccess,
      isError,
      error,
    },
  ] = useRefreshMutation();

  useEffect(() => {
    //The effectRan.current === true will only be true the second time, because it will only be set to true later(line 36)//
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          //const response =
          await refresh();
          //const { accessToken } = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };
      /*On (line 55), we are saying if there is no token and the persist has been checked, 
      then we will call our verifyRefreshToken() function(line 55)*/
      if (!token && persist) verifyRefreshToken();
    }
    /*Once the useEffect(line 34) has ran the first time, the cleanup function(line 58) sets it to true, 
    So now the useRef will still hold the value even when the components unmounts and re-mounts*/
    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    // persist: no
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    console.log("loading");
    content = <p>Loading...</p>;
  } else if (isError) {
    //persist: yes, token: no
    console.log("error");
    content = (
      <p className="errmsg">
        {error.data?.message}
        <Link to="/login"><br></br>Please login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
