import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos"));
    if (saved) setTodos(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addOrUpdateTask = () => {
    if (!task.trim()) return;

    if (editIndex !== null) {
      const updated = [...todos];
      updated[editIndex].text = task;
      setTodos(updated);
      setEditIndex(null);
    } else {
      setTodos([...todos, { text: task, completed: false }]);
    }

    setTask("");
  };

  const toggleComplete = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  const deleteTask = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const editTask = (index) => {
    setTask(todos[index].text);
    setEditIndex(index);
  };

  return (
    <div className="app">
      <h1>📝 Task Manager</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Add or update a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addOrUpdateTask}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <div className="todo-list">
        {todos.map((todo, index) => (
          <div key={index} className="todo">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(index)}
            />

            <span className={todo.completed ? "done" : ""}>
              {todo.text}
            </span>

            <div className="actions">
              <button onClick={() => editTask(index)}>✏️</button>
              <button onClick={() => deleteTask(index)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;