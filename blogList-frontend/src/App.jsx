import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import Blog from "./components/Blog";

const App = () => {
  const togglableRef = useRef();
  const [message, setMessage] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotifcation] = useState({
    message: null,
    type: null,
  });

  // Check for logged-in user in localStorage on component mount
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) =>
        setBlogs(blogs.map((blog) => ({ ...blog, id: blog._id })))
      );
  }, []);

  //Notification handler
  const showNotifcation = (message, type) => {
    setNotifcation({ message, type });
    setTimeout(() => {
      setNotifcation({ message: null, type: null });
    }, 5000);
  };

  //This function handles user login in a React application
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user)); //save the details of a logged-in user to the local storage.
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotifcation(`Welcome back, ${user.name}`, "success");
    } catch (error) {
      showNotifcation("Login failed: Incorrect username or password", "error");
    }
  };

  //This block of code handles user logout
  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>
        {user.name} logged-in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="Create New Blog">
        <BlogForm createBlog={BlogForm} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog key={blog.id || blog._id} blog={blog} />
      ))}
    </div>
  );
};
export default App;
