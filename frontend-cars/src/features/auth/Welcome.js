import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
//importing the useAuth hook we created(line 7)
const Welcome = () => {
  const { username, isManager, isAdmin } = useAuth();
  //destructuring username, isManager and isAdmin from the useAuth hook(line 6)
  const date = new Date();
  //creating a new date(line 6)//
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);
  /*We are formating it by creating a today variable and using the new international date dot time format and setting a location,
    ie. en-US which is where Pete's Car Emporium is located,and then we are putting in the object with the formatting, that the date time format requires,
    so it says thet the dateStyle is full and the timeStyle is long and we are formatting the date (line 8)*/

  const content = (
    <section className="welcome">
      <p>{today}</p>

      <h1>Welcome {username}!</h1>

      <p><Link to="/dash/cars">View Cars</Link></p>
      
      <p><Link to="/dash/cars/new">Add New Car</Link></p>

      {/*Putting conditional logic around the view users link, which will only allow admins and managers to view the users(line 29)*/}
      {(isManager || isAdmin) && <p><Link to="/dash/users">View Users</Link></p>}
      
      {/*Putting conditional logic around the Add New User link, which will only allow admins and managers to add new user(line 32)*/}
      {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
    </section>
  );

  return content;
};
export default Welcome;
