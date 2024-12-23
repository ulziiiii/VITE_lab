import React, { useState } from "react";
import TodoList from "../components/TodoList";
import { Link } from "react-router-dom";
// import "../components/index.css";

function TodoPage() {
  const [todos, setTodos] = useState([
    { id: 1, title: "Купить продукты", completed: false },
    { id: 2, title: "Прочитать книгу", completed: false },
  ]);

  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all"); // Состояние для фильтрации

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo) return;

    const newTodoItem = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };

    setTodos([...todos, newTodoItem]);
    setNewTodo("");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Функция для фильтрации задач
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true; // 'all'
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <Link
        to="/dnd"
        className="mb-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Перейти к DndPage
      </Link>
      <h1 className="text-2xl font-bold mb-4">Мой список задач</h1>
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Добавить новую задачу..."
          className="border border-gray-300 rounded-lg p-2 w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
        >
          Добавить
        </button>
      </form>
      <div className="mb-4 ">
        <button
          onClick={() => setFilter("all")}
          className="bg-gray-200 rounded-lg p-2 mr-2 hover:bg-gray-300 transition"
        >
          Все
        </button>
        <button
          onClick={() => setFilter("completed")}
          className="bg-green-200 rounded-lg p-2 mr-2 hover:bg-green-300 transition"
        >
          Выполненные
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className="bg-red-200 rounded-lg p-2 hover:bg-red-300 transition"
        >
          Невыполненные
        </button>
      </div>
      <TodoList
        todos={filteredTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
      />
    </div>
  );
}

export default TodoPage;
