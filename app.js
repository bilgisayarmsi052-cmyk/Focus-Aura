const suggestions = [
  "Bugün önce en sessiz görevi seç. Başlamak, motivasyonu çağırır.",
  "Niyetini küçült: yalnızca ilk beş dakikayı tamamlamayı hedefle.",
  "Bildirimleri sustur. Dikkatin, en değerli çalışma alanın.",
  "Bitirmeye değil, var olmaya odaklan. Ritmi işin kendisi kurar.",
];
const tips = ["“Mükemmel bir plan değil, görünür bir sonraki adım yeter.”", "“Odak, yapacak daha az şey bulmak değil; bir şeye evet demektir.”", "“Yavaşlık gecikme değildir; özenin ritmidir.”"];
let total = 25 * 60, remaining = total, timer, running = false;
const $ = (id) => document.getElementById(id);

function paintTimer() {
  const min = Math.floor(remaining / 60).toString().padStart(2, "0");
  const sec = (remaining % 60).toString().padStart(2, "0");
  $("time").textContent = `${min}:${sec}`;
  $("progress").style.width = `${((total - remaining) / total) * 100}%`;
}
function stop() { clearInterval(timer); running = false; $("startButton").innerHTML = "Başla <span>→</span>"; }
$("startButton").addEventListener("click", () => {
  if (running) return stop();
  running = true; $("startButton").textContent = "Duraklat"; $("sessionNote").textContent = "Derinlik modundasın. İyi gidiyorsun.";
  timer = setInterval(() => { if (--remaining < 0) { remaining = 0; stop(); $("sessionNote").textContent = "Harika iş. Bir nefes alma zamanı."; } paintTimer(); }, 1000);
});
$("resetButton").addEventListener("click", () => { stop(); remaining = total; $("sessionNote").textContent = "Hazırsan 25 dakika senin."; paintTimer(); });
$("refreshSuggestion").addEventListener("click", () => { const next = suggestions.filter(x => x !== $("suggestion").textContent); $("suggestion").textContent = next[Math.floor(Math.random() * next.length)]; $("tip").textContent = tips[Math.floor(Math.random() * tips.length)]; });
$("coachButton").addEventListener("click", async () => {
  const button = $("coachButton"), intent = $("intention").value.trim(), context = $("context").value.trim();
  button.disabled = true; button.textContent = "Düşünüyor…";
  try {
    const response = await fetch("/api/coach", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ intent, context }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Yanıt alınamadı.");
    $("suggestion").textContent = data.message;
  } catch (error) {
    $("suggestion").textContent = `AI koç şu an hazır değil: ${error.message} Şimdilik: ` + suggestions[Math.floor(Math.random() * suggestions.length)];
  } finally { button.disabled = false; button.innerHTML = "AI koça sor <span>↗</span>"; }
});
document.querySelectorAll("[data-mood]").forEach(button => button.addEventListener("click", () => { document.querySelector(".moods .selected").classList.remove("selected"); button.classList.add("selected"); $("moodMessage").textContent = `${button.dataset.mood} bir tempo seçildi.`; }));
$("themeButton").addEventListener("click", () => document.body.classList.toggle("light"));
document.addEventListener("keydown", e => { if (e.code === "Space" && e.target.tagName !== "INPUT") { e.preventDefault(); $("startButton").click(); } });
$("dateLabel").textContent = new Intl.DateTimeFormat("tr-TR", { weekday:"long", day:"numeric", month:"long" }).format(new Date()).toUpperCase();
paintTimer();

