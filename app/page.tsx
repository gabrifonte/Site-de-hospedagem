"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Imovel = {
  id: number;
  titulo: string;
  cidade: string;
  preco: number;
  foto: string;
};

export default function Home() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);

  useEffect(() => {
    async function buscarImoveis() {
      const { data } = await supabase.from("imoveis").select("*");
      if (data) setImoveis(data);
    }
    buscarImoveis();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-10 py-4 border-b shadow-sm sticky top-0 bg-white z-10">
        <h1 className="text-red-500 font-bold text-2xl">airbnb</h1>
        <input type="text" placeholder="Buscar destino..." className="border rounded-full px-6 py-2 text-sm w-72 shadow-sm focus:outline-none" />
        <a href="/novo" className="border rounded-full px-4 py-2 text-sm font-medium hover:shadow-md">
          + Anunciar imovel
        </a>
      </nav>
      <section className="px-10 py-8 grid grid-cols-4 gap-6">
        {imoveis.length === 0 && (
          <p className="text-gray-400 col-span-4 text-center mt-20">Nenhum imovel cadastrado ainda.</p>
        )}
        {imoveis.map((imovel) => (
          <a key={imovel.id} href={`/imovel/${imovel.id}`} className="cursor-pointer group">
            <div className="rounded-xl overflow-hidden h-48 mb-2">
              <img src={imovel.foto} alt={imovel.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="font-semibold">{imovel.titulo}</p>
            <p className="text-gray-500 text-sm">{imovel.cidade}</p>
            <p className="font-semibold mt-1">R$ {imovel.preco} <span className="font-normal text-gray-500">/ noite</span></p>
          </a>
        ))}
      </section>
    </main>
  );
}
