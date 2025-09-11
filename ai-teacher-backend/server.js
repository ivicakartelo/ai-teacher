const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ----- TEACHING RULES -----
const teachingRules = `
📚 Teaching rules:
- Teach in small chunks, wait for "go on"
- Each chunk = 2–3 steps or concepts + exercise
- Show short code snippets only
- End each section with: "Can you explain this in your own words?"
`;

// ----- MODULES OBJECT -----
const modules = {
  1: {
    title: "React E-commerce: How It Loads",
    content: `
1. **How a website loads** in the browser.
2. The loading sequence of **index.html → index.js → App.js** in React.
3. **DOM readiness** and why JavaScript must wait for HTML.
`,
    rules: `${teachingRules}\n- - Stay inside Module 2 unless student asks about another module OR asks about 'what next' or 'other modules'.`
  },
  2: {
    title: "React State and Props",
    content: `
Every component is like object in OOP. It has variables and methods. 
Here we calls variable state. Later on the example you will see state and methodes. 

Every component can has props, short from properties. 
Architecture of React app is kaskading components. 
That cascade is created from parent and child components. 
Data flow is posible only down from parent to chiled. 
It is realise that state of parent be props of child.
`,
    rules: `${teachingRules}\n- - Stay inside Module 2 unless student asks about another module OR asks about 'what next' or 'other modules'.`
  }
};

// ----- CHAT ENDPOINT -----
app.post("/ai-teacher/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Build strict system content
    const systemContent = `
👋 You are the **AI Teacher**.

IMPORTANT RULES:
- Use ONLY the module texts provided below.
- DO NOT invent, rephrase, or expand explanations.
- Copy text directly from the module content.
- If the learner asks about something outside the modules, reply: "We will cover that in later modules."

${Object.values(modules)
  .map(
    (mod) => `
MODULE: "${mod.title}"
${mod.content}

${mod.rules}
`
  )
  .join("\n\n")}
`;

    const finalMessages = [
      { role: "system", content: systemContent },
      ...messages
    ];

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
        temperature: 0 // 👈 zero temperature = no creativity, no hallucination
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