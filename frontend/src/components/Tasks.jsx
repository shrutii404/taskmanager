import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer || {});
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [fetchData, { loading }] = useFetch();

  const formatDate = (date) => {
    const today = new Date();
    const taskDate = new Date(date);
    const timeDiff = today - taskDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Yesterday';
    if (daysDiff < 7) return `${daysDiff} days ago`;
    return `${Math.floor(daysDiff / 7)} week(s) ago`;
  };

  const fetchTasks = useCallback(() => {
    if (!authState.isLoggedIn) return;
    const config = {
      url: '/tasks',
      method: 'get',
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) => {
      const fetchedTasks = data.tasks || [];
      setTasks(fetchedTasks);
      setFilteredTasks(
        showCompleted ? fetchedTasks.filter((task) => task.completed) : fetchedTasks
      );
    });
  }, [authState.isLoggedIn, authState.token, fetchData, showCompleted]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: 'delete',
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  const handleComplete = (id, completed) => {
    // Optimistic UI update
    const updatedTasks = tasks.map((task) =>
      task._id === id ? { ...task, completed } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(
      showCompleted
        ? updatedTasks.filter((task) => task.completed)
        : updatedTasks
    );

    const config = {
      url: `/tasks/${id}`,
      method: 'put',
      headers: { Authorization: authState.token },
      data: { completed },
    };

    fetchData(config).catch(() => {
      // Revert if request fails
      const revertedTasks = tasks.map((task) =>
        task._id === id ? { ...task, completed: !completed } : task
      );
      setTasks(revertedTasks);
      setFilteredTasks(
        showCompleted
          ? revertedTasks.filter((task) => task.completed)
          : revertedTasks
      );
    });
  };

  const toggleCompletedTasks = () => {
    setShowCompleted(!showCompleted);
    setFilteredTasks(
      !showCompleted
        ? tasks.filter((task) => task.completed)
        : tasks
    );
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/back.avif')`,
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 font-sans">
        {/* Task List */}
        <div className="relative grid grid-cols-12 gap-6 h-[85vh] p-6 z-10">
          <div className="col-span-8 bg-white border border-gray-200 shadow-xl rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-5 pb-3 border-b">
              <h2 className="text-2xl font-bold text-gray-900">📝 Your Tasks</h2>
              <Link
                to="/tasks/add"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md"
              >
                + New
              </Link>
            </div>

            {loading ? (
              <Loader />
            ) : filteredTasks.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                {showCompleted ? 'No completed tasks 😕' : 'No tasks found 😕'}
              </p>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 max-h-[60vh]">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`p-4 rounded-xl transition-all duration-200 shadow-sm border-l-4 ${
                      task.completed
                        ? 'bg-green-50 border-green-400'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p
                          className={`text-lg font-semibold ${
                            task.completed
                              ? 'line-through text-gray-500'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(task.createdAt)} •{' '}
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              task.priority === 'High'
                                ? 'bg-red-100 text-red-600'
                                : task.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <Tooltip text="Edit Task" position="top">
                          <Link
                            to={`/tasks/${task._id}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                        </Tooltip>
                        <Tooltip text="Delete Task" position="top">
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="flex items-center mt-4 justify-between">
                      <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) =>
                            handleComplete(task._id, e.target.checked)
                          }
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        {task.completed ? (
                          <span className="text-green-600 font-medium">
                            Completed
                          </span>
                        ) : (
                          <span className="text-gray-700">Mark as Done</span>
                        )}
                      </label>

                      {task.completed && (
                        <i className="fa-solid fa-circle-check text-green-600 text-lg animate-bounce" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-4 bg-white border border-gray-200 shadow-xl rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ⚙️ Actions
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>🔍 Filter by Priority (Coming soon)</li>
                <li>📅 Sort by Date (Coming soon)</li>
                <li>
                  <button
                    onClick={toggleCompletedTasks}
                    className={`w-full text-left py-2 px-3 rounded-md transition ${
                      showCompleted
                        ? 'bg-blue-100 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    ✅ {showCompleted ? 'Show All Tasks' : 'View Completed Tasks'}
                  </button>
                </li>
              </ul>
            </div>
            <button className="self-end mt-10 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 shadow">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;