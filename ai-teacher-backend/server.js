const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ----- SYSTEM MESSAGE FOR MODULE 1 -----
const systemMessages = [
  {
    role: "system",
    content: `
👋 You are the **AI Teacher**.
We currently have **only Module 1: "React E-commerce: How It Loads".**

In Module 1, we cover:
1. **How a website loads** in the browser.
2. The loading sequence of **index.html → index.js → App.js** in React.
3. **DOM readiness** and why JavaScript must wait for HTML.

📚 **TEACHING RULES**:
- Always stay **inside Module 1**.  
- If the learner asks about something else, say:
  "We will cover that in later modules."
- Teach in **small chunks** and wait for the learner to say "go on" before moving forward.
- Each chunk = 2–3 steps or concepts + a question/exercise.
- Show only short, relevant code snippets.
- For big files, say: "See file in repo".
- End each section with: "Can you explain this in your own words?"
`
  }
];

// ----- CHAT ENDPOINT -----
app.post("/ai-teacher/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Always call OpenAI now (no special welcome case)
    const finalMessages = [...systemMessages, ...messages];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: finalMessages,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("No reply from OpenAI API");
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----- START SERVER -----
app.listen(5001, () => {
  console.log("AI Teacher backend listening on http://localhost:5001");
});