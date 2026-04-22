import axios from "axios";

const BASE = "http://localhost:5000/api/rooms";

export const addRoom = (data) => axios.post(`${BASE}/add`, data);
export const getRooms = () => axios.get(BASE);
