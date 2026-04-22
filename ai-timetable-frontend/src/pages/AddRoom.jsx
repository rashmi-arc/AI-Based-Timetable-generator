import { useEffect, useState } from "react";
import { addRoom, getRooms } from "../services/roomService";

function AddRoom() {
  const [form, setForm] = useState({
    room_name: "",
    capacity: "",
    category: "",
    block: "",
    description: ""
  });

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await getRooms();
    setRooms(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveRoom = async () => {
    if (!form.room_name || !form.capacity || !form.category || !form.block) {
      alert("Please fill all required fields");
      return;
    }

    await addRoom(form);

    setForm({
      room_name: "",
      capacity: "",
      category: "",
      block: "",
      description: ""
    });

    loadRooms();
  };

  return (
    <>
      {/* ===== FORM CARD ===== */}
      
        <h2 className="page-title">Room Management</h2>
        <p className="page-desc">Create and manage classrooms and labs</p>
<div className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label>Room Name</label>
            <input
              name="room_name"
              value={form.room_name}
              onChange={handleChange}
              placeholder="e.g. 1.1"
            />
          </div>

          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 45"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="CLASSROOM">Classroom</option>
              <option value="LAB">Lab</option>
              <option value="SEMINAR">Seminar Hall</option>
            </select>
          </div>

          <div className="form-group">
            <label>Block</label>
            <input
              name="block"
              value={form.block}
              onChange={handleChange}
              placeholder="e.g. A Block"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={saveRoom}>
              Save Room
            </button>
          </div>
        </div>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="table-card">
        <h3 className="table-title">Existing Rooms</h3>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Room</th>
              <th>Category</th>
              <th>Capacity</th>
              <th>Block</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>
                <td>{r.room_name}</td>
                <td>{r.category}</td>
                <td>{r.capacity}</td>
                <td>{r.block}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AddRoom;
