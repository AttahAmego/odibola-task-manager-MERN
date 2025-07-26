import { useEffect, useState } from "react";
const [editingTask, setEditingTask] = useState(null);

const Tasks = () => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

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
    fetchTasks(); // refresh task list
  } catch (err) {
    console.error(err.message);
  }
};

const handleEdit = (task) => {
  setEditingTask(task);
  setTitle(task.title);
  setDeadline(task.deadline?.slice(0, 10) || ""); // Format to yyyy-mm-dd
};

//   const handleEdit = (task) => {
//     setTitle(task.title);
//     setDeadline(task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "");
//     setEditingTaskId(task._id);
//   };

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

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong><br />
            Status: {task.status}<br />
            Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}<br />

            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
