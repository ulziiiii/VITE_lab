import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom"; // Импортируем Link для навигации

function DndPage() {
  const [columns, setColumns] = useState({
    todo: {
      name: "To Do",
      items: [
        { id: "1", content: "First task" },
        { id: "2", content: "Second task" },
      ],
    },
    inProgress: {
      name: "In Progress",
      items: [],
    },
    done: {
      // Новый столбец "Готово"
      name: "Done",
      items: [],
    },
    blocked: {
      // Новый столбец "Заблокировано"
      name: "Block",
      items: [],
    },
  });

  const [newTaskContent, setNewTaskContent] = useState(""); // Создание состояния
  const handleNewTaskChange = (event) => {
    setNewTaskContent(event.target.value); // Обновление состояния
  };

  const addNewTask = () => {
    const newTaskId = Date.now().toString(); // Создание уникального ID
    // Обновление состояния "columns"
    setColumns((prevColumns) => ({
      ...prevColumns,
      // Обновление столбца "todo"
      todo: {
        ...prevColumns.todo,
        // Обновление списка задач "items"
        items: [
          ...prevColumns.todo.items,
          // Добавление новой задачи в список
          { id: newTaskId, content: newTaskContent },
        ],
      },
    }));
    // Очистка поля ввода
    setNewTaskContent("");
  };

  const onDragEnd = (result, columns, setColumns) => {
    // chireh ur dung huleen avh ondragend funktsiig todorhoiln
    const { source, destination } = result; // Извлечение информации о перетаскивании
    if (!destination) return; // Проверка на отмену перетаскивания

    const sourceColumn = columns[source.droppableId]; // Получение исходного столбца
    const destColumn = columns[destination.droppableId]; // Получение целевого столбца
    const sourceItems = [...sourceColumn.items]; // Копирование списка задач исходного столбца
    const destItems = [...destColumn.items]; //  Копирование списка задач целевого столбца
    const [removed] = sourceItems.splice(source.index, 1); // Удаление перемещаемой задачи из исходного списка

    // Если задача перетаскивается внутри одного и того же столбца:
    if (source.droppableId === destination.droppableId) {
      // Вставка задачи в новый индекс в исходном списке
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        // Обновление состояния "columns"
        ...columns, // Сохранение всех существующих столбцов
        [source.droppableId]: {
          // Обновление конкретного столбца
          ...sourceColumn, // Сохранение всех существующих данных столбца
          items: sourceItems, // Обновление списка задач
        },
      });
    } else {
      //Если задача перетаскивается в другой столбец:
      destItems.splice(destination.index, 0, removed); //Вставка задачи в новый индекс в целевом списке
      setColumns({
        ...columns,
        [source.droppableId]: {
          // Обновление исходного столбца
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    }
  };
  //  Функция для удаления задачи
  const handleDeleteTask = (columnId, taskId) => {
    // Обновление состояния "columns" с помощью setState
    setColumns((prevColumns) => ({
      ...prevColumns, // Сохранение всех существующих столбцов
      // Обновление конкретного столбца
      [columnId]: {
        // Используем columnId для обновления правильного столбца
        ...prevColumns[columnId],
        //  Обновление списка задач
        items: prevColumns[columnId].items.filter((item) => item.id !== taskId), // Фильтрация списка задач
      },
    }));
  };

  return (
    <div className="flex justify-center h-screen">
      <Link
        to="/"
        className="mb-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Перейти к To-Do
      </Link>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        <div className="flex flex-row gap-4">
          {Object.entries(columns).map(([columnId, column], index) => (
            <div
              key={columnId}
              className="flex flex-col items-center mx-4 bg-white rounded-lg shadow-md p-4"
            >
              <h2 className="text-xl text-gray-800 mb-2">{column.name}</h2>
              {columnId === "todo" && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Введите новую задачу"
                    value={newTaskContent}
                    onChange={handleNewTaskChange}
                    className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                  />
                  <button
                    onClick={addNewTask}
                    className="bg-blue-500 text-white rounded-lg px-2 py-2 hover:bg-blue-600 transition"
                  >
                    Добавить задачу
                  </button>
                </div>
              )}
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`border border-gray-300 rounded-lg p-4 w-full min-h-[500px] ${
                      snapshot.isDraggingOver ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex justify-between  p-4 rounded-md   ${
                                snapshot.isDragging
                                  ? "bg-blue-700"
                                  : "bg-blue-500"
                              } text-white cursor-move`}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              <span>{item.content}</span>
                              <button
                                onClick={() =>
                                  handleDeleteTask(columnId, item.id)
                                }
                                className="bg-red-500 text-white rounded-lg px-2 py-2 hover:bg-red-600"
                              >
                                Удалить
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default DndPage;
