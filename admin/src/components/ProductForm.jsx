import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const saveProduct = async () => {
    let imageUrl = "";

    if (file) {
      const storageRef = ref(storage, "products/" + file.name);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "products"), {
      name,
      price,
      imageUrl
    });

    alert("Producto guardado");
  };

  return (
    <div class="mb-6">
      <input class="border p-2 mr-2" placeholder="Nombre" onChange={(e) => setName(e.target.value)} />
      <input class="border p-2 mr-2" placeholder="Precio" onChange={(e) => setPrice(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button class="bg-green-600 text-white px-4 py-2 ml-2" onClick={saveProduct}>
        Guardar
      </button>
    </div>
  );
}
