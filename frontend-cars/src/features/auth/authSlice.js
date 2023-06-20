//importing createSlice from redux toolkit(line 2)//
import { createSlice } from "@reduxjs/toolkit";
//creating the authSlice function and setting it equal to createSlice(line 4)
const authSlice = createSlice({
  /*Inside the object we have the first 2 properties and we are naming the slice auth(line 8) 
and our initialSate will have an object with a token property(line 9)
and it will be set to null, because we are expecting get that token from the api(line 9*/
  name: "auth",
  initialState: { token: null },
  //We have reducers that are also an object(line 11)//
  reducers: {
    /*The first of 2 reducers is setCredentials(line 13), When we recieve data back from our api, 
    we'll have a payload which will contain the accessToken(line 15)*/
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      /*we are setting the state.token to the accessToken(line 18), the reason why we are not saying state.auth.token, 
      is because we are already inside the authSlice with the name auth(line 8)*/
      state.token = accessToken;
    },
    //We also have a logout reducer(line 21) that is going to set the state.token to null, when a user logs out//
    logOut: (state, action) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
//exporting both the setCredentials and logout which are both the action creators of the authSlice.actions(line 27)
export default authSlice.reducer;
//We are exporting all reducers with authSlice.reducer, because it needs to be added to the store component(line 29)/
export const selectCurrentToken = (state) => state.auth.token;
/*We are creating one selector, which selects the current token(line 31) and it does refer to  state.auth.token, 
auth is the name of the slice that was created on(line 8)*/
