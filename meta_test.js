// ===============================
//  CONFIGURACIÓN REAL DE MARCO
// ===============================

const ACCESS_TOKEN = "EAAM3ryPsYaIBQ4tT6o6PTuaIOnIc2FvxFoClDyB6BjTiyGxxO69EpeSgdgrJZBQZAiWyzXicaZCRO8cbmVwnLnQHU5nrYNlxYxzZCth7HnxVbESWxLnel4f8r1ZBZCToXSviCZApbZCh7R2hYgT5oVIJPxwYd0ZAeD5a4aoZC9NNomAm3CQT2Ksksrj4fRZBSdckg6xKuXOy0nnfBZCjuOwZB2p4RZC4TohIw2aoneJAZDZD";

// ===============================
//  IMPORTAR FETCH EN NODE 22
// ===============================
async function fetchURL(url) {
  const { default: fetch } = await import("node-fetch");
  return fetch(url).then(r => r.json());
}

// ===============================
//  FUNCIONES
// ===============================

async function getMe() {
  return fetchURL(`https://graph.facebook.com/v25.0/me?fields=id,name&access_token=${ACCESS_TOKEN}`);
}

async function getPages() {
  return fetchURL(`https://graph.facebook.com/v25.0/me/accounts?access_token=${ACCESS_TOKEN}`);
}

async function getBusinesses() {
  return fetchURL(`https://graph.facebook.com/v25.0/me/businesses?access_token=${ACCESS_TOKEN}`);
}

async function getCatalogs() {
  return fetchURL(`https://graph.facebook.com/v25.0/me?fields=businesses{owned_product_catalogs}&access_token=${ACCESS_TOKEN}`);
}

// ===============================
//  EJECUCIÓN PRINCIPAL
// ===============================

(async () => {
  console.log("\n===============================");
  console.log("  INFORMACIÓN DEL USUARIO");
  console.log("===============================\n");
  console.log(await getMe());

  console.log("\n===============================");
  console.log("  PÁGINAS CONECTADAS");
  console.log("===============================\n");
  console.log(await getPages());

  console.log("\n===============================");
  console.log("  BUSINESS MANAGER");
  console.log("===============================\n");
  console.log(await getBusinesses());

  console.log("\n===============================");
  console.log("  CATÁLOGOS DISPONIBLES");
  console.log("===============================\n");
  console.log(await getCatalogs());
})();
