import React from "react";
import renderer from "react-test-renderer";
import carsApiSlice from "./carsApiSlice";

it("carsApiSlice compnent renders correctly", () => {
  const tree = renderer.create(<carsApiSlice />).toJSON();
  expect(tree).toMatchSnapshot();
});
