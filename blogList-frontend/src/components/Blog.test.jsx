import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

test("renders blog's title and author, but not URL or likes by default", () => {
  const blog = {
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://example.com",
    likes: 100,
  };

  render(<Blog blog={blog} />);

  // Check that the title and author are rendered
  const titleElement = screen.getByText(/Test Blog Title/);
  const authorElement = screen.getByText(/Test Author/);

  // Assert that both title and author are rendered
  expect(titleElement).toBeInTheDocument();
  expect(authorElement).toBeInTheDocument();

  // Check that URL and likes are not rendered
  const urlElement = screen.queryByText(blog.url);
  const likesElement = screen.queryByText(blog.likes);

  // Assert that URL and likes are not rendered
  expect(urlElement).toBeNull();
  expect(likesElement).toBeNull();
});

test("shows blog's URL and number of likes when the button is clicked", () => {
  const blog = {
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://example.com",
    likes: 100,
  };

  render(<Blog blog={blog} />);

  // Initially, URL and likes are not displayed
  const urlElement = screen.queryByText(blog.url);
  const likesElement = screen.queryByText(blog.likes);

  expect(urlElement).toBeNull();
  expect(likesElement).toBeNull();

  const button = screen.getByText("View");
  fireEvent.click(button);

  expect(screen.getByText(`Url: ${blog.url}`)).toBeInTheDocument();
  expect(screen.getByText(`Likes: ${blog.likes}`)).toBeInTheDocument();
  expect(button).toHaveTextContent("Hide");

  fireEvent.click(button);

  expect(screen.queryByText(`Url: ${blog.url}`)).toBeNull();
  expect(screen.queryByText(`Likes: ${blog.likes}`)).toBeNull();
  expect(button).toHaveTextContent("View");
});

test("calls the event handler with the correct details when a new blog is created", () => {
  const createBlog = jest.fn(); // Mock function to simulate event handler

  const { container } = render(<BlogForm createBlog={createBlog} />);

  // Select input fields using their placeholders or labels
  const titleInput = container.querySelector('input[name="title"]');
  const authorInput = container.querySelector('input[name="author"]');
  const urlInput = container.querySelector('input[name="url"]');
  const form = container.querySelector("form");

  // Simulate user input
  fireEvent.change(titleInput, { target: { value: "Test Blog Title" } });
  fireEvent.change(authorInput, { target: { value: "Test Author" } });
  fireEvent.change(urlInput, { target: { value: "http://testblog.com" } });

  // Simulate form submission
  fireEvent.submit(form);

  // Assert that the event handler was called once with the correct details
  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://testblog.com",
  });
});
