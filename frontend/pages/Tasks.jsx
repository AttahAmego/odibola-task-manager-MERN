import { useEffect, useState } from "react";

const Tasks = () => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, deadline }),
      });

      if (!res.ok) throw new Error("Failed to create task");

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
      setDeadline("");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");

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

    fetchTasks();
  }, []);

  return (
    <div>
      <form onSubmit={handleCreateTask}>
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
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong><br />
            Status: {task.status} <br />
            Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
