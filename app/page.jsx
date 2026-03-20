"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function App() {
  const [ingredientes, setIngredientes] = useState([]);
  const [embalagens, setEmbalagens] = useState([]);
  const [horas, setHoras] = useState(0);
  const [valorHora, setValorHora] = useState(0);
  const [transporte, setTransporte] = useState(0);
  const [quantidadeProducao, setQuantidadeProducao] = useState(1);
  const [lucro, setLucro] = useState(50);
  const [nomeReceita, setNomeReceita] = useState("");

  // 💾 FUNÇÃO PARA SALVAR
  const salvarDados = () => {
    const dados = {
      nomeReceita,
      ingredientes,
      embalagens,
      horas,
      valorHora,
      transporte,
      quantidadeProducao,
      lucro
    };
    localStorage.setItem("@Calculadora:Receita", JSON.stringify(dados));
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 🌈 Paleta de cores para o gráfico
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function App() {
  const [ingredientes, setIngredientes] = useState([]);
  const [embalagens, setEmbalagens] = useState([]);
  const [horas, setHoras] = useState(0);
  const [valorHora, setValorHora] = useState(0);
  const [transporte, setTransporte] = useState(0);
  const [quantidadeProducao, setQuantidadeProducao] = useState(1);
  const [lucro, setLucro] = useState(50);
  const [nomeReceita, setNomeReceita] = useState("");

  const unidades = ["g", "kg", "ml", "L", "un"];

  // 💾 Função para Salvar no Navegador
  const salvarDados = () => {
    const dados = {
      nomeReceita, ingredientes, embalagens, horas, 
      valorHora, transporte, quantidadeProducao, lucro
    };
    localStorage.setItem("@Calculadora:Dados", JSON.stringify(dados));
    alert("Dados salvos com sucesso!");
  };

  // 📂 Função para Carregar do Navegador
  const carregarDados = () => {
    const salvo = localStorage.getItem("@Calculadora:Dados");
    if (salvo) {
      const d = JSON.parse(salvo);
      setNomeReceita(d.nomeReceita || "");
      setIngredientes(d.ingredientes || []);
      setEmbalagens(d.embalagens || []);
      setHoras(d.horas || 0);
      setValorHora(d.valorHora || 0);
      setTransporte(d.transporte || 0);
      setQuantidadeProducao(d.quantidadeProducao || 1);
      setLucro(d.lucro || 50);
      alert("Dados carregados!");
    } else {
      alert("Nenhum dado salvo encontrado.");
    }
  };

  const adicionarIngrediente = () => {
    setIngredientes([...ingredientes, { nome: "", quantidade: 0, unidade: "g", precoCompra: 0, quantidadeCompra: 1 }]);
  };

  const adicionarEmbalagem = () => {
    setEmbalagens([...embalagens, { nome: "", quantidade: 0, valorUnitario: 0 }]);
  };

  const atualizar = (lista, setLista, index, campo, valor) => {
    const nova = [...lista];
    nova[index][campo] = valor;
    setLista(nova);
  };

  // Lógica de Cálculos
  const custoIngredientes = ingredientes.reduce((t, i) => {
    const custoUnitarioReal = i.quantidadeCompra > 0 ? i.precoCompra / i.quantidadeCompra : 0;
    return t + (i.quantidade * custoUnitarioReal);
  }, 0);

  const custoEmbalagens = embalagens.reduce((t, e) => t + (e.quantidade * e.valorUnitario), 0);
  const maoDeObra = horas * valorHora;
  const custoTotal = custoIngredientes + custoEmbalagens + maoDeObra + Number(transporte);
  const custoUnitario = quantidadeProducao > 0 ? custoTotal / quantidadeProducao : 0;
  const precoVenda = custoUnitario * (1 + lucro / 100);

  const dadosGrafico = [
    { name: "Ingredientes", value: custoIngredientes },
    { name: "Embalagens", value: custoEmbalagens },
    { name: "Mão de obra", value: maoDeObra },
    { name: "Transporte", value: Number(transporte) }
  ].filter(item => item.value > 0);

  return (
    <div className="p-6 grid gap-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Sistema Profissional de Custos</h1>

      {/* HEADER */}
      <Card className="bg-slate-50">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <label className="text-xs font-bold uppercase text-slate-500">Nome da Receita</label>
            <Input value={nomeReceita} onChange={(e) => setNomeReceita(e.target.value)} className="h-9 bg-white" />
          </div>
          <div className="flex gap-2 items-end md:col-span-2">
            <Button onClick={salvarDados} className="flex-1 h-9 bg-green-600 hover:bg-green-700">Salvar</Button>
            <Button onClick={carregarDados} variant="outline" className="flex-1 h-9 border-green-600 text-green-700">Carregar</Button>
          </div>
        </CardContent>
      </Card>

      {/* INGREDIENTES */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">Ingredientes</h2>
          {ingredientes.map((item, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 mb-2 items-center">
              <Input placeholder="Nome" value={item.nome} className="h-8 text-xs" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "nome", e.target.value)} />
              <Input type="number" placeholder="Qtd" value={item.quantidade} className="h-8 text-xs" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "quantidade", Number(e.target.value))} />
              <select value={item.unidade} className="h-8 border rounded px-1 text-xs" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "unidade", e.target.value)}>
                {unidades.map((u) => <option key={u}>{u}</option>)}
              </select>
              <Input type="number" placeholder="Qtd Compra" value={item.quantidadeCompra} className="h-8 text-xs" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "quantidadeCompra", Number(e.target.value))} />
              <Input type="number" placeholder="Preço" value={item.precoCompra} className="h-8 text-xs" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "precoCompra", Number(e.target.value))} />
              <div className="text-xs font-bold">R$ {(item.quantidade * (item.precoCompra / (item.quantidadeCompra || 1))).toFixed(2)}</div>
            </div>
          ))}
          <Button onClick={adicionarIngrediente} variant="ghost" className="h-8 text-xs mt-2">+ Adicionar</Button>
        </CardContent>
      </Card>

      {/* RESULTADO E GRÁFICO */}
      <Card className="bg-slate-900 text-white shadow-xl">
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2 text-green-400">Resumo Final</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Custo Total:</span> <span>R$ {custoTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-2xl font-bold text-white pt-4">
                <span>Preço de Venda:</span> <span>R$ {precoVenda.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dadosGrafico} dataKey="value" nameKey="name" outerRadius={60}>
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{color: '#000'}} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
