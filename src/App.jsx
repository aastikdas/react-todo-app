import React, { useState, useEffect } from 'react'
import './App.css'
import { TodoProvider } from './contexts'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'

function App() {

  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState("all");

  const addTodo = (todo) => {
    setTodos((prev) => [...prev, { id: Date.now(), ...todo }]);
  }

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)))
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((prevTodo) => prevTodo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((prevTodo) => prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo))
  }

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"))

    if (todos && todos.length > 0) {
      setTodos(todos)
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "not-completed") return !todo.completed;
    return true;
  });


  return (
    <TodoProvider value={{ todos, addTodo, deleteTodo, updateTodo, toggleComplete }}>

      <button
        className='bg-slate-600 dark:bg-yellow-400 dark:text-black text-white fixed right-5 top-5 rounded-full px-3 py-2 hover:cursor-pointer transition'
        onClick={() => {
          const isDark = document.documentElement.classList.toggle("dark");
          localStorage.setItem("theme", isDark ? "dark" : "light");
        }}
      >
        <i className="hgi hgi-stroke hgi-bulb-charging text-2xl"></i>
      </button>

      <div className="min-h-screen py-8 bg-violet-200 dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 bg-purple-300 dark:bg-gray-800 text-black dark:text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
          <div className="mb-4">
            <TodoForm />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Filter your tasks
            </label>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-fit md:w-64 px-4 py-2 rounded-xl shadow-lg border-none 
               bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500
               text-white dark:text-gray-200 dark:from-purple-700 dark:via-indigo-700 dark:to-blue-700
               focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-indigo-400
               transition-all duration-1000 ease-in-out"
            >
              <option value="all" className="text-black dark:text-white bg-white dark:bg-gray-800">
                All
              </option>
              <option value="completed" className="text-black dark:text-white bg-white dark:bg-gray-800">
                Completed
              </option>
              <option value="not-completed" className="text-black dark:text-white bg-white dark:bg-gray-800">
                Not Completed
              </option>
            </select>
          </div>


          <div className="flex flex-wrap gap-y-3">
            {filteredTodos.length === 0 ? (
              <div className='m-auto text-gray-700 dark:text-gray-500 text-xl md:text-2xl'>No todos on your list</div>
            ) : (
              filteredTodos.map((todo) => (
                <div key={todo.id} className='w-full'>
                  <TodoItem todo={todo} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App
