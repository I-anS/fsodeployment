const Notification = ({ message }) => {
  const notifStyle = {
    color: "red",
    fontStyle: "bold",
    fontSize: 16,
    borderColor: "red",
  };
  if (message === null) {
    return null;
  }

  return <div style={notifStyle}>{message}</div>;
};

export default Notification;
