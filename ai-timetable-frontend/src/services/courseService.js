import axios from "axios";

const API = "http://localhost:5000/api/courses";

// ✅ add course
export const addCourse = (data) =>
  axios.post(`${API}/add`, data);

// ✅ get all courses
export const getCourses = () =>
  axios.get(API);

// ✅ optional (if you need later)
export const deleteCourse = (id) =>
  axios.delete(`${API}/${id}`);
