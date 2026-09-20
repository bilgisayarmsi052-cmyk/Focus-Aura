# Focus Aura

Minimal, sakin bir odak panosu ve AI odak koçu. Saf Node.js kullanır; ek paket kurulumu gerekmez.

## Bilgisayarında çalıştırma

1. `.env.example` dosyasını `.env` adıyla kopyala.
2. `.env` içindeki `GEMINI_API_KEY` kısmına Google AI Studio API anahtarını yaz.
3. Bu klasörde `npm start` çalıştır.
4. Tarayıcıda `http://localhost:3000` adresini aç. `file:///` ile açma; AI koç için yerel sunucu gerekir.

Anahtar yoksa AI koç ekranda bunun nedenini söyler. Anahtar yalnızca sunucuda kullanılır; tarayıcıya ve GitHub'a gönderilmez.

## GitHub'a koyma

`.env` dosyasını kesinlikle yükleme; `.gitignore` bunu engeller. Bu klasörü yeni GitHub reposuna yüklemek için:

```powershell
git add .
git commit -m "İlk Focus Aura sürümü"
git branch -M main
git remote add origin GITHUB_REPO_ADRESIN
git push -u origin main
```

GitHub'da **New repository** ile boş bir `focus-aura` reposu aç, sonra `GITHUB_REPO_ADRESIN` yerine GitHub'ın verdiği HTTPS adresini yapıştır.

## İnternette yayınlama

Render veya Railway'de yeni bir Node.js web servisi oluşturup bu GitHub reposunu bağla. Başlatma komutu `npm start` olmalı; panelin Environment Variables bölümüne `GEMINI_API_KEY` eklenmeli. Böylece anahtar GitHub'a yazılmadan uygulama çevrimiçi çalışır.

