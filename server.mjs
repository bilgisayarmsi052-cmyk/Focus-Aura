import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

// Sıfır bağımlılıklı .env desteği: anahtar hiçbir zaman istemciye gönderilmez.
try {
  const envFile = await readFile(join(process.cwd(), ".env"), "utf8");
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*["']?([^"'#\r\n]*)["']?\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
} catch { /* .env isteğe bağlıdır. */ }

const port = process.env.PORT || 3000;
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"application/javascript; charset=utf-8" };

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/coach") {
    let body = "";
    for await (const chunk of req) body += chunk;
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY tanımlı değil.");
      const { intent = "odaklanmak", context = "" } = JSON.parse(body);
      const prompt = `Sen sakin, sade ve yargılamayan bir Türkçe odak koçusun. En fazla iki kısa cümle yaz. Kullanıcıya tek bir somut sonraki adım öner.\n\nBugünün niyeti: ${intent}\nŞu anki bağlam: ${context || "Belirtilmedi."}`;
      const api = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-2.5-flash"}:generateContent`, {
        method: "POST",
        headers: { "Content-Type":"application/json", "x-goog-api-key":process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents:[{ parts:[{ text:prompt }] }] }),
        signal: AbortSignal.timeout(20000)
      });
      const result = await api.json();
      if (!api.ok) throw new Error(result.error?.message || "Gemini isteği başarısız.");
      const message = result.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("").trim();
      if (!message) throw new Error("Gemini boş yanıt verdi.");
      res.writeHead(200, { "Content-Type":"application/json" });
      return res.end(JSON.stringify({ message }));
    } catch (error) {
      console.error("AI coach error:", error.message);
      res.writeHead(500, { "Content-Type":"application/json" });
      return res.end(JSON.stringify({ error:error.message }));
    }
  }
  const route = req.url === "/" ? "/index.html" : req.url;
  if (!/^\/[\w.-]+$/.test(route)) { res.writeHead(404); return res.end(); }
  try {
    const file = await readFile(join(process.cwd(), route));
    res.writeHead(200, { "Content-Type":mime[extname(route)] || "application/octet-stream" }); res.end(file);
  } catch { res.writeHead(404); res.end("Bulunamadı"); }
});
server.listen(port, () => console.log(`Focus Aura: http://localhost:${port}`));

