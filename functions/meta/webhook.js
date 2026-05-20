exports.metaWebhook = (req, res) => {
  const VERIFY_TOKEN = "shopinista_token";

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✔ Meta Webhook VALIDADO correctamente.");
      return res.status(200).send(challenge);
    } else {
      console.log("❌ Token inválido recibido.");
      return res.status(403).send("Invalid token");
    }
  }

  console.log("📩 Webhook recibido:", req.body);
  res.status(200).send("OK");
};
