const API_BASE = "http://localhost:8000";

let currentTab = "generate";

document.querySelectorAll(".tabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
  });
});

document.getElementById("run").addEventListener("click", async () => {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  output.textContent = "Loading...";

  try {
    let res;

    if (currentTab === "generate") {
      res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });
    }

    if (currentTab === "explain") {
      res = await fetch(`${API_BASE}/explainquery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql_query: input })
      });
    }

    if (currentTab === "correct") {
      res = await fetch(`${API_BASE}/correctquery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql_query: input })
      });
    }

    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);

  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
});
