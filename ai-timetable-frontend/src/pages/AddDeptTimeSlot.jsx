import { useEffect, useState } from "react";
import { addDeptSlot, getDeptSlots } from "../services/deptTimeSlotService";
import { getDepartments } from "../services/departmentService";

function AddDeptTimeSlot() {
  const [departments, setDepartments] = useState([]);
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({
    dept_id: "",
    slot_label: "",
    start_time: "",
    end_time: ""
  });

  useEffect(() => {
    loadDepartments();
    loadSlots();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSlots = async () => {
    try {
      const res = await getDeptSlots();
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveSlot = async () => {
    if (!form.dept_id || !form.slot_label || !form.start_time || !form.end_time) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await addDeptSlot(form);

      setForm({
        dept_id: "",
        slot_label: "",
        start_time: "",
        end_time: ""
      });

      loadSlots();
      alert("Slot added successfully");

    } catch (err) {
      alert("Error saving slot");
      console.error(err);
    }
  };

  return (
    <>
      {/* ===== FORM CARD ===== */}
      <h2 className="page-title">Department Time Slots</h2>
      <p className="page-desc">
        Define time periods (no need to add day here)
      </p>

      <div className="form-card">
        <div className="form-grid">

          {/* Department */}
          <div className="form-group">
            <label>Department</label>
            <select
              name="dept_id"
              value={form.dept_id}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.dept_name}
                </option>
              ))}
            </select>
          </div>

          {/* Slot Label */}
          <div className="form-group">
            <label>Slot Label</label>
            <input
              name="slot_label"
              value={form.slot_label}
              onChange={handleChange}
              placeholder="e.g. Period 1"
            />
          </div>

          {/* Start Time */}
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
            />
          </div>

          {/* End Time */}
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <div className="form-actions">
            <button className="primary-btn" onClick={saveSlot}>
              Save Slot
            </button>
          </div>

        </div>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="table-card">
        <h3 className="table-title">Existing Time Slots</h3>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Department</th>
              <th>Slot</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.dept_id?.dept_name}</td>
                <td>{s.slot_label}</td>
                <td>{s.start_time} – {s.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AddDeptTimeSlot;
