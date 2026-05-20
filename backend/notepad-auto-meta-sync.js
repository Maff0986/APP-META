require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { exec } = require("child_process");

const ENV_PATH = path.join(__dirname, ".env");

async function getNgrokURL() {
  const res = await axios.get("http://127.0.0.1:4040/api/tunnels");

  const httpsTunnel = res.data.tunnels.find(t =>
    t.public_url.startsWith("https")
  );

  if (!httpsTunnel) {
    throw new Error("No se encontró túnel HTTPS");
  }

  return httpsTunnel.public_url;
}

function updateEnv(url) {
  let env = fs.existsSync(ENV_PATH)
    ? fs.readFileSync(ENV_PATH, "utf8")
    : "";

  const setVar = (key, value) => {
    const regex = new RegExp(`^${key}=.*`, "m");

    if (env.match(regex)) {
      env = env.replace(regex, `${key}=${value}`);
    } else {
      env += `\n${key}=${value}`;
    }
  };

  setVar("BASE_URL", url);
  setVar("REDIRECT_URI", `${url}/auth/callback`);

  fs.writeFileSync(ENV_PATH, env);

  console.log("✅ .env actualizado");
}

function openBrowser(url) {
  exec(`start ${url}/auth/login`);
}

function startServer() {
  console.log("🚀 Iniciando server.js...\n");

  const server = exec("node server.js");

  server.stdout.pipe(process.stdout);
  server.stderr.pipe(process.stderr);
}

(async () => {
  try {
    console.log("🔎 Detectando NGROK...");

    const ngrokURL = await getNgrokURL();

    console.log("✅ URL:", ngrokURL);

    updateEnv(ngrokURL);

    startServer();

    setTimeout(() => openBrowser(ngrokURL), 4000);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();