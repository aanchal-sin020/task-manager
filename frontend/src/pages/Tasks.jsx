import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  /* ---------------- ADD TASK ---------------- */
  const addTask = async () => {
    if (!title.trim() || isAdding) return;

    setIsAdding(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://task-manager-production-4c0a.up.railway.app/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, status: "todo" }),
      });

      if (res.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setTitle("");
    } finally {
      setIsAdding(false);
    }
  };

  /* ---------------- DELETE TASK ---------------- */
  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://task-manager-production-4c0a.up.railway.app/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (id, status) => {
    if (loadingTaskId) return;

    setLoadingTaskId(id);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://task-manager-production-4c0a.up.railway.app/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? data.task : t))
      );
    } finally {
      setLoadingTaskId(null);
    }
  };

  /* ---------------- FETCH TASKS ---------------- */
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const res = await fetch("http://task-manager-production-4c0a.up.railway.app/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTasks(data.tasks || []);
    };

    fetchTasks();
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", padding: "3rem" }}>
      <div
        style={{
          maxWidth: "500px",
          margin: "auto",
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>My Tasks</h2>

        {/* FILTERS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["all", "todo", "in-progress", "done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                background: filter === f ? "#4f46e5" : "#f9fafb",
                color: filter === f ? "#fff" : "#111",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              {f === "all"
                ? "All"
                : f === "todo"
                ? "Todo"
                : f === "in-progress"
                ? "In Progress"
                : "Done"}
            </button>
          ))}
        </div>

        {/* ADD TASK */}
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button
          onClick={addTask}
          disabled={!title.trim() || isAdding}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: isAdding ? "#a5b4fc" : "#4f46e5",
            color: "#fff",
            fontWeight: "500",
            marginBottom: "20px",
            cursor: isAdding ? "not-allowed" : "pointer",
          }}
        >
          {isAdding ? "Adding..." : "Add Task"}
        </button>

        {/* EMPTY STATE */}
        {tasks.length === 0 && (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            No tasks yet. Add your first task ✨
          </p>
        )}

        {/* TASK LIST */}
        {tasks
          .filter((t) => filter === "all" || t.status === filter)
          .map((task) => (
            <div
              key={task._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                background:
                  task.status === "done"
                    ? "#dcfce7"
                    : task.status === "in-progress"
                    ? "#fef3c7"
                    : "#fee2e2",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: "500" }}>{task.title}</p>

                {/* STATUS PILL */}
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "4px",
                    padding: "2px 8px",
                    fontSize: "12px",
                    borderRadius: "999px",
                    background:
                      task.status === "done"
                        ? "#bbf7d0"
                        : task.status === "in-progress"
                        ? "#fde68a"
                        : "#fecaca",
                    color:
                      task.status === "done"
                        ? "#166534"
                        : task.status === "in-progress"
                        ? "#92400e"
                        : "#991b1b",
                    fontWeight: "500",
                  }}
                >
                  {task.status}
                </span>
              </div>

              <select
                value={task.status}
                disabled={loadingTaskId === task._id}
                onChange={(e) => updateStatus(task._id, e.target.value)}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <button onClick={() => deleteTask(task._id)}>❌</button>
            </div>
          ))}

        <button onClick={logout} style={{ marginTop: "10px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Tasks;
