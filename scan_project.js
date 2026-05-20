// ===============================================
//  SCAN LIMITADO DEL PROYECTO APP_META
//  Solo estructura base + archivos clave
// ===============================================

const fs = require("fs");
const path = require("path");

// Ruta del proyecto
const ROOT = "C:/Users/HP-Home/Documents/Projectos_Rosalia/App_Meta";

// Archivos que SÍ queremos imprimir
const TARGET_FILES = [
  "firebase.json",
  ".firebaserc",
  "package.json",
  "meta_test.js",
  "scan_project.js",
  "README.md"
];

// Carpetas que SÍ queremos revisar
const TARGET_FOLDERS = [
  "functions",
  "scripts",
  "src",
  "config"
];

// ===============================================
//  IMPRIMIR ESTRUCTURA BASE
// ===============================================
function printBaseStructure(dir) {
  console.log("\n===============================");
  console.log("📁 ESTRUCTURA BASE DEL PROYECTO");
  console.log("===============================\n");

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory() && TARGET_FOLDERS.includes(item)) {
      console.log("📁 " + item);
      const sub = fs.readdirSync(fullPath);
      sub.forEach(s => console.log("   └── " + s));
    }

    if (stats.isFile() && TARGET_FILES.includes(item)) {
      console.log("📄 " + item);
    }
  }
}

// ===============================================
//  IMPRIMIR CONTENIDO DE ARCHIVOS CLAVE
// ===============================================
function printTargetFiles(dir) {
  console.log("\n===============================");
  console.log("📄 CONTENIDO DE ARCHIVOS CLAVE");
  console.log("===============================\n");

  TARGET_FILES.forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.existsSync(fullPath)) {
      console.log("\n--------------------------------");
      console.log("📄 Archivo:", file);
      console.log("--------------------------------\n");

      try {
        const content = fs.readFileSync(fullPath, "utf8");
        console.log(content);
      } catch {
        console.log("⚠️ No se pudo leer este archivo.");
      }
    }
  });
}

// ===============================================
//  EJECUCIÓN
// ===============================================

printBaseStructure(ROOT);
printTargetFiles(ROOT);

console.log("\n✔ Escaneo completo.\n");
