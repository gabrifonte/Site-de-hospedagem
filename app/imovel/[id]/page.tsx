"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Imovel = {
  id: number;
  titulo: string;
  cidade: string;
  preco: number;
  foto: string;
  descricao: string;
};

export default function ImovelDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ titulo: "", cidade: "", preco: "", foto: "", descricao: "" });
  useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from("imoveis").select("*").eq("id", params.id).single();
      if (data) {
        setImovel(data);
        setForm({ titulo: data.titulo, cidade: data.cidade, preco: data.preco, foto: data.foto, descricao: data.descricao || "" });
      }
    }
    buscar();
  }, [params.id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSalvar() {
    const { error } = await supabase.from("imoveis").update({
      titulo: form.titulo,
      cidade: form.cidade,
      preco: Number(form.preco),
      foto: form.foto,
      descricao: form.descricao,
    }).eq("id", params.id);
    if (error) { alert("Erro ao salvar: " + error.message); return; }
    alert("Imovel atualizado!");
    setEditando(false);
    router.refresh();
  }

  async function handleExcluir() {
    if (!confirm("Tem certeza que quer excluir?")) return;
    const { error } = await supabase.from("imoveis").delete().eq("id", params.id);
    if (error) { alert("Erro ao excluir: " + error.message); return; }
    alert("Imovel excluido!");
    router.push("/");
  }

  if (!imovel) return <p className="p-10 text-gray-400">Carregando...</p>;
  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-10 py-4 border-b shadow-sm sticky top-0 bg-white z-10">
        <a href="/" className="text-red-500 font-bold text-2xl">airbnb</a>
        <div className="flex gap-2">
          <button onClick={() => setEditando(!editando)} className="border rounded-full px-4 py-2 text-sm font-medium hover:shadow-md">
            {editando ? "Cancelar" : "Editar"}
          </button>
          <button onClick={handleExcluir} className="bg-red-500 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600">
            Excluir
          </button>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {editando ? (
          <div className="flex flex-col gap-4 max-w-xl">
            <h2 className="text-2xl font-bold">Editar imovel</h2>
            <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Titulo" className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            <input name="preco" value={form.preco} onChange={handleChange} placeholder="Preco" type="number" className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            <input name="foto" value={form.foto} onChange={handleChange} placeholder="URL da foto" className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descricao" rows={4} className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            <button onClick={handleSalvar} className="bg-red-500 text-white rounded-xl py-3 font-semibold hover:bg-red-600 transition">
              Salvar alteracoes
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">{imovel.titulo}</h1>
            <p className="text-gray-500 mb-4">{imovel.cidade}</p>
            <div className="rounded-2xl overflow-hidden h-96 mb-8">
              <img src={imovel.foto} alt={imovel.titulo} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold mb-2">Sobre o imovel</h2>
                <p className="text-gray-600 leading-relaxed">{imovel.descricao || "Sem descricao."}</p>
              </div>
              <div className="border rounded-2xl p-6 shadow-md h-fit">
                <p className="text-2xl font-bold mb-1">R$ {imovel.preco} <span className="text-base font-normal text-gray-500">/ noite</span></p>
                <button className="w-full bg-red-500 text-white rounded-xl py-3 font-semibold hover:bg-red-600 transition mt-4">
                  Reservar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}