import { useEffect, useState } from "react";

const Tasks = () => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  // Fetch tasks dynamically when filter, sort or search changes
  useEffect(() => {
    const fetchFilteredTasks = async () => {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (sortBy) params.append("sortBy", sortBy);
      if (searchTerm) params.append("search", searchTerm);

      try {
        const res = await fetch(`http://localhost:5000/api/tasks?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch filtered tasks");

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching filtered tasks:", err.message);
      }
    };

    fetchFilteredTasks();
  }, [filterStatus, sortBy, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editingTask) {
        res = await fetch(`http://localhost:5000/api/tasks/${editingTask._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, deadline }),
        });
      } else {
        res = await fetch("http://localhost:5000/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, deadline }),
        });
      }

      if (!res.ok) throw new Error("Failed to save task");

      setTitle("");
      setDeadline("");
      setEditingTask(null);

      // Refetch with current filters after save
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (sortBy) params.append("sortBy", sortBy);
      if (searchTerm) params.append("search", searchTerm);

      const updatedRes = await fetch(`http://localhost:5000/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedRes.json();
      setTasks(updatedData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDeadline(task.deadline?.slice(0, 10) || "");
  };

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
      </form>

      {/* FILTER, SORT, SEARCH UI */}
      <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">Sort By</option>
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
        </select>

        <input
          type="text"
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* RENDER TASKS */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong> | Status: {task.status || "N/A"} | Deadline:{" "}
            {task.deadline ? new Date(task.deadline).toLocaleDateString() : "None"}
            <br />
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task._id)} style={{ marginLeft: "5px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
