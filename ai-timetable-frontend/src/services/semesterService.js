import axios from "axios";

const API = "http://localhost:5000/api/semesters";

export const addSemester = (data) => axios.post(`${API}/add`, data);
export const getSemesters = () => axios.get(API);
