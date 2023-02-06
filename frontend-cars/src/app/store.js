import { configureStore } from "@reduxjs/toolkit";
//importing confirgureStore from @reduxjs/toolkit library(line 1)
import apiSlice from "./api/apiSlice";
//importing our apiSlice component(line 3)
import { setupListeners } from "@reduxjs/toolkit/dist/query";
/*importing setupListeners from @reduxjs/toolkit/dist/query(line 5), 
which will help us in refetch the data during an interval or if our users and cars list was opened for a while*/
import authReducer from "../features/auth/authSlice";
//imorting our authSlice(line 8)//
export const store = configureStore({
  //using configureStore to create a store(line 4)
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    //We are dynamically reffering to our apiSlice with the reducerPath(line 8) and then we have apiSlice.reducer(line 8)//
    auth: authReducer,
    //putting in auth and calling our authReducer(line 15)
  },
  //Now we have middleware that must be added to the default middleware(line 13)//
  middleware: (getDefaultMiddleware) =>
    //On (line 14) we have the getDefaultMiddleware() function in which we add with concat our apiSlice.middleware(line 14)//
    getDefaultMiddleware().concat(apiSlice.middleware),
  //We are also providing middleware inside the reducer object(line 11)
  devTools: false,
  //For deployment purposes we will set devTools(line 23) to false which disables redux devTools
});
setupListeners(store.dispatch);
//Once we call setupLisneners(line 22), we pass in the store.dispach//
