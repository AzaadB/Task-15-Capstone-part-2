import { store } from "../../app/store";
//importing our redux store(line 1)//
import carsApiSlice from "../cars/carsApiSlice";
//importing the carsApiSlice component(line 3)//
import usersApiSlice from "../users/usersApiSlice";
//importing the usersApiSlice component(line 5)//
import { useEffect } from "react";
//Importing the useEffect hook from react//
import { Outlet } from "react-router-dom";
/*This Prefetch(line 11) with the useEffect funtion inside it(line 12), 
will only run wants it has been mounted and then we log "subscribing" to the console*/
const Prefetch = () => {
  useEffect(() => {
    store.dispatch(carsApiSlice.util.prefetch('getCars', 'carList', { force: true }))
    store.dispatch(usersApiSlice.util.prefetch('getUsers', 'userList', { force: true }))
    /*To use a built-in pre-fetch, we prefetch the hooks that we are using, 
    so we have brought in the carsApiSlice and usersApiSlice (lines 14-15) dot util dot prefetch and 
    then we have the getCars and getUsers endpoints then we pass in arguments named car and user list which will be subscribed and
    what the subscribtion does is that it tells redux that we are using the data and while the component is mounted it is subscribed,
    once the component has unmounted, then that data is held for 5 seconds, we are passing in force: true meaning 
    when it comes to a prefetch dosem'nt matter whether if it still have previous data it will be queryed*/
}, [])

  return <Outlet />;
};
export default Prefetch;