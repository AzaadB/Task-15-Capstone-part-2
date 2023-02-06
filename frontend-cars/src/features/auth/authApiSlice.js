import apiSlice from "../../app/api/apiSlice";
//importing our apiSlice so that it could be extended(line 1)
import { logOut, setCredentials } from "./authSlice";
//importing our logout and setCredetials reducer from the authSlice component(line 3)
export const authApiSlice = apiSlice.injectEndpoints({
  /*creating the authApiSlice which is set to our apiSlice that we imported and 
  then we use the apiSice to inject the endpoints into the original api slice, and then we have an object inside it (line 5)*/
  endpoints: (builder) => ({
    //Then the endpoints are defined on (line 8)//
    //Inside this builder object we have our login endpoint(line 11)
    login: builder.mutation({
      /*For this login property we call the builder.mutation(line 11), 
      and inside the mutation we define the query property and we pass in what we call credentials(line 15) 
      and it would be the username and password that we send with the query*/
      query: (credentials) => ({
        /*Then it is sent to the /auth route(line 18), the method is a POST(line 19) and 
        then in the body object we are spreadding the object that we recieve as credentials into it(line 20)*/
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    //Inside this builder object(line 8) we have our sendLogout endpoint(line 24)
    sendLogout: builder.mutation({
      /*For this sendLogout property we call the builder.mutation(line 24), 
      and inside the mutation we define the query property*/
      query: () => ({
        //Then it is sent to the /auth/logout route(line 30), the method is a POST(line 31)//
        url: "/auth/logout",
        method: "POST",
      }),
      //So RTK Query has a function called onQueryStarted that we are calling(line 33) inside of our sendLogout endpoint(line 24)//
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        /*Now what the onQueryStarted function(line 33) does is that first it's async, it accepts an argument(line 33), 
        but we won't be defining it, it just needs to be the first parameter, but it's also providing things such as 
        dispatch and queryFulfilled(line 33)so that we can verify that our query has been fulfilled*/
        try {
          //Inside the onQueryStarted we have a trycatch block(lines 37-45)
          const data = await queryFulfilled;
          console.log(data);
          //Now because we have put an async infront of the onQueryStarted it must await the query to be fulfilled(line 39)//
          dispatch(logOut());
          /*Dispatching our logout reducer(line 41) that was imported from our authSlice,
          and it sets our token to null in our local state*/
          setTimeout(() => {
            /*Inside the setTimeout function(line 45) we have dispatch(apiSlice.util.resetApiState()) (line 48),
            and it is set to 1sec, once we have logged out, then it immediately unmounts carsList or usersList component*/
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
          /*Then the apiSlice(line 43), which is separate from the auth slice and the apiSlice also needs to be cleared,
          so we call apiSlice(line 43) that we imported on (line 1), and then we say util.resetApiState, 
          which is a method we can call which will clear out the cache and the query subscriptions and everything that is within
          our apiSlice, now because everything is being done inside the onQueryStarted(line 33), we don't need to import use dispatch
          inside this component*/
        } catch (err) {
          console.log(err);
        }
      },
    }),
    //Adding the refresh endpoint(line 55), which is also a mutation//
    refresh: builder.mutation({
      //Defining the query(line 57), which goes to the /auth/refresh url(line 58) and the method is a GET(line 59)//
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      //So RTK Query has a function called onQueryStarted that we are calling(line 68) inside of our refresh endpoint(line 61)//
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          //Inside the onQueryStarted we have a trycatch block(lines 69-75)
          const { data } = await queryFulfilled;
          //Now because we have put an async infront of the onQueryStarted it must await the query to be fulfilled(line 71)//
          console.log(data);
          //logging all the data we are getting to the console(line 73)//
          const { accessToken } = data;
          //Destructuring the accessToken (line 74)
          dispatch(setCredentials({ accessToken }));
          //Taking dispach and calling the action creator setCredentials and pass in the accessToken(line 77)
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});
//exporting all our functions//
export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
