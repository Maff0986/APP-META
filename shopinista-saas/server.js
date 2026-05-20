import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import panelRoutes from "./routes/panel.js";
import webhookRoutes from "./routes/webhook.js";
import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

app.use("/", panelRoutes);
app.use("/webhook", webhookRoutes);
app.use("/api", apiRoutes);

app.listen(3000, () => {
  console.log("🚀 Shopinista SaaS activo:");
  console.log("👉 http://localhost:3000/panel");
});
