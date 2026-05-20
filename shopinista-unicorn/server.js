import express from "express"
import helmet from "helmet"
import cors from "cors"
import path from "path"
import {fileURLToPath} from "url"

import panel from "./routes/panel.js"
import webhook from "./routes/webhook.js"
import api from "./routes/api.js"

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

const app=express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use(express.static(path.join(__dirname,"public")))

app.use("/",panel)
app.use("/webhook",webhook)
app.use("/api",api)

app.listen(3000,()=>{
console.log("🦄 UNICORN APP RUNNING")
console.log("http://localhost:3000")
console.log("http://localhost:3000/panel")
})
