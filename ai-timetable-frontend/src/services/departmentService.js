import axios from "axios";

const BASE = "http://localhost:5000/api/departments";

export const addDepartment = (data) => axios.post(`${BASE}/add`, data);
export const getDepartments = () => axios.get(BASE);
