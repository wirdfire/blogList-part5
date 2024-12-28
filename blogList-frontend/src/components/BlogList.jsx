import React, { useState, useEffect } from "react";
import Blog from "./Blog";
import blogService from "../services/blogs";

const BlogList = ({ username }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const fetchedBlogs = await blogService.getAll();
      setBlogs(fetchedBlogs);
    };

    fetchBlogs();
  }, []);

  // Sort blogs by likes in descending order
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  const updateBlog = async (id, updatedBlog) => {
    if (updatedBlog === null) {
      // Delete logic
      if (window.confirm("Are you sure you want to delete this blog?")) {
        try {
          await blogService.deleteBlog(id);
          setBlogs(blogs.filter((blog) => blog.id !== id));
        } catch (error) {
          console.error("Error deleting the blog:", error);
        }
      }
    } else {
      // Update logic
      try {
        const response = await blogService.updateBlog(id, updatedBlog);
        setBlogs(blogs.map((blog) => (blog.id === id ? response : blog)));
      } catch (error) {
        console.error("Error updating the blog:", error);
      }
    }
  };

  return (
    <div>
      <h2>Blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          username={username}
        />
      ))}
    </div>
  );
};

export default BlogList;
