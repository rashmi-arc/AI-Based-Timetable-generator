import axios from "axios";

const BASE = "http://localhost:5000/api/constraint-master";

export const getConstraintMasters = () => axios.get(BASE);
