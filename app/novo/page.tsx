"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NovoImovel() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "",
    cidade: "",
    preco: "",
    foto: "",
    descricao: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    const { error } = await supabase.from("imoveis").insert([
      {
        titulo: form.titulo,
        cidade: form.cidade,
        preco: Number(form.preco),
        foto: form.foto,
        descricao: form.descricao,
      },
    ]);

    if (error) {
      alert("Erro ao cadastrar: " + error.message);
    } else {
      alert("Imóvel cadastrado com sucesso!");
      router.push("/");
    }
  }

  return (
    <main className="min-h-screen bg-white">

      <nav className="flex items-center px-10 py-4 border-b shadow-sm sticky top-0 bg-white z-10">
        <a href="/" className="text-blue-500 font-bold text-2xl">Wanderstay</a>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Anunciar imóvel</h1>

        <div className="flex flex-col gap-4">
          <input
            name="titulo"
            placeholder="Título do imóvel"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            name="cidade"
            placeholder="Cidade"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            name="preco"
            placeholder="Preço por noite (R$)"
            type="number"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            name="foto"
            placeholder="URL da foto"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <textarea
            name="descricao"
            placeholder="Descrição do imóvel"
            onChange={handleChange}
            rows={4}
            className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded-xl py-3 font-semibold hover:bg-blue-600 transition"
          >
            Cadastrar imóvel
          </button>
        </div>
      </div>

    </main>
  );
}