import { useEffect, useState } from "react";
import { pingAgents, speakToAgent } from "../lib/agents";
import { clearToken } from "../lib/auth";

export default function Dashboard(){
  const [agents,setAgents] = useState<string[]>([]);
  const [prompt,setPrompt] = useState("");
  const [reply,setReply]   = useState("");

  useEffect(() => {
    pingAgents().then(j => setAgents(j.agents || [])).catch(console.error);
  }, []);

  async function speak(name: string) {
    setReply("");
    try {
      const j = await speakToAgent(name, prompt);
      setReply(j.reply || JSON.stringify(j));
    } catch (e:any) { setReply(e.message || "error"); }
  }

  return (
    <main style={{padding:24,minHeight:"100vh"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1>Founder’s PAW</h1>
        <button onClick={()=>{ clearToken(); location.href="/login"; }}>Logout</button>
      </header>

      <section style={{marginTop:24}}>
        <h2>Agents</h2>
        <p>{agents.length ? agents.join(" · ") : "Loading…"}</p>
      </section>

      <section style={{marginTop:24,maxWidth:720}}>
        <h2>Speak</h2>
        <input placeholder="Ask Jade…" value={prompt} onChange={e=>setPrompt(e.target.value)} />
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={()=>speak("Jade")}>Jade</button>
          <button onClick={()=>speak("Eve")}>Eve</button>
          <button onClick={()=>speak("Zeus")}>Zeus</button>
          <button onClick={()=>speak("Hermes")}>Hermes</button>
        </div>
        {reply && <pre style={{marginTop:12,whiteSpace:"pre-wrap"}}>{reply}</pre>}
      </section>
    </main>
  );
}
