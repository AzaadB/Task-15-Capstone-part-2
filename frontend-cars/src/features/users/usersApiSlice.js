import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";
//importing our apiSlice component(line 2)

const usersAdapter = createEntityAdapter({});
//creating a usersAdapter which uses createEntityApdapter(line 4), which we have imported from @reduxjs/toolkit(line 1)//
//By using an entity Adapter it allows us to generate a set of reusable reducers and selectors to manage normalized data in the store/
const initialState = usersAdapter.getInitialState();
//So if the initialState exists(line 7) in the user's adapter(line 7) and then we call the getInitialState(line 7)//

const usersApiSlice = apiSlice.injectEndpoints({
  //We are using our apiSlice(line 10), that we have imported(line 2) and it only has one endpoint currently//
  //When we define our usersApiSlice(line 10), then we use the apiSice to inject the endpoints into the original api slice(line 10)//
  endpoints: (builder) => ({
    //Then the endpoints are defined on (line 13)//
    //To start there will only be one therefore we pass in the builder(line 13) and it's our get users query(line 16)//
    getUsers: builder.query({
      //Inside the  getUsers: builder.query function(line 16) we set the query to the users endpoint(line 18//
      query: () => ({
        url: "/users",
      //We are validating the status(line 20)//
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //making the validate status a part of the query object(line 22)//
      }),
      //The  transformResponse(line 26) is IMPORTANT! due to us working with mongoDB and getting data from the backend//
      transformResponse: (responseData) => {
        //Inside the function(line 26), we are defining loadedUsers(line 28) that can bw called by the transformResponse(line 26)//
        const loadedUsers = responseData.map((user) => {
          /*On (line 28) we are mapping over the data and setting the user id(line 31) property to the value of the user._id(line 31),
        and the reason we do this is because it is looking for an id*/
          user.id = user._id;
          return user;
          //returning the user(line 32)
        });
        return usersAdapter.setAll(initialState, loadedUsers);
        /*We are using the usersAdapter(line 35) and we are providing the loadedUsers,
        which is the response data that has a new value at the id property(line 31)*/
      },
      //The last part (line 40) just provide tags that could be invalidated
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          /*We are just checking if there are any id properties with optional chaining(lines 41-46), 
        but if there aren't any, then we just renturn the user and the id list(line 48)*/
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    addNewUser: builder.mutation({
      /*Inside the addNewUser: builder.mutation(line 52), we are passing in some initial user data(line 55), 
      and we are also using the users endpoint(line 56), and the method we are using is the POST(line 57) to add a new user,
      and in the body(line 59) we are passing the initial data*/
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
      /*Now the invalidatesTags(line 63), will now force the cache that we is being used with rtk query and redux to update,
      So what it is basically saying is that the user list is invalidated and needs updating*/
    }),
    updateUser: builder.mutation({
      /*Inside the updateUser: builder.mutation(line 67), we are passing in some initial user data(line 71), 
      and we are also using the users endpoint(line 72), and the method we are using is the PATCH(line 73) to update a user,
      and in the body(line 74) we are passing the initial data*/
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
      /*Unlike the invalidateTags in the addNewUser function, 
      we are able to specify in the updateUser function the user id that is passed in(line 78),
      and we get that with the arg param(line 78), so it invalidates the on user id and knows that it needs to be updated*/
    }),
    deleteUser: builder.mutation({
      /*Inside the deleteUser: builder.mutation(line 83), we are passing in the id(line 87), 
      and we are also using the users endpoint(line 88), and the method we are using is the DELETE(line 89) to delete a user,
      and in the body(line 90) we are passing the id*/
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
      /*Unlike the invalidateTags in the addNewUser function, 
      we are able to specify in the deleteUser function the user id that is passed in(line 92),
      and we get that with the arg param(line 92), so it invalidates the on user id and knows that it needs to be deleted*/
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
/*RTK query generates hooks for us therefore,
we can say useGetUsersQuery, useAddNewUserMutation, useUpdateUserMutation, useDeleteUserMutation*/

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);

export default usersApiSlice;
