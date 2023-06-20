import { Routes, Route } from "react-router-dom";

//components//
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import CarList from "./features/cars/CarList";
import UserList from "./features/users/UserList";
import NewUserForm from "./features/users/NewUserForm";
import EditUser from "./features/users/EditUser";
import EditCar from "./features/cars/EditCar";
import NewCar from "./features/cars/NewCar";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import Roles from "./config/roles";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/*The Layout route (line 10) only renders the children*/}
        <Route index element={<Public />} />
        {/*The route (line 14) is the default component that is shown*/}
        <Route path="login" element={<Login />} />
        {/*Protected Routes*/}

        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(Roles)]} />}
          >
            {/*Putting our RequireAuth component before the prefetch component, 
          because if the user is unauthorized the data won't be prefetched, 
          inside the RequireAuth component(line 31) passes in the allowedRoles and it's going to be an array,
          now we are creating a new array in which each role will be allowed to access the protected routes,
          ...Object.values(Roles)(line 31) spreads all the roles in the array*/}
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                {/*The route(line 18) will wrap around every other component*/}
                <Route index element={<Welcome />} />
                {/*After we have logged in we have an index for our protected routes(line 20)*/}

                <Route path="cars">
                  <Route index element={<CarList />} />
                  {/*The route on (line 36) will be the index for the cars path(line 35)*/}
                  <Route path=":id" element={<EditCar />} />
                  <Route path="new" element={<NewCar />} />
                </Route>
                <Route element={ <RequireAuth allowedRoles={[Roles.Manager, Roles.Admin]} />}>
                {/*Wrapping the RequireAuth component around the users route(line 51), and saying for the allowedRoles array,
                that the only roles that can access the users routes is the Manger and the Admin*/}
                <Route path="users">
                  <Route index element={<UserList />} />
                  {/*The route on (line 25) will be the index for the users path(line 24)*/}
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />
                  {/*end dash*/}
                </Route>
              </Route>
              </Route>  
            </Route>
          </Route>
        </Route>
        {/*end protected routes*/}
      </Route>
    </Routes>
  );
}

export default App;
