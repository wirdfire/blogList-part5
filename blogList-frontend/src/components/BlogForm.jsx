import React, { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();

    await blogService.create(newBlog);
    setNewBlog({ title: "", author: "", url: "" }); // Reset the form
  };

  return (
    <div>
      <h2>Create a new Blog</h2>
      <form onSubmit={handleBlogSubmit} id="login-form">
        <div>
          Title:{" "}
          <input
            name="title"
            value={newBlog.title}
            onChange={handleBlogChange}
          />
        </div>
        <div>
          Author:{" "}
          <input
            name="author"
            value={newBlog.author}
            onChange={handleBlogChange}
          />
        </div>
        <div>
          URL:{" "}
          <input name="url" value={newBlog.url} onChange={handleBlogChange} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};
export default BlogForm;
