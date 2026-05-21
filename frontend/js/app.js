const app = (function () {
  const state = {
    tiendanube: null,
    canva: null,
    meta: null,
    posts: [],
    products: [],
    assets: [],
    currentSection: 'home'
  };

  function loadFromLocalStorage() {
    const saved = storage.get('appState');
    if (saved) {
      Object.assign(state, saved);
    }
  }

  function saveToLocalStorage() {
    storage.set('appState', state);
  }

  function showToast(msg, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut .35s cubic-bezier(.4,0,.2,1) forwards';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  function closeLightbox() {
    document.getElementById('lightboxBackdrop').style.display = 'none';
  }

  function router(section) {
    state.currentSection = section;
    saveToLocalStorage();
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
    const content = document.getElementById('app-content');
    switch (section) {
      case 'home': renderHome(); break;
      case 'tiendanube': renderTiendanube(); break;
      case 'canva': renderCanva(); break;
      case 'publicador': renderScheduler(); break;
      case 'editor': renderPostEditor(); break;
      case 'scheduler': renderScheduler(); break;
      case 'gallery': renderGallery(); break;
      case 'calendar': renderCalendar(); break;
      default: renderHome();
    }
  }

  function renderHome() {
    const c = document.getElementById('app-content');
    c.innerHTML = `
      <div class="section-header">
        <h1 class="section-title">Dashboard</h1>
        <p class="section-sub">Estado de conexiones y accesos rápidos</p>
      </div>
      <div class="cards-grid">
        ${renderTiendanubeCard()}
        ${renderCanvaCard()}
        ${renderMetaCard()}
        ${renderSchedulerCard()}
        ${renderGalleryCard()}
        ${renderAIChatCard()}
        ${renderSettingsCard()}
      </div>
    `;
    attachHomeEvents();
  }

  function renderTiendanubeCard() {
    if (state.tiendanube?.connected) {
      return `
        <div class="card conn-card">
          <div class="card-icon">🛒</div>
          <div class="card-title">Tiendanube</div>
          <div class="conn-info">
            <div class="conn-url">${state.tiendanube.store_url || 'Tienda conectada'}</div>
            <div class="conn-date">Última sync: ${state.tiendanube.lastSync || 'Nunca'}</div>
          </div>
          <button class="btn btn-primary" onclick="app.syncTiendanube()">Sincronizar</button>
          <button class="btn btn-ghost" onclick="app.router('tiendanube')">Ver productos</button>
        </div>
      `;
    }
    return `
      <div class="card conn-card">
        <div class="card-icon">🛒</div>
        <div class="card-title">Tiendanube</div>
        <div class="card-desc">Conecta tu tienda para sincronizar productos</div>
        <button class="btn btn-primary" onclick="app.connectTiendanube()">Conectar Tiendanube</button>
      </div>
    `;
  }

  function renderCanvaCard() {
    if (state.canva?.connected) {
      return `
        <div class="card conn-card">
          <div class="card-icon">🎨</div>
          <div class="card-title">Canva</div>
          <div class="conn-info">
            <div>${state.canva.templateCount || 0} plantillas disponibles</div>
            <div class="conn-date">Último uso: ${state.canva.lastUsed || 'Nunca'}</div>
          </div>
          <button class="btn btn-primary" onclick="app.router('canva')">Ver plantillas</button>
        </div>
      `;
    }
    return `
      <div class="card conn-card">
        <div class="card-icon">🎨</div>
        <div class="card-title">Canva</div>
        <div class="card-desc">Conecta Canva para crear diseños</div>
        <button class="btn btn-primary" onclick="app.connectCanva()">Conectar Canva</button>
      </div>
    `;
  }

  function renderMetaCard() {
    if (state.meta?.connected) {
      return `
        <div class="card conn-card">
          <div class="card-icon">📘</div>
          <div class="card-title">Meta</div>
          <div class="conn-info">
            <div>${state.meta.pageCount || 0} páginas conectadas</div>
          </div>
          <button class="btn btn-primary" onclick="app.router('editor')">Crear publicación</button>
        </div>
      `;
    }
    return `
      <div class="card conn-card">
        <div class="card-icon">📘</div>
        <div class="card-title">Meta</div>
        <div class="card-desc">Conecta Meta para publicar en Instagram/Facebook</div>
        <button class="btn btn-primary" onclick="app.connectMeta()">Conectar Meta</button>
      </div>
    `;
  }

  function renderSchedulerCard() {
    return `
      <div class="card conn-card">
        <div class="card-icon">📅</div>
        <div class="card-title">Cola de Publicación</div>
        <div class="card-desc">${state.posts.length} publicaciones en cola</div>
        <button class="btn btn-primary" onclick="app.router('scheduler')">Ver cola</button>
        <button class="btn btn-ghost" onclick="app.router('editor')">Nueva publicación</button>
      </div>
    `;
  }

  function renderGalleryCard() {
    return `
      <div class="card conn-card">
        <div class="card-icon">🖼️</div>
        <div class="card-title">Gallery AI</div>
        <div class="card-desc">${state.assets.length} activos guardados</div>
        <button class="btn btn-primary" onclick="app.router('gallery')">Ver galería</button>
      </div>
    `;
  }

  function renderAIChatCard() {
    return `
      <div class="card conn-card">
        <div class="card-icon">🤖</div>
        <div class="card-title">Auto-descripción</div>
        <div class="card-desc">Genera descripciones con IA</div>
        <button class="btn btn-primary" onclick="app.openAIChat()">Abrir chat IA</button>
      </div>
    `;
  }

  function renderSettingsCard() {
    return `
      <div class="card conn-card">
        <div class="card-icon">⚙️</div>
        <div class="card-title">Configuración</div>
        <div class="card-desc">Ajustes de la aplicación</div>
        <button class="btn btn-ghost" onclick="app.showSettings()">Abrir</button>
      </div>
    `;
  }

  function attachHomeEvents() {}

  async function connectTiendanube() {
    try {
      const health = await api.get('/tiendanube/health');
      if (health?.success && health.status === 'ok') {
        state.tiendanube = { connected: true, store_url: health.store_url, lastSync: 'Ahora' };
        saveToLocalStorage();
        updateStatusDots();
        showToast('Tiendanube conectado', 'success');
        renderHome();
      } else {
        showToast('Error conectando Tiendanube: ' + (health?.error || 'Configuración incorrecta'), 'error');
      }
    } catch (err) {
      showToast('Error de conexión: ' + err.message, 'error');
    }
  }

  async function syncTiendanube() {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Sincronizando...';
    try {
      const res = await api.post('/tiendanube/sync', { limit: 50 });
      if (res?.success) {
        state.tiendanube.lastSync = new Date().toLocaleTimeString();
        saveToLocalStorage();
        showToast(`Sincronizados ${res.synced} productos`, 'success');
      }
    } catch (err) {
      showToast('Error en sync: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sincronizar';
    }
  }

  async function connectCanva() {
    try {
      const res = await api.get('/canva/templates');
      if (res?.success) {
        state.canva = { connected: true, templateCount: res.templates?.length || 0, lastUsed: new Date().toLocaleTimeString() };
        saveToLocalStorage();
        showToast('Canva conectado', 'success');
        renderHome();
      } else {
        showToast('Error conectando Canva: ' + (res?.error || 'No autenticado'), 'error');
      }
    } catch (err) {
      showToast('Error de conexión: ' + err.message, 'error');
    }
  }

  async function connectMeta() {
    try {
      const res = await api.get('/oauth/meta/status');
      if (res?.success) {
        state.meta = { connected: true, pageCount: res.pages?.length || 0 };
        saveToLocalStorage();
        showToast('Meta conectado', 'success');
        renderHome();
      } else {
        showToast('Error conectando Meta: ' + (res?.error || 'No autenticado'), 'error');
      }
    } catch (err) {
      showToast('Error de conexión: ' + err.message, 'error');
    }
  }

  async function renderTiendanube() {
    const c = document.getElementById('app-content');
    c.innerHTML = `
      <div class="section-header">
        <h1 class="section-title">Tiendanube</h1>
        <p class="section-sub">Productos y sincronización</p>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr></thead>
          <tbody id="products-table"><tr><td colspan="4" class="loading"><div class="spinner"></div></td></tr></tbody>
        </table>
      </div>
      <div class="mt-16">
        <button class="btn btn-primary" onclick="app.syncTiendanube()">Sincronizar</button>
        <button class="btn btn-ghost" onclick="app.loadImageFeed()">Extraer URLs de imágenes</button>
      </div>
      <div id="image-feed-result" style="margin-top:20px;display:none;">
        <div class="form-label">URLs de imágenes:</div>
        <textarea class="scrollable" id="image-urls-text" readonly></textarea>
      </div>
    `;
    loadProducts();
  }

  async function loadProducts() {
    try {
      const res = await api.get('/tiendanube/products?limit=20');
      if (res?.success) {
        state.products = res.products || [];
        renderProductsTable();
      }
    } catch (err) {
      showToast('Error cargando productos: ' + err.message, 'error');
    }
  }

  function renderProductsTable() {
    const tbody = document.getElementById('products-table');
    if (!state.products.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty">No hay productos. Haz click en Sincronizar.</td></tr>';
      return;
    }
    tbody.innerHTML = state.products.map(p => `
      <tr>
        <td><img src="${p.image?.src || 'https://via.placeholder.com/50'}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;"></td>
        <td>${p.name}</td>
        <td>$${p.price}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="app.useProduct('${p.id}')">Usar</button></td>
      </tr>
    `).join('');
  }

  async function loadImageFeed() {
    const resultDiv = document.getElementById('image-feed-result');
    const textarea = document.getElementById('image-urls-text');
    try {
      const res = await api.get('/tiendanube/images/feed?limit=100');
      if (res?.success && res.imageUrls?.length) {
        textarea.value = res.imageUrls.join('\n');
        resultDiv.style.display = 'block';
      } else {
        textarea.value = 'No se encontraron imágenes en el feed.';
        resultDiv.style.display = 'block';
      }
    } catch (err) {
      showToast('Error cargando imágenes: ' + err.message, 'error');
    }
  }

  function useProduct(id) {
    const product = state.products.find(p => p.id == id);
    if (product) {
      router('editor');
      setTimeout(() => {
        document.getElementById('post-content').value = `Producto: ${product.name}\nPrecio: $${product.price}`;
        if (product.image?.src) {
          document.getElementById('post-media').value = product.image.src;
        }
      }, 100);
    }
  }

  async function renderCanva() {
    const c = document.getElementById('app-content');
    c.innerHTML = `
      <div class="section-header">
        <h1 class="section-title">Canva</h1>
        <p class="section-sub">Plantillas y activos</p>
      </div>
      <div class="thumbs-grid" id="templates-grid">
        <div class="loading"><div class="spinner"></div></div>
      </div>
      <hr class="divider">
      <h3 style="margin:16px 0 8px;">Crear diseño</h3>
      <div class="form-group">
        <input type="text" id="design-title" class="form-input" placeholder="Título del diseño">
      </div>
      <button class="btn btn-primary" onclick="app.createDesign()">Crear</button>
      <h3 style="margin:24px 0 8px;">Activos guardados</h3>
      <div class="thumbs-grid" id="assets-grid">
        <div class="loading"><div class="spinner"></div></div>
      </div>
    `;
    loadTemplates();
    loadAssets();
  }

  async function loadTemplates() {
    try {
      const res = await api.get('/canva/templates');
      const grid = document.getElementById('templates-grid');
      if (res?.success && res.templates?.length) {
        grid.innerHTML = res.templates.slice(0, 8).map(t => `
          <div class="thumb"><img src="${t.thumbnail?.url || 'https://via.placeholder.com/100'}" title="${t.name}" onclick="app.useTemplate('${t.id}')"></div>
        `).join('');
      } else {
        grid.innerHTML = '<div class="empty">No hay plantillas</div>';
      }
    } catch (err) {
      document.getElementById('templates-grid').innerHTML = '<div class="empty">Error cargando plantillas</div>';
    }
  }

  async function loadAssets() {
    try {
      const res = await api.get('/canva/assets');
      const grid = document.getElementById('assets-grid');
      if (res?.success && res.assets?.length) {
        state.assets = res.assets;
        grid.innerHTML = res.assets.slice(0, 12).map(a => `
          <div class="thumb"><img src="${a.url}" onclick="app.openLightbox('${a.url}')"></div>
        `).join('');
      } else {
        grid.innerHTML = '<div class="empty">No hay activos</div>';
      }
    } catch (err) {
      document.getElementById('assets-grid').innerHTML = '<div class="empty">Error cargando activos</div>';
    }
  }

  function useTemplate(id) {
    showToast('Plantilla seleccionada: ' + id, 'info');
  }

  function createDesign() {
    showToast('Crear diseño (funcionalidad próxima)', 'info');
  }

  async function renderScheduler() {
    const c = document.getElementById('app-content');
    c.innerHTML = `
      <div class="section-header">
        <h1 class="section-title">Cola de Publicación</h1>
        <p class="section-sub">Publicaciones programadas y borradores</p>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Contenido</th><th>Estado</th><th>Programado</th><th>Acciones</th></tr></thead>
          <tbody id="posts-table">
            ${state.posts.map(p => `
              <tr>
                <td>${p.content?.substring(0, 40) || ''}...</td>
                <td><span class="tag tag-${p.status === 'published' ? 'ok' : p.status === 'draft' ? 'pend' : 'ign'}">${p.status}</span></td>
                <td>${p.scheduledAt || '-'}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="app.previewPost('${p.id}')">Preview</button>
                  <button class="btn btn-primary btn-sm" onclick="app.publishPost('${p.id}')">Publicar</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="4" class="empty">No hay publicaciones. Crea una nueva.</td></tr>'}
          </tbody>
        </table>
      </div>
      <button class="btn btn-primary mt-16" onclick="app.router('editor')">Nueva publicación</button>
    `;
  }

  async function renderGallery() {
    const c = document.getElementById('app-content');
    c.innerHTML = `
      <div class="section-header">
        <h1 class="section-title">Gallery AI</h1>
        <p class="section-sub">Activos y publicaciones</p>
      </div>
      <div class="thumbs-grid" id="gallery-grid">
        <div class="loading"><div class="spinner"></div></div>
      </div>
    `;
    loadGallery();
  }

  async function loadGallery() {
    try {
      const [assetsRes, postsRes] = await Promise.all([
        api.get('/canva/assets'),
        api.get('/scheduler/queue')
      ]);
      const grid = document.getElementById('gallery-grid');
      let items = [];
      if (assetsRes?.success) items = [...items, ...(assetsRes.assets || [])];
      if (postsRes?.success) items = [...items, ...(postsRes.posts || [])];
      if (items.length) {
        grid.innerHTML = items.map(item => `
          <div class="thumb"><img src="${item.url || item.image}" onclick="app.openLightbox('${item.url || item.image}')" title="${item.name || item.content?.substring(0, 30)}"></div>
        `).join('');
      } else {
        grid.innerHTML = '<div class="empty">No hay imágenes en la galería</div>';
      }
    } catch (err) {
      document.getElementById('gallery-grid').innerHTML = '<div class="empty">Error cargando galería</div>';
    }
  }

  function openLightbox(url) {
    const backdrop = document.getElementById('lightboxBackdrop');
    const body = document.getElementById('lightboxBody');
    body.innerHTML = `<img src="${url}" style="max-width:90vw;max-height:80vh;border-radius:8px;">`;
    backdrop.style.display = 'flex';
  }

  function closePanel() {
    document.getElementById('panelOverlay').classList.remove('open');
  }

  async function renderPostEditor() {
    const c = document.getElementById('app-content');
    c.innerHTML = `
      <div class="section-header">
        <h1 class="section-title">Editor de Post</h1>
        <p class="section-sub">Crea y programa publicaciones</p>
      </div>
      <div class="form-group">
        <label class="form-label">Contenido</label>
        <textarea class="form-textarea" id="post-content" placeholder="Escribe tu publicación..."></textarea>
        <button class="btn btn-ghost btn-sm mt-8" onclick="app.getAISuggestions()">Sugerencias IA</button>
      </div>
      <div class="form-group">
        <label class="form-label">URL de imagen</label>
        <input type="text" class="form-input" id="post-media" placeholder="https://...">
      </div>
      <div class="form-group">
        <label class="form-label">Plataforma</label>
        <div class="pill-group">
          <span class="pill active" data-platform="instagram">Instagram</span>
          <span class="pill" data-platform="facebook">Facebook</span>
          <span class="pill" data-platform="both">Ambos</span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Fecha y hora</label>
        <input type="datetime-local" class="form-input" id="post-schedule">
      </div>
      <div class="flex gap-12 mt-16">
        <button class="btn btn-ghost" onclick="app.saveDraft()">Guardar borrador</button>
        <button class="btn btn-success" onclick="app.publishNow()">Publicar ahora</button>
        <button class="btn btn-primary" onclick="app.schedulePost()">Programar</button>
      </div>
    `;
    attachPillEvents();
  }

  function attachPillEvents() {
    document.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  async function getAISuggestions() {
    const content = document.getElementById('post-content').value;
    const platform = document.querySelector('.pill.active')?.dataset?.platform || 'instagram';
    try {
      const res = await api.post('/ai/suggest', { productName: content, platform });
      if (res?.success && res.suggestions) {
        document.getElementById('post-content').value = res.suggestions.caption || content;
        showToast('Sugerencias aplicadas', 'success');
      }
    } catch (err) {
      showToast('Error en IA: ' + err.message, 'error');
    }
  }

  function saveDraft() {
    const post = {
      id: Date.now().toString(),
      content: document.getElementById('post-content').value,
      media: document.getElementById('post-media').value,
      platform: document.querySelector('.pill.active')?.dataset?.platform || 'instagram',
      status: 'draft',
      scheduledAt: null
    };
    state.posts.push(post);
    saveToLocalStorage();
    showToast('Borrador guardado', 'success');
  }

  async function publishNow() {
    const post = {
      content: document.getElementById('post-content').value,
      media: document.getElementById('post-media').value,
      platform: document.querySelector('.pill.active')?.dataset?.platform || 'instagram'
    };
    try {
      const res = await api.post('/scheduler/publish-now', post);
      if (res?.success) {
        showToast('Publicado correctamente', 'success');
        router('scheduler');
      } else {
        showToast('Error al publicar: ' + (res?.error || 'Error'), 'error');
      }
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  }

  async function schedulePost() {
    const post = {
      content: document.getElementById('post-content').value,
      media: document.getElementById('post-media').value,
      platform: document.querySelector('.pill.active')?.dataset?.platform || 'instagram',
      scheduledAt: document.getElementById('post-schedule').value
    };
    try {
      const res = await api.post('/scheduler/schedule', post);
      if (res?.success) {
        showToast('Publicación programada', 'success');
        router('scheduler');
      }
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  }

  async function renderMetaPreview() {
    const c = document.getElementById('app-content');
    c.innerHTML = `
      <div class="section-header">
        <h1 class="section-title">Meta Preview</h1>
        <p class="section-sub">Vista previa de publicaciones</p>
      </div>
      <div class="flex gap-16" style="flex-wrap:wrap;">
        <div class="preview-frame preview-ig-feed">
          <img src="https://via.placeholder.com/320x320" style="width:100%;">
          <div style="padding:12px;">
            <div style="font-weight:600;">@usuario</div>
            <div style="font-size:.85rem;margin:8px 0;">Tu publicación aquí</div>
            <div style="color:var(--text-dim);font-size:.8rem;">❤️ 42  💬 5</div>
          </div>
        </div>
        <div class="preview-frame preview-facebook">
          <div style="padding:12px;border-bottom:1px solid var(--border);">
            <div style="font-weight:600;">Página de la tienda</div>
          </div>
          <img src="https://via.placeholder.com/460x260" style="width:100%;">
          <div style="padding:12px;">
            <div style="margin-bottom:8px;">Tu publicación en Facebook</div>
            <div style="color:var(--text-dim);font-size:.8rem;">👍 24  💬 3</div>
          </div>
        </div>
      </div>
    `;
  }

  async function renderCalendar() {
    const c = document.getElementById('app-content');
    c.innerHTML = `
      <div class="section-header">
        <h1 class="section-title">Calendario</h1>
        <p class="section-sub">Publicaciones programadas</p>
      </div>
      <div class="empty">
        <div class="empty-icon">📆</div>
        Calendario próximamente
      </div>
    `;
  }

  async function openAIChat() {
    const overlay = document.getElementById('chat-overlay') || createChatOverlay();
    overlay.classList.add('open');
  }

  function createChatOverlay() {
    const div = document.createElement('div');
    div.id = 'chat-overlay';
    div.className = 'chat-overlay';
    div.innerHTML = `
      <div class="chat-header">
        <span>🤖 Asistente IA</span>
        <button class="btn btn-ghost btn-sm" onclick="app.closeChat()">✕</button>
      </div>
      <div class="chat-body" id="chat-body"></div>
      <div class="chat-input-area">
        <input type="text" id="chat-input" class="form-input" placeholder="Escribe un mensaje..." style="flex:1;">
        <button class="btn btn-primary btn-sm" onclick="app.sendChat()">Enviar</button>
      </div>
    `;
    document.body.appendChild(div);
    return div;
  }

  function closeChat() {
    document.getElementById('chat-overlay')?.classList.remove('open');
  }

  async function sendChat() {
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    const msg = input.value.trim();
    if (!msg) return;
    body.innerHTML += `<div class="chat-msg user">${msg}</div>`;
    input.value = '';
    try {
      const res = await api.post('/ai/chat', { message: msg });
      const reply = res?.response || res?.message || 'Sin respuesta';
      body.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
      body.scrollTop = body.scrollHeight;
    } catch (err) {
      body.innerHTML += `<div class="chat-msg bot">Error: ${err.message}</div>`;
    }
  }

  function showSettings() {
    showToast('Configuración (próximamente)', 'info');
  }

  function updateStatusDots() {
    document.getElementById('dot-tn').className = 'dot ' + (state.tiendanube?.connected ? 'green' : 'red');
    document.getElementById('dot-cv').className = 'dot ' + (state.canva?.connected ? 'green' : 'red');
    document.getElementById('dot-meta').className = 'dot ' + (state.meta?.connected ? 'green' : 'red');
  }

  function init() {
    loadFromLocalStorage();
    router('home');
    updateStatusDots();

    document.getElementById('toggleSidebar').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });

    document.querySelectorAll('.sidebar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        router(btn.dataset.section);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    router,
    connectTiendanube,
    connectCanva,
    connectMeta,
    syncTiendanube,
    loadImageFeed,
    openLightbox,
    closeLightbox,
    getAISuggestions,
    saveDraft,
    publishNow,
    schedulePost,
    openAIChat,
    closeChat,
    sendChat,
    showSettings,
    renderHome,
    renderTiendanube,
    renderCanva,
    renderScheduler,
    renderGallery,
    renderPostEditor,
    renderMetaPreview,
    renderCalendar,
    state,
    loadGallery,
    loadProducts
  };
})();