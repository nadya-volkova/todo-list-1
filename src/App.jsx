import React from "react";
import "./App.css";
import Todo from "./Todo.jsx";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "",
      description: "",
      todos: [],
      showIncomplete: false,
      inputError: false,
    };
  }

  handleNameChange = (e) => {
    if (e.key === "ArrowRight") {
      this.descriptionInput.focus();
    } else if (e.key === "Enter") {
      this.addTodo();
    } else {
      this.setState({ value: e.target.value });
    }
  };

  handleDescriptionChange = (e) => {
    if (e.key === "ArrowLeft") {
      this.nameInput.focus();
    } else if (e.key === "Enter") {
      this.addTodo();
    } else {
      this.setState({ description: e.target.value });
    }
  };

  handleTodoAdd = (e) => {
    if (e.key === "Enter") {
      this.addTodo();
    }
  };

  addTodo = () => {
    const { value, description } = this.state;
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      this.setState({ inputError: true });
      return;
    }
    const newTodo = {
      id: Date.now(),
      name: trimmedValue,
      description: description.trim(),
      checked: false,
      createdAt: new Date().toLocaleString(),
    };

    this.setState((prevState) => ({
      value: "",
      description: "",
      todos: [newTodo, ...prevState.todos],
      inputError: false,
    }));
  };

  handleTodoChecked = (index) => (e) => {
    const newTodo = { ...this.state.todos[index], checked: e.target.checked };
    const newTodos = this.state.todos
      .map((todo, i) => (i === index ? newTodo : todo))
      .sort((a, b) => a.checked - b.checked);
    this.setState({ todos: newTodos });
  };

  handleTodoDelete = (index) => () => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter((_, i) => i !== index),
    }));
  };

  toggleShowIncomplete = () => {
    this.setState((prevState) => ({
      showIncomplete: !prevState.showIncomplete,
    }));
  };

  handleTodoEdit = (id, newName, newDescription) => {
    const updatedTodo = {
      ...this.state.todos.find((todo) => todo.id === id),
      name: newName,
      description: newDescription,
    };
    const newTodos = this.state.todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );
    this.setState({ todos: newTodos });
  };

  render() {
    const filteredTodos = this.state.showIncomplete
      ? this.state.todos.filter((todo) => !todo.checked)
      : this.state.todos;

    return (
      <div className="container">
        <div className="header">
          <h1>TODO LIST</h1>
        </div>
        <div className="input-group">
          <input
            ref={(input) => (this.nameInput = input)}
            value={this.state.value}
            onChange={this.handleNameChange}
            onKeyDown={this.handleNameChange}
            placeholder="Введите название задачи"
            className={`input-field ${this.state.inputError ? "error" : ""}`}
          />

          <input
            ref={(input) => (this.descriptionInput = input)}
            value={this.state.description}
            onChange={this.handleDescriptionChange}
            onKeyDown={this.handleDescriptionChange}
            placeholder="Введите описание задачи"
            className="input-field"
          />
          <button
            onClick={this.addTodo}
            className="add-button"
            ref={(button) => (this.addButton = button)}
          >
            ДОБАВИТЬ
          </button>
        </div>
        <div className="filter-section">
          <label className="filter-label">
            <input
              type="checkbox"
              checked={this.state.showIncomplete}
              onChange={this.toggleShowIncomplete}
            />
            Только невыполненные
          </label>
        </div>
        <ul className="todo-list">
          {filteredTodos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              onTodoChecked={this.handleTodoChecked(index)}
              onTodoDelete={this.handleTodoDelete(index)}
              onTodoEdit={this.handleTodoEdit}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
