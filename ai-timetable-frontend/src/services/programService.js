import axios from "axios";

const BASE = "http://localhost:5000/api/programs";

export const addProgram = (data) => axios.post(`${BASE}/add`, data);
export const getPrograms = () => axios.get(BASE);
