import React from "react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

export default function Dashboard({ user }) {
  return (
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Bienvenido, {user.displayName}</h1>
      <ProductForm />
      <ProductList />
    </div>
  );
}
