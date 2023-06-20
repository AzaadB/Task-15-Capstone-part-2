//Basically fetchBaseQuery(line 2) is like using axios where you fetching an api except in this instance we are creating our own api with createApi//
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//importing {createApi, fetchBaseQuery} from the @reduxjs/toolkit/query/react library(line 1)
import { setCredentials } from "../../features/auth/authSlice";
//importing our setCredentials reducer from the authSlice component(line 4)
const baseQuery = fetchBaseQuery({
  //defining baseQuery(line 6), we are also seeting our baseQuery equal to fetchBasQuery//
  baseUrl: "https://zany-car-notes-api.onrender.com",
  credentials: "include",
  /*We are adding credentials and include(line 9), which has our cookie and that cookie has our refresh token that 
  we will send whenever we need it*/
  prepareHeaders: (headers, { getState }) => {
    /*We need to prepare the Headers(line 12), which is specifically available to fetchBaseQuery(line 6),
    the first thing that we pass in to the prepareHeaders fuction is the headers(line 12), 
    it also has an api object which is specific to prepareHeaders and we are destructuring getState from it(line 12)
    and it allows us to get the current state of the application*/
    const token = getState().auth.token;
    /*calling getState(line 17) and then we looking at the auth state and then we are getting the current token that we have
    and then we are assigning the token(line 17)*/
    if (token) {
      /*So if we have a token(line 20), then we are setting the auth headers and we set authorization as a first param
      and then we pass the specific format which starts with Bearer and then the token(line 23)*/
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
    //returning the headers(line 25) from the prepareHeaders function on (line 12)//
  },
});
/*creating a query wrapper called baseQueryWithReauth(line 30) and it accepts args, 
which are the arguments we are passing into our fetch-base query(line 6), it has it's own api*/
const baseQueryWithReauth = async (args, api, extraOptions) => {
//   // console.log(args) // request url, method, body
//   // console.log(api) // signal, dispatch, getState()
//   // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);

  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired. ";
      }
      return refreshResult;
    }
  }

  return result;
};

const apiSlice = createApi({
  /*Inside the createApi function we have baseQuery(line 55), due to it having the same as the varible on(line 6),
  it will match so we don't have to use fetchBaseQuery twice*/
  baseQuery: baseQueryWithReauth,
  //When we deploy this app we provide tagTypes(line 10), which will be used for cached data//
  tagTypes: ["Car", "User"],
  endpoints: (builder) => ({}),
});

export default apiSlice;

