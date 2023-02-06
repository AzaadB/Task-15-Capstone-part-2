import { useState, useEffect } from "react";
//importing useState and useEffect hooks(line 1)
const usePersist = () => {
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );
  /*We are setting persist and setPersist with useState(line 4) and we are looking at our localStorage and 
    if persist does'nt exist within it, then we set it to false(lines 5)*/
  useEffect(() => {
    /*We are using the useEffect hook(line 9) and what this does is,
    that when persist changes we set the value to localStorage(line 11)*/
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
  //Returning persist and setPersist(line 15)
};
export default usePersist;
