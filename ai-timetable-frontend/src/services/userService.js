import axios from "axios";

const BASE = "http://localhost:5000/api/users";

export const getUsers = () => axios.get(BASE);
