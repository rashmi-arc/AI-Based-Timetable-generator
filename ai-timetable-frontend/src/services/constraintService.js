import axios from "axios";

export const getConstraintMaster = () =>
  axios.get("http://localhost:5000/api/constraint-master");

export const saveConstraints = (data) =>
  axios.post("http://localhost:5000/api/constraints/add", data);

export const getConstraints = () =>
  axios.get("http://localhost:5000/api/constraints");
