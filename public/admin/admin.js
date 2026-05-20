const firebaseConfig = {
  apiKey: 'AIzaSyDt-B8Uz_LDUAHa26DeufwdDSu4Im_9wJI',
  authDomain: 'appmeta-731da.firebaseapp.com',
  projectId: 'appmeta-731da',
  storageBucket: 'appmeta-731da.appspot.com',
  messagingSenderId: '557112866155',
  appId: '1:557112866155:web:2d289b4babc8630ad4482e',
  measurementId: 'G-PCST06GCB2'
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);
const db = firebase.firestore();
const storage = firebase.storage();

// PROTEGER PANEL
firebase.onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = 'login.html';
  }
});

// CERRAR SESIÓN
function logout() {
  firebase.signOut(auth);
}

// CRUD COMPLETO
async function guardarProducto() {
  const id = document.getElementById("idProducto").value;
  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);
  const categoria = document.getElementById("categoria").value;
  const imagenFile = document.getElementById("imagen").files[0];

  let imagenURL = null;

  if (imagenFile) {
    const ref = storage.ref("productos/" + imagenFile.name);
    await ref.put(imagenFile);
    imagenURL = await ref.getDownloadURL();
  }

  const data = { nombre, precio, stock, categoria, actualizado: new Date() };
  if (imagenURL) data.imagen = imagenURL;

  if (id) {
    await db.collection("productos").doc(id).update(data);
    alert("Producto actualizado");
  } else {
    data.creado = new Date();
    await db.collection("productos").add(data);
    alert("Producto creado");
  }

  limpiarFormulario();
}

db.collection("productos").onSnapshot(snapshot => {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  snapshot.forEach(doc => {
    const p = doc.data();
    lista.innerHTML += 
      <div class='producto'>
        <strong></strong><br>
        Precio: <!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <title>Panel Admin - App Meta</title>

  <script src='https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'></script>
  <script src='https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'></script>
  <script src='https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'></script>
  <script src='https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js'></script>

  <style>
    body { font-family: Arial; padding: 20px; }
    input, button { margin: 5px; padding: 8px; }
    .producto { border: 1px solid #ccc; padding: 10px; margin: 10px 0; }
    .acciones button { margin-right: 10px; }
  </style>
</head>

<body>
  <button onclick='logout()'>Cerrar sesión</button>
  <h1>Panel Admin</h1>

  <h2>Crear / Editar Producto</h2>
  <input id='idProducto' type='hidden'>
  <input id='nombre' placeholder='Nombre'>
  <input id='precio' placeholder='Precio' type='number'>
  <input id='stock' placeholder='Stock' type='number'>
  <input id='categoria' placeholder='Categoría'>
  <input id='imagen' type='file'>
  <button onclick='guardarProducto()'>Guardar</button>
  <button onclick='limpiarFormulario()'>Limpiar</button>

  <h2>Productos</h2>
  <div id='lista'></div>

  <script src='auth.js'></script>
  <script src='admin.js'></script>
</body>
</html>{p.precio}<br>
        Stock: <br>
        Categoría: <br>
        <img src='' width='120'><br>
        <div class='acciones'>
          <button onclick="editarProducto('', '', '', '', '')">Editar</button>
          <button onclick="eliminarProducto('')">Eliminar</button>
        </div>
      </div>
    ;
  });
});

function editarProducto(id, nombre, precio, stock, categoria) {
  document.getElementById("idProducto").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("stock").value = stock;
  document.getElementById("categoria").value = categoria;
  window.scrollTo(0, 0);
}

async function eliminarProducto(id) {
  if (confirm("¿Eliminar este producto?")) {
    await db.collection("productos").doc(id).delete();
    alert("Producto eliminado");
  }
}

function limpiarFormulario() {
  document.getElementById("idProducto").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("imagen").value = "";
}
