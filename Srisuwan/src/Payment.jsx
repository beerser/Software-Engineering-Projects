import React from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const selectedItem = location.state?.item;

  return <></>

};

export default Payment;
