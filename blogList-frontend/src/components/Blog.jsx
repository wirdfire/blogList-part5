import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, deleteBlog, updateLikes, username }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLike = async () => {
    const blogId = blog.id || blog._id;

    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      const response = await blogService.updateBlog(blogId, updatedBlog);
      updateLikes(response); // Update the parent with the updated blog
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete the blog ${blog.title}?`)
    ) {
      try {
        await blogService.deleteBlog(blog.id);
        deleteBlog(blog.id); // Update the parent with the removed blog
      } catch (error) {
        console.error("Error deleting the blog:", error);
        alert("Failed to delete the blog. Please check your authorization.");
      }
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{showDetails ? "Hide" : "View"}</button>
      </div>
      {showDetails && (
        <div className="blog">
          <p className="blog-title">Title: {blog.title}</p>
          <p className="blog-author">Author: {blog.author}</p>
          <p className="blog-url">Url: {blog.url}</p>
          {blog.user && blog.user.name && (
            <p className="blog-user-name">User: {blog.user.name}</p>
          )}
          <p className="blog-id">Id: {blog.id}</p>
          <p className="blog-likes">
            Likes: {blog.likes}
            <button onClick={handleLike}>like</button>
          </p>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};
export default Blog;
