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
    <div className="p-6 grid gap-6 max-w-5xl mx-auto text-slate-900 font-sans">
      <h1 className="text-3xl font-bold text-center mb-4">Sistema de Precificação de Custos</h1>

      {/* HEADER DE RECEITA */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Nome da Receita / Projeto</label>
            <Input value={nomeReceita} onChange={(e) => setNomeReceita(e.target.value)} className="h-10 bg-white" placeholder="Ex: Bolo de Chocolate" />
          </div>
          <Button onClick={salvarDados} className="bg-green-600 hover:bg-green-700 h-10">Salvar Dados</Button>
          <Button onClick={carregarDados} variant="outline" className="border-green-600 text-green-700 h-10">Carregar Dados</Button>
        </CardContent>
      </Card>

      {/* SEÇÃO DE INGREDIENTES */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 border-b pb-2 text-slate-700">Ingredientes</h2>
          <div className="space-y-4">
            {ingredientes.map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Insumo</label>
                  <Input value={item.nome} onChange={(e) => atualizar(ingredientes, setIngredientes, i, "nome", e.target.value)} className="bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Qtd Usada</label>
                  <Input type="number" value={item.quantidade} onChange={(e) => atualizar(ingredientes, setIngredientes, i, "quantidade", Number(e.target.value))} className="bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Unidade</label>
                  <select value={item.unidade} className="w-full h-10 border rounded-md bg-white text-sm px-2" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "unidade", e.target.value)}>
                    {unidades.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Qtd na Compra</label>
                  <Input type="number" value={item.quantidadeCompra} onChange={(e) => atualizar(ingredientes, setIngredientes, i, "quantidadeCompra", Number(e.target.value))} className="bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Preço Compra</label>
                  <Input type="number" value={item.precoCompra} onChange={(e) => atualizar(ingredientes, setIngredientes, i, "precoCompra", Number(e.target.value))} className="bg-white" />
                </div>
                <div className="pb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1 text-right">Subtotal</span>
                  <div className="font-bold text-right text-slate-700">R$ {(item.quantidade * (item.precoCompra / (item.quantidadeCompra || 1))).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={adicionarIngrediente} variant="ghost" className="text-xs mt-4 text-blue-600 hover:text-blue-800">+ Adicionar Ingrediente</Button>
        </CardContent>
      </Card>

      {/* SEÇÃO DE EMBALAGENS */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 border-b pb-2 text-slate-700">Embalagens e Descartáveis</h2>
          <div className="space-y-4">
            {embalagens.map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                <div className="md:col-span-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Item</label>
                  <Input value={item.nome} onChange={(e) => atualizar(embalagens, setEmbalagens, i, "nome", e.target.value)} className="bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Quantidade</label>
                  <Input type="number" value={item.quantidade} onChange={(e) => atualizar(embalagens, setEmbalagens, i, "quantidade", Number(e.target.value))} className="bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Valor Unitário</label>
                  <Input type="number" value={item.valorUnitario} onChange={(e) => atualizar(embalagens, setEmbalagens, i, "valorUnitario", Number(e.target.value))} className="bg-white" />
                </div>
                <div className="pb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1 text-right">Subtotal</span>
                  <div className="font-bold text-right text-slate-700">R$ {(item.quantidade * item.valorUnitario).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={adicionarEmbalagem} variant="ghost" className="text-xs mt-4 text-blue-600 hover:text-blue-800">+ Adicionar Embalagem</Button>
        </CardContent>
      </Card>

      {/* SEÇÃO DE CUSTOS FIXOS / VARIÁVEIS */}
      <Card className="bg-slate-50/30 border-slate-200">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 text-slate-700">Outros Custos e Produção</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Horas de Trabalho</label>
              <Input type="number" value={horas} onChange={e => setHoras(Number(e.target.value))} className="bg-white" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Valor da Hora (R$)</label>
              <Input type="number" value={valorHora} onChange={e => setValorHora(Number(e.target.value))} className="bg-white" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Frete / Transporte</label>
              <Input type="number" value={transporte} onChange={e => setTransporte(Number(e.target.value))} className="bg-white" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Qtd Produzida</label>
              <Input type="number" value={quantidadeProducao} onChange={e => setQuantidadeProducao(Number(e.target.value))} className="bg-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MARGEM DE LUCRO */}
      <Card className="bg-blue-900 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase text-blue-300 block mb-1">Margem de Lucro Desejada (%)</label>
              <Input type="number" value={lucro} onChange={e => setLucro(Number(e.target.value))} className="h-12 text-2xl font-bold bg-white/10 border-white/20 text-white focus:bg-white focus:text-slate-900" />
            </div>
            <div className="text-right">
              <p className="text-blue-300 text-xs uppercase font-bold mb-1">Preço Sugerido p/ Unidade</p>
              <p className="text-4xl font-black text-green-400">R$ {precoVenda.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DASHBOARD FINAL */}
      <Card className="bg-white shadow-xl border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            <div className="p-8 bg-slate-900 text-white">
              <h2 className="text-xl font-bold mb-6 border-b border-slate-700 pb-2">Resumo Financeiro</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Total Ingredientes:</span> 
                  <span className="font-mono">R$ {custoIngredientes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Total Embalagens:</span> 
                  <span className="font-mono">R$ {custoEmbalagens.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Mão de Obra:</span> 
                  <span className="font-mono">R$ {maoDeObra.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Transporte:</span> 
                  <span className="font-mono">R$ {Number(transporte).toFixed(2)}</span>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between text-xl font-bold text-green-400">
                    <span>CUSTO TOTAL:</span> 
                    <span className="font-mono">R$ {custoTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest text-right italic">Custo por unidade: R$ {custoUnitario.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-6">Composição dos Custos</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dadosGrafico} dataKey="value" nameKey="name" outerRadius={80} stroke="none">
                      {dadosGrafico.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <footer className="text-center text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-8">
        Precifica - Ferramenta de Gestão Financeira
      </footer>
    </div>
  );
}
