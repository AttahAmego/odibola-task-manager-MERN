import React from "react";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColor =
    task.status === "completed"
      ? "#28a745"
      : task.status === "in-progress"
      ? "#007bff"
      : "#6c757d";

  return (
    <div
      className="rounded-2xl shadow p-4 mb-4 bg-white border-l-8"
      style={{ borderColor: "#EB3844" }}
    >
      <h2 className="text-xl font-bold text-[#002B5B] mb-1">{task.title}</h2>
      <p className="text-sm text-gray-700 mb-2">
        Deadline:{" "}
        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "None"}
      </p>
      <span
        className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white mb-2"
        style={{ backgroundColor: statusColor }}
      >
        {task.status || "N/A"}
      </span>
      <div>
        <button
          onClick={() => onEdit(task)}
          className="text-sm px-3 py-1 bg-[#002B5B] text-white rounded mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-sm px-3 py-1 bg-[#EB3844] text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
