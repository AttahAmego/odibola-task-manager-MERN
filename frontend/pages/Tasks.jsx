import { useEffect, useState } from "react";
import TaskCard from "/GOMYCODE/odibola-task-manager-MERN/frontend/pages/TaskCard";

const Tasks = () => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFilteredTasks = async () => {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (sortBy) params.append("sortBy", sortBy);
      if (searchTerm) params.append("search", searchTerm);

      try {
        const res = await fetch(`${API_URL}/api/tasks?${params.toString()}`, {
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
  }, [filterStatus, sortBy, searchTerm, API_URL, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editingTask) {
        res = await fetch(`${API_URL}/api/tasks/${editingTask._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, deadline }),
        });
      } else {
        res = await fetch(`${API_URL}/api/tasks`, {
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
      fetchTasks(); // refetch
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchTasks = async () => {
    const params = new URLSearchParams();
    if (filterStatus) params.append("status", filterStatus);
    if (sortBy) params.append("sortBy", sortBy);
    if (searchTerm) params.append("search", searchTerm);

    const res = await fetch(`${API_URL}/api/tasks?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTasks(data);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDeadline(task.deadline?.slice(0, 10) || "");
  };

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
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
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      <h1 className="text-3xl font-bold text-[#EB3844] mb-4">Manage Tasks</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-[#002B5B] text-white px-4 py-2 rounded">
          {editingTask ? "Update" : "Add"}
        </button>
      </form>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      {/* TASK CARDS */}
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p className="text-gray-600">No tasks found.</p>
      )}
    </div>
  );
};

export default Tasks;
