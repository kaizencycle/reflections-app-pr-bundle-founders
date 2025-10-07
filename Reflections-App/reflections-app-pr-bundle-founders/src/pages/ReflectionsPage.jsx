// src/pages/ReflectionsPage.jsx 
import { useState } from "react";
import { saveReflection, getReflections, companionRespond, anchorReflection } from "../lib/api";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const ReflectionsPage = () => {
  // ... your chat component code here
};

export default function ReflectionsPage() {
  const [messages, setMessages] = useState([{ role: "system", content: "Welcome to Reflections ✨" }]);
  const [text, setText] = useState("");

  async function handleSend() {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);

    // persist + anchor (these are stubs right now)
    await saveReflection(text);
    await anchorReflection({
      event_type: "reflection",
      civic_id: "demo",
      lab_source: "lab4",
      payload: { text }
    });

    const reply = await companionRespond(text);
    if (reply.ok) setMessages((m) => [...m, { role: "assistant", content: reply.response }]);

    setText("");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Reflections</h1>

      <div className="border rounded p-3 h-80 overflow-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <b>{m.role}</b>: {m.content}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your reflection…"
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={handleSend} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
