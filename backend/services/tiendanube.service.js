const axios = require("axios");
const { createRequire } = require("module");
const requireModel = createRequire(__filename);
const Product = requireModel("../models/Product.js").default;

const TIENDANUBE_BASE = (process.env.TIENDANUBE_STORE_URL || "").replace(/\/+$/, "");
const TIENDANUBE_TOKEN = process.env.TIENDANUBE_API_TOKEN || "";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${TIENDANUBE_TOKEN}`,
  "Content-Type": "application/json",
});

const buildUrl = (path = "") => `${TIENDANUBE_BASE}/api/v1/${path}`;

function mapProduct(r) {
  const img = Array.isArray(r.images) ? r.images : [];
  return {
    id: r.id,
    name: r.name || "",
    description: r.description || "",
    price: r.price || 0,
    images: img.map((i) => ({ src: i.src || i.url || "" })),
    handle: r.handle || "",
    published_at: r.published_at || null,
  };
}

async function fetchProducts({ limit = 50, page = 1 } = {}) {
  const all = [];
  let currentPage = page;
  let fetched = true;
  while (fetched) {
    const { data } = await axios.get(buildUrl("products"), {
      headers: getAuthHeaders(),
      params: { limit, page: currentPage },
    });
    const items = Array.isArray(data) ? data : (data.products || data.data || []);
    all.push(...items.map(mapProduct));
    fetched = items.length === limit;
    currentPage++;
  }
  return all;
}

async function fetchProductById(productId) {
  const { data } = await axios.get(buildUrl(`products/${productId}`), {
    headers: getAuthHeaders(),
  });
  return mapProduct(data);
}

async function syncProducts({ limit = 50 } = {}) {
  const products = await fetchProducts({ limit });
  let synced = 0;
  const errors = [];
  for (const p of products) {
    try {
      const tiendaId = p.id;
      const payload = {
        tiendanubeId: tiendaId,
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.images?.[0]?.src || null,
        url: `${TIENDANUBE_BASE}/productos/${p.handle || p.id}`,
        synced: true,
      };
      await Product.upsert(payload, { fields: ["name", "description", "price", "imageUrl", "url", "synced"] });
      synced++;
    } catch (err) {
      errors.push({ id: p.id, error: err.message });
    }
  }
  return { synced, errors };
}

function extractImageUrls(products) {
  const urls = [];
  for (const p of products) {
    if (Array.isArray(p.images)) {
      for (const img of p.images) {
        const src = img.src || img.url;
        if (src) urls.push(src);
      }
    }
  }
  return urls;
}

async function getFeedImageUrls(options = {}) {
  const { limit = 100, publishedOnly = true } = options;
  let products;
  try {
    products = await fetchProducts({ limit: limit * 2 });
  } catch {
    products = [];
  }
  if (publishedOnly) {
    products = products.filter((p) => p.published_at);
  }
  const urls = extractImageUrls(products);
  const unique = [...new Set(urls)].slice(0, limit);
  return unique;
}

module.exports = {
  fetchProducts,
  fetchProductById,
  syncProducts,
  extractImageUrls,
  getFeedImageUrls,
};
