import axios from "axios";

const BASE = "http://localhost:5000/api/course-teacher";

export const addMapping = (data) => axios.post(`${BASE}/add`, data);
export const getMappings = () => axios.get(BASE);
