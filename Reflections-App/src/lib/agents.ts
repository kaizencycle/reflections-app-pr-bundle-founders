import { apiFetch } from "./api";

export async function pingAgents() {
  return apiFetch("/agents/ping");                   // -> { agents: ["Jade","Eve","Zeus","Hermes"] }
}

export async function speakToAgent(name: string, prompt: string) {
  return apiFetch(`/agents/message/${name}`, {       // -> { agent: "Jade", reply: "..." }
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}
