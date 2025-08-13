// src/ChatInput.jsx
import React, { useState } from "react";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      <label
        htmlFor="chat-input"
        style={{ fontSize: 20, fontWeight: "bold", display: "block", marginBottom: 8 }}
      >
        Your message:
      </label>
      <textarea
        id="chat-input"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          height: 150,
          fontSize: 20,
          padding: 15,
          borderRadius: 8,
          border: "1px solid #ccc",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
      <button
        type="button"
        onClick={sendMessage}
        style={{
          marginTop: 12,
          padding: "15px 40px",
          fontSize: 20,
          borderRadius: 8,
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}