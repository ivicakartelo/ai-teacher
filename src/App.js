import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/ai-teacher/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }) // 👈 send history
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h2 className="app-title">💡 AI Teacher - Module 1</h2>

      {/* --- STATIC WELCOME LABEL (not part of chat) --- */}
      <div className="welcome-box">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {`**Welcome!** This is the experimental AI Teacher.
We currently have **only Module 1: "React E-commerce: How It Loads".**`}
        </ReactMarkdown>
      </div>

      {/* --- CHAT --- */}
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className="message-bubble">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  strong: ({ node, ...props }) => (
                    <strong
                      style={{ color: m.role === "user" ? "#ffd700" : "#000" }}
                      {...props}
                    />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code className="inline-code" {...props} />
                    ) : (
                      <pre className="code-block">
                        <code {...props} />
                      </pre>
                    )
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div>⏳ Thinking...</div>}
      </div>

      {/* --- INPUT --- */}
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your question..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;