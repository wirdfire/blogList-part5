const Notification = ({ message, type }) => {
  if (!message) return null;

  const notificationStyle = {
    color: type === "success" ? "green" : "red",
    background: "lightgray",
    fontSize: "16px",
    border: `2px solid ${type === "success" ? "green" : "red"}`,
    borderRaius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return (
    <div style={notificationStyle} className="error">
      {message}
    </div>
  );
};
export default Notification;
