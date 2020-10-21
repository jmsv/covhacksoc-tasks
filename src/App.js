import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API || ""}/api`,
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const fetchTasks = useCallback(() => {
    api.get("/tasks").then(({ data }) => {
      console.log("data", data);
      setTasks(data);
    });
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <h1>Tasks App</h1>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(event) => {
                api
                  .put(`/tasks/${task.id}`, {
                    completed: event.target.checked,
                  })
                  .then(() => fetchTasks());
              }}
            />
            {task.label}{" "}
            <button
              onClick={() => {
                api.delete(`/tasks/${task.id}`).then(() => fetchTasks());
              }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          api.post("/tasks", { label: newTaskLabel }).then(() => {
            fetchTasks();
          });
        }}
      >
        <input
          type="text"
          placeholder="New task"
          value={newTaskLabel}
          onChange={(event) => {
            setNewTaskLabel(event.target.value);
          }}
        />
      </form>

      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </div>
  );
}

export default App;
