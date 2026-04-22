import axios from "axios";

const API = "http://localhost:5000/api/pdm";

export const addPDM = (data) => axios.post(`${API}/add`, data);

export const getPDMs = () => axios.get(API);
