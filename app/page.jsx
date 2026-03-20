"use client";

import { useState } from "react";
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

  const unidades = ["g", "kg", "ml", "L", "un"];

  const salvarDados = () => {
    const dados = { nomeReceita, ingredientes, embalagens, horas, valorHora, transporte, quantidadeProducao, lucro };
    localStorage.setItem("@Calculadora:Dados", JSON.stringify(dados));
    alert("Dados salvos com sucesso!");
  };

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
    }
  };

  const adicionarIngrediente = () => setIngredientes([...ingredientes, { nome: "", quantidade: 0, unidade: "g", precoCompra: 0, quantidadeCompra: 1 }]);
  const adicionarEmbalagem = () => setEmbalagens([...embalagens, { nome: "", quantidade: 0, valorUnitario: 0 }]);

  const atualizar = (lista, setLista, index, campo, valor) => {
    const nova = [...lista];
    nova[index][campo] = valor;
    setLista(nova);
  };

  const custoIngredientes = ingredientes.reduce((t, i) => t + (i.quantidade * (i.precoCompra / (i.quantidadeCompra || 1))), 0);
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
    <div className="p-6 grid gap-6 max-w-4xl mx-auto text-slate-900">
      <h1 className="text-3xl font-bold text-center">Sistema Profissional de Custos</h1>

      {/* HEADER */}
      <Card className="bg-slate-50">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <label className="text-xs font-bold uppercase text-slate-500">Nome da Receita</label>
            <Input value={nomeReceita} onChange={(e) => setNomeReceita(e.target.value)} className="h-9 bg-white" />
          </div>
          <div className="flex gap-2 items-end md:col-span-2">
            <Button onClick={salvarDados} className="flex-1 h-9 bg-green-600">Salvar</Button>
            <Button onClick={carregarDados} variant="outline" className="flex-1 h-9 border-green-600">Carregar</Button>
          </div>
        </CardContent>
      </Card>

      {/* INGREDIENTES */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">Ingredientes</h2>
          {ingredientes.map((item, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 mb-2 items-center text-xs">
              <Input placeholder="Nome" value={item.nome} onChange={(e) => atualizar(ingredientes, setIngredientes, i, "nome", e.target.value)} />
              <Input type="number" placeholder="Qtd" value={item.quantidade} onChange={(e) => atualizar(ingredientes, setIngredientes, i, "quantidade", Number(e.target.value))} />
              <select value={item.unidade} className="h-9 border rounded" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "unidade", e.target.value)}>
                {unidades.map(u => <option key={u}>{u}</option>)}
              </select>
              <Input type="number" placeholder="Qtd Compra" value={item.quantidadeCompra} onChange={(e) => atualizar(ingredientes, setIngredientes, i, "quantidadeCompra", Number(e.target.value))} />
              <Input type="number" placeholder="Preço" value={item.precoCompra} onChange={(e) => atualizar(ingredientes, setIngredientes, i, "precoCompra", Number(e.target.value))} />
              <div className="font-bold">R$ {(item.quantidade * (item.precoCompra / (item.quantidadeCompra || 1))).toFixed(2)}</div>
            </div>
          ))}
          <Button onClick={adicionarIngrediente} variant="ghost" className="text-xs mt-2">+ Ingrediente</Button>
        </CardContent>
      </Card>

      {/* EMBALAGENS - RESTAURADO */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">Embalagens</h2>
          {embalagens.map((item, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-2 items-center text-xs">
              <Input placeholder="Nome" value={item.nome} onChange={(e) => atualizar(embalagens, setEmbalagens, i, "nome", e.target.value)} />
              <Input type="number" placeholder="Qtd" value={item.quantidade} onChange={(e) => atualizar(embalagens, setEmbalagens, i, "quantidade", Number(e.target.value))} />
              <Input type="number" placeholder="Valor Unit." value={item.valorUnitario} onChange={(e) => atualizar(embalagens, setEmbalagens, i, "valorUnitario", Number(e.target.value))} />
              <div className="font-bold text-slate-700">R$ {(item.quantidade * item.valorUnitario).toFixed(2)}</div>
            </div>
          ))}
          <Button onClick={adicionarEmbalagem} variant="ghost" className="text-xs mt-2">+ Embalagem</Button>
        </CardContent>
      </Card>

      {/* OUTROS CUSTOS - RESTAURADO */}
      <Card>
        <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold uppercase text-slate-500">
          <div><label>Horas</label><Input type="number" value={horas} onChange={e => setHoras(Number(e.target.value))} /></div>
          <div><label>Valor/Hora</label><Input type="number" value={valorHora} onChange={e => setValorHora(Number(e.target.value))} /></div>
          <div><label>Transporte</label><Input type="number" value={transporte} onChange={e => setTransporte(Number(e.target.value))} /></div>
          <div><label>Qtd Produção</label><Input type="number" value={quantidadeProducao} onChange={e => setQuantidadeProducao(Number(e.target.value))} /></div>
        </CardContent>
      </Card>

      {/* LUCRO - RESTAURADO */}
      <Card className="bg-orange-50/50">
        <CardContent className="p-4">
          <label className="text-xs font-bold text-orange-800">Lucro (%)</label>
          <Input type="number" value={lucro} onChange={e => setLucro(Number(e.target.value))} className="h-10 text-lg font-bold text-orange-600 bg-white" />
        </CardContent>
      </Card>

      {/* RESULTADO E GRÁFICO */}
      <Card className="bg-slate-900 text-white shadow-xl">
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2 text-green-400">Resumo Final</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Custo Total:</span> <span>R$ {custoTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-2xl font-bold text-white pt-4"><span>Venda:</span> <span>R$ {precoVenda.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dadosGrafico} dataKey="value" nameKey="name" outerRadius={60}>
                  {dadosGrafico.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{color: '#000'}} /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
