import React from "react";

function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="mr-2" // Отступ справа от чекбокса
        />
        <span className={todo.completed ? "line-through" : ""}>
          {todo.title}
        </span>
      </div>
      <button
        className="bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 transition"
        onClick={() => deleteTodo(todo.id)}
      >
        Удалить
      </button>
    </div>
  );
}

export default TodoItem;
