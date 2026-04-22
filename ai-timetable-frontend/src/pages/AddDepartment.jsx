import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/departments";

export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch departments on load
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load departments");
    }
  };

  const saveDepartment = async () => {
    if (!deptName.trim()) {
      alert("Enter department name");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/add`, {
        dept_name: deptName,
      });

      setDeptName("");
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      {/* HEADER */}
      <h2 className="page-title">Department Management</h2>
      <p className="page-desc">Create and manage academic departments</p>

      {/* FORM */}
      <div className="form-card">
        <div className="form-group">
          <label>Department Name</label>
          <input
            type="text"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            placeholder="e.g. Computer Science"
          />
        </div>

        <div className="form-actions">
          <button
            className="primary-btn"
            onClick={saveDepartment}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Department"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <h3 className="table-title">Existing Departments</h3>

        {departments.length === 0 ? (
          <p>No departments found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Department Name</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d, i) => (
                <tr key={d._id}>
                  <td>{i + 1}</td>
                  <td>
                    {d.dept_name.charAt(0).toUpperCase() +
                      d.dept_name.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
