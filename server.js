import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import session from 'express-session';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const app  = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend')));


// ── Seguridad mínima ─────────────────────────────────────
if (!process.env.SESSION_SECRET) {
  console.warn('⚠️ Falta SESSION_SECRET en .env');
}

// ── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'shopinista-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// ── Rutas Meta ───────────────────────────────────────────
import metaOAuth   from './routes/meta-oauth.js';
import instagram   from './routes/instagram.js';
import catalog     from './routes/catalog.js';
import webhookMeta from './routes/webhook-meta.js';
import messaging   from './routes/messaging.js';
import marketing   from './routes/marketing.js';
import scheduler   from './routes/scheduler.js';

app.use('/auth/meta',  metaOAuth);
app.use('/instagram',  instagram);
app.use('/catalog',    catalog);
app.use('/webhook',    webhookMeta);
app.use('/messaging',  messaging);
app.use('/marketing',  marketing);
app.use('/scheduler',  scheduler);

// ── Tiendanube OAuth ─────────────────────────────────────
app.get('/login', (req, res) => {
  if (!process.env.CLIENT_ID) {
    return res.status(500).json({ error: 'CLIENT_ID no configurado' });
  }

  const url =
    'https://www.tiendanube.com/apps/authorize?' +
    'client_id=' + process.env.CLIENT_ID +
    '&response_type=code' +
    '&scope=read_products write_products' +
    '&redirect_uri=' + (process.env.APP_URL || 'http://localhost:3000') + '/auth';

  console.log('Iniciando login Tiendanube...');
// server.js
// Backend base para Shopinista Meta
// Cumple con las rutas oficiales de Meta y módulos externos

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================== RUTAS PRINCIPALES ==================

// Autenticación con Meta
app.use('/auth/meta', require('./routes/authMeta'));

// Instagram Graph API
app.use('/instagram', require('./routes/instagram'));

// Catálogo de productos
app.use('/catalog', require('./routes/catalog'));

// Webhooks (Meta, IG, WhatsApp)
app.use('/webhook', require('./routes/webhook'));

// Mensajería (WhatsApp/IG)
app.use('/messaging', require('./routes/messaging'));

// Marketing API (campañas/anuncios)
app.use('/marketing', require('./routes/marketing'));

// Scheduler (tareas programadas)
app.use('/scheduler', require('./routes/scheduler'));

// Tiendanube (sincronización de productos)
app.use('/tiendanube', require('./routes/tiendanube'));

// Canva (integración creativa)
app.use('/canva', require('./routes/canva'));

// CRM (gestión de clientes)
app.use('/crm', require('./routes/crm'));

// Dashboard (interfaz de gestión)
app.use('/dashboard', require('./routes/dashboard'));

// ================== SERVIDOR ==================
app.listen(PORT, () => {
  console.log(`🚀 Shopinista Meta backend corriendo en http://localhost:${PORT}`);
});



app.listen(PORT, () => {
  console.log('');
  console.log('  ██████╗██╗  ██╗ ██████╗ ██████╗ ██╗███╗  ██╗██╗███████╗████████╗ █████╗ ');
  console.log('  ██╔════╝██║  ██║██╔═══██╗██╔══██╗██║████╗ ██║██║██╔════╝╚══██╔══╝██╔══██╗');
  console.log('  ╚█████╗ ███████║██║   ██║██████╔╝██║██╔██╗██║██║╚█████╗    ██║   ███████║');
  console.log('   ╚═══██╗██╔══██║██║   ██║██╔═══╝ ██║██║╚████║██║ ╚═══██╗   ██║   ██╔══██║');
  console.log('  ██████╔╝██║  ██║╚██████╔╝██║     ██║██║ ╚███║██║██████╔╝   ██║   ██║  ██║');
  console.log('  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚══╝╚═╝╚═════╝    ╚═╝   ╚═╝  ╚═╝');
  console.log('');
  console.log('  🚀 Servidor activo en http://localhost:' + PORT);
  console.log('  📊 Dashboard: http://localhost:' + PORT + '/dashboard');
  console.log('');
});
