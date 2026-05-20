/**
 * GENERADOR DE TOKEN DE LARGA DURACIÓN PARA META
 * Archivo: scripts/generate_token.js
 */

const express = require("express");
const open = require("openurl").open;
const fetch = require("node-fetch");

const APP_ID = "AQUI_TU_APP_ID";
const APP_SECRET = "AQUI_TU_SECRET";
const REDIRECT_URI = "http://localhost:3000/callback";

const SCOPES = [
  "catalog_management",
  "business_management",
  "pages_show_list",
  "instagram_basic",
  "ads_management",
  "public_profile"
].join(",");

const app = express();

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send("Error: no se recibió el parámetro 'code'.");
  }

  try {
    const shortURL = `https://graph.facebook.com/v25.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&client_secret=${APP_SECRET}&code=${code}`;

    const shortRes = await fetch(shortURL);
    const shortData = await shortRes.json();

    const shortToken = shortData.access_token;

    const longURL = `https://graph.facebook.com/v25.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${shortToken}`;

    const longRes = await fetch(longURL);
    const longData = await longRes.json();

    const longToken = longData.access_token;

    const debugURL = `https://graph.facebook.com/debug_token?input_token=${longToken}&access_token=${APP_ID}|${APP_SECRET}`;
    const debugRes = await fetch(debugURL);
    const debugData = await debugRes.json();

    res.send(`
      <h1>Token generado correctamente</h1>
      <textarea style="width:100%;height:200px">${longToken}</textarea>
      <pre>${JSON.stringify(debugData, null, 2)}</pre>
    `);

    console.log("\nTOKEN DE LARGA DURACIÓN:");
    console.log(longToken);

  } catch (err) {
    res.send("Error interno: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");

  const authURL = `https://www.facebook.com/v25.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${SCOPES}&response_type=code`;

  console.log("Abriendo navegador...");
  setTimeout(() => open(authURL), 500);
});
