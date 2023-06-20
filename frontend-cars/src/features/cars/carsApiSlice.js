import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import apiSlice from "../../app/api/apiSlice";
//importing our apiSlice component(line 2)
const carsAdapter = createEntityAdapter({
  //Inside the createEntityAdapter we are creating a sortComparer function(line 6)//
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : 1,
});

const initialState = carsAdapter.getInitialState();
//So if the initialState exists(line 7) in the cars adapter(line 7) and then we call the getInitialState(line 7)//

const carsApiSlice = apiSlice.injectEndpoints({
  //We are using our apiSlice(line 10), that we have imported(line 2) and it only has one endpoint currently//
  //When we define our carsApiSlice(line 10), then we use the apiSice to inject the endpoints into the original api slice(line 10)//
  endpoints: (builder) => ({
    //Then the endpoints are defined on (line 13)//
    //To start there will only be one therefore we pass in the builder(line 13) and it's our get cars query(line 16)//
    getCars: builder.query({
      //Inside the  getCars: builder.query function(line 16) we set the query to the users endpoint(line 18//
      query: () => ({
        url: "/cars",
      //We are validating the status(line 20)//
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //making the validate status a part of the query object(line 24)//
      }),
      //The  transformResponse(line 27) is IMPORTANT! due to us working with mongoDB and getting data from the backend//
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        //Inside the function(line 27), we are defining loadedUsers(line 30) that can bw called by the transformResponse(line 27)//
        const loadedCars = responseData.map((car) => {
          /*On (line 30) we are mapping over the data and setting the car id(line 33) property to the value of the car._id(line 33),
        and the reason we do this is because it is looking for an id*/
          car.id = car._id;
          return car;
          //returning the car(line 34)
        });
        return carsAdapter.setAll(initialState, loadedCars);
        /*We are using the carsAdapter(line 37) and we are providing the loadedCars,
        which is the response data that has a new value at the id property(line 33)*/
      },
      //The last part (line 42) just provide tags that could be invalidated
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Car", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Car", id })),
          ];
        } else return [{ type: "Car", id: "LIST" }];
      },
    }),
    addNewCar: builder.mutation({
      /*Inside the addNewCar: builder.mutation(line 54), we are passing in some initial car data(line 58), 
      and we are also using the cars endpoint(line 59), and the method we are using is the POST(line 60) to add a new car,
      and in the body(line 61) we are passing the initial car*/
      query: (initialCar) => ({
        url: "/cars",
        method: "POST",
        body: {
          ...initialCar,
        },
      }),
      invalidatesTags: [{ type: "Car", id: "LIST" }],
      /*Now the invalidatesTags(line 63), will now force the cache that we is being used with rtk query and redux to update,
      So what it is basically saying is that the user list is invalidated and needs updating*/
    }),
    updateCar: builder.mutation({
      /*Inside the updateUser: builder.mutation(line 69), we are passing in some initial user data(line 73), 
      and we are also using the cars endpoint(line 74), and the method we are using is the PATCH(line 73) to update a user,
      and in the body(line 74) we are passing the initial data*/
      query: (initialCar) => ({
        url: "/cars",
        method: "PATCH",
        body: {
          ...initialCar,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Car", id: arg.id }],
      /*Unlike the invalidateTags in the addNewCar function, 
      we are able to specify in the updateUser function the car id that is passed in(line 80),
      and we get that with the arg param(line 80), so it invalidates the on user id and knows that it needs to be updated*/
    }),
    deleteCar: builder.mutation({
      /*Inside the deleteUser: builder.mutation(line 85), we are passing in the id(line 89), 
      and we are also using the cars endpoint(line 90), and the method we are using is the DELETE(line 91) to delete a user,
      and in the body(line 92) we are passing the id*/
      query: ({ id }) => ({
        url: `/cars`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Car", id: arg.id }],
      /*Unlike the invalidateTags in the addNewCar function, 
      we are able to specify in the deleteCar function the Car id that is passed in(line 94),
      and we get that with the arg param(line 94), so it invalidates the car id and knows that it needs to be deleted*/
    }),
  }),
});

export const {
  useGetCarsQuery,
  useAddNewCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carsApiSlice;
/*RTK query generates hooks for us therefore,
we can say useGetCarsQuery,useAddNewCarMutation, useUpdateCarMutation, useDeleteCarMutation,*/

// returns the query result object
export const selectCarsResult = carsApiSlice.endpoints.getCars.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectCarsResult,
  (carsResult) => carsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCars,
  selectById: selectCarById,
  selectIds: selectCarIds,
  // Pass in a selector that returns the cars slice of state
} = carsAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);

export default carsApiSlice;
