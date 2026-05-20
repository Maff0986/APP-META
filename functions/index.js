const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require("firebase-functions/v2/firestore");

const { metaWebhook } = require("./meta/webhook");
const { syncCreate, syncUpdate, syncDelete } = require("./meta/sync");

exports.helloWorld = onRequest((req, res) => {
  res.send("Firebase Functions funcionando correctamente.");
});

exports.metaWebhook = onRequest(metaWebhook);

exports.onProductCreate = onDocumentCreated("products/{id}", (event) => syncCreate(event.data));
exports.onProductUpdate = onDocumentUpdated("products/{id}", (event) => syncUpdate(event.data));
exports.onProductDelete = onDocumentDeleted("products/{id}", (event) => syncDelete(event.data));
