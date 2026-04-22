import axios from "axios";

const BASE = "http://localhost:5000/api/dept-slots";

export const addDeptSlot = (data) => axios.post(`${BASE}/add`, data);
export const getDeptSlots = () => axios.get(BASE);
