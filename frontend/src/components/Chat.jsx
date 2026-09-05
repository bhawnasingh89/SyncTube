import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

function Chat({ username }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off(
        "receive_message",
        handleReceiveMessage
      );
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    const text = message.trim();

    if (!text) {
      return;
    }

    socket.emit("send_message", {
      username,
      message: text,
    });

    setMessage("");
  };

  return (
    <section className="chat-section">
      <div className="panel-header">
        <h2>Chat</h2>
      </div>

      <div className="messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            No messages yet.
            <br />
            Start the conversation!
          </div>
        ) : (
          messages.map((item, index) => (
            <div
              className="chat-message"
              key={`${item.username}-${index}`}
            >
              <div className="chat-avatar">
                {item.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>{item.username}</strong>

                <p>{item.message}</p>
              </div>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        className="chat-input"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">
          Send
        </button>
      </form>
    </section>
  );
}

export default Chat;