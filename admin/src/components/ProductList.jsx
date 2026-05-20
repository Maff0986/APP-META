import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <h2 class="text-xl font-bold mb-2">Productos</h2>
      {products.map((p) => (
        <div key={p.id} class="border p-3 mb-2">
          <p><strong>{p.name}</strong></p>
          <p>${p.price}</p>
          {p.imageUrl && <img src={p.imageUrl} class="w-32" />}
        </div>
      ))}
    </div>
  );
}
