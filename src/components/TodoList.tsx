import React, { useEffect, useState } from "react";
import "./TodoList.css";
import Todo from "../types/Todo";
import { io, Socket } from "socket.io-client";

function Header({ addTodo }: any) {
  const [newTodo, setNewTodo] = useState("");

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      addTodo(newTodo);
      setNewTodo("");
    }
  };

  return (
    <header>
      <h1>Todo Liste</h1>
      <input
        className="new-todo"
        placeholder="Watcha gonna do?"
        value={newTodo}
        onChange={(event) => setNewTodo(event.target.value)}
        onKeyPress={handleKeyDown}
        autoFocus
      ></input>
    </header>
  );
}

function Footer({todoCount}:{todoCount: number}) {
  return (
    (todoCount > 0) ?
      <footer className='footer' >
        <span className='todo-count'>
          <strong>{todoCount}</strong> {(todoCount == 1) ? 'item' : 'items'} left
        </span>
      </footer> 
    : null
  );
}

function List({
  todos,
  removeTodo,
  toggleTodoComplete,
}: {
  todos: Todo[];
  removeTodo: any;
  toggleTodoComplete: any;
}) {
  const list = todos.map((todo) => {
    return (
      <li className={todo.complete ? "completed" : ""} key={todo.id}>
        <Item
          todo={todo}
          removeTodo={removeTodo}
          toggleTodoComplete={toggleTodoComplete}
        ></Item>
      </li>
    );
  });

  return (
    <section className="main">
      <ul className="todo-list">{list}</ul>
    </section>
  );
}

function Item({
  todo,
  removeTodo,
  toggleTodoComplete,
}: {
  todo: Todo;
  removeTodo: any;
  toggleTodoComplete: any;
}) {
  return (
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={todo.complete}
        readOnly
        onClick={() => toggleTodoComplete(todo)}
      />
      <label>{todo.title}</label>
      <button className="destroy" onClick={() => removeTodo(todo)} />
    </div>
  );
}

function TodoList({ socketResource }: { socketResource: string }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const connect = () => {
      const socket = io(socketResource, { transports: ["websocket"] });

      socket.on("update", (items: Todo[]) => {
        setTodos(items);
      });

      setSocket(socket);
    };
    connect();
  }, [socketResource]);

  const addTodo = (newTodo: string): void => {
    newTodo = newTodo.trim();
    if (newTodo.length > 0) socket?.emit("newItem", newTodo);
  };

  const removeTodo = (todo: Todo) => {
    socket?.emit("deleteItem", todo.id);
  };

  const toggleTodoComplete = (todo: Todo) => {
    socket?.emit("toggleTodoComplete", todo.id);
  };

  return (
    <section className="todoapp">
      <Header addTodo={addTodo} />
      <List
        todos={todos}
        removeTodo={removeTodo}
        toggleTodoComplete={toggleTodoComplete}
      />
      <Footer todoCount={todos.length}/>
    </section>
  );
}

export default TodoList;
