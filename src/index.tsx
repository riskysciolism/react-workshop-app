import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoList from './components/TodoList';

ReactDOM.render(
  <React.StrictMode>
    <TodoList socketResource='localhost:3001'/>
  </React.StrictMode>,
  document.getElementById('root')
);