"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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

  const custoIngredientes = ingredientes.reduce((t, i) => {
    const custoUnitarioReal = i.quantidadeCompra > 0 ? i.precoCompra / i.quantidadeCompra : 0;
    return t + (i.quantidade * custoUnitarioReal);
  }, 0);

  const custoEmbalagens = embalagens.reduce((t, e) => {
    return t + (e.quantidade * e.valorUnitario);
  }, 0);

  const maoDeObra = horas * valorHora;

  const custoTotal = custoIngredientes + custoEmbalagens + maoDeObra + Number(transporte);

  const custoUnitario = quantidadeProducao > 0 ? custoTotal / quantidadeProducao : 0;

  const precoVenda = custoUnitario * (1 + lucro / 100);

  // 💡 Sugestão automática (baseado em mercado simples)
  const precoSugerido = custoUnitario * 2; // regra prática: 100% markup

  // 📊 Dados do gráfico
  const dadosGrafico = [
    { name: "Ingredientes", value: custoIngredientes },
    { name: "Embalagens", value: custoEmbalagens },
    { name: "Mão de obra", value: maoDeObra },
    { name: "Transporte", value: Number(transporte) }
  ];

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold">Sistema Profissional de Custos</h1>

      {/* HEADER */}
      <Card>
        <CardContent className="p-4 grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs">Nome da Receita</label>
            <Input value={nomeReceita} onChange={(e) => setNomeReceita(e.target.value)} className="h-8" />
          </div>
          <Button className="h-8 mt-5">Salvar</Button>
          <Button className="h-8 mt-5">Carregar</Button>
        </CardContent>
      </Card>

      {/* INGREDIENTES */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Ingredientes</h2>

          <div className="grid grid-cols-6 gap-2 text-xs font-semibold mb-1">
            <span>Nome</span>
            <span>Qtd usada</span>
            <span>Un</span>
            <span>Qtd compra</span>
            <span>Preço</span>
            <span>Total</span>
          </div>

          {ingredientes.map((item, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 mb-2">
              <Input className="h-8" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "nome", e.target.value)} />
              <Input type="number" className="h-8" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "quantidade", Number(e.target.value))} />
              <select className="h-8 border rounded px-1" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "unidade", e.target.value)}>
                {unidades.map((u) => <option key={u}>{u}</option>)}
              </select>
              <Input type="number" className="h-8" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "quantidadeCompra", Number(e.target.value))} />
              <Input type="number" className="h-8" onChange={(e) => atualizar(ingredientes, setIngredientes, i, "precoCompra", Number(e.target.value))} />
              <div className="text-sm flex items-center">
                R$ {(item.quantidade * (item.precoCompra / (item.quantidadeCompra || 1))).toFixed(2)}
              </div>
            </div>
          ))}

          <Button onClick={adicionarIngrediente} className="h-8">Adicionar</Button>
        </CardContent>
      </Card>

      {/* EMBALAGENS */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Embalagens</h2>

          <div className="grid grid-cols-4 gap-2 text-xs font-semibold mb-1">
            <span>Nome</span>
            <span>Qtd</span>
            <span>Valor</span>
            <span>Total</span>
          </div>

          {embalagens.map((item, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-2">
              <Input className="h-8" onChange={(e) => atualizar(embalagens, setEmbalagens, i, "nome", e.target.value)} />
              <Input type="number" className="h-8" onChange={(e) => atualizar(embalagens, setEmbalagens, i, "quantidade", Number(e.target.value))} />
              <Input type="number" className="h-8" onChange={(e) => atualizar(embalagens, setEmbalagens, i, "valorUnitario", Number(e.target.value))} />
              <div className="text-sm flex items-center">
                R$ {(item.quantidade * item.valorUnitario).toFixed(2)}
              </div>
            </div>
          ))}

          <Button onClick={adicionarEmbalagem} className="h-8">Adicionar</Button>
        </CardContent>
      </Card>

      {/* OUTROS CUSTOS */}
      <Card>
        <CardContent className="p-4 grid grid-cols-4 gap-3">
          <div>
            <label className="text-xs">Horas</label>
            <Input type="number" className="h-8" onChange={(e) => setHoras(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs">Valor/Hora</label>
            <Input type="number" className="h-8" onChange={(e) => setValorHora(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs">Transporte</label>
            <Input type="number" className="h-8" onChange={(e) => setTransporte(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs">Qtd Produção</label>
            <Input type="number" className="h-8" onChange={(e) => setQuantidadeProducao(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      {/* LUCRO */}
      <Card>
        <CardContent className="p-4">
          <label className="text-xs">Lucro (%)</label>
          <Input type="number" value={lucro} onChange={(e) => setLucro(Number(e.target.value))} className="h-8" />
        </CardContent>
      </Card>

      {/* RESULTADO */}
      <Card>
        <CardContent className="p-4 text-sm">
          <p>Ingredientes: R$ {custoIngredientes.toFixed(2)}</p>
          <p>Embalagens: R$ {custoEmbalagens.toFixed(2)}</p>
          <p>Mão de obra: R$ {maoDeObra.toFixed(2)}</p>
          <p>Transporte: R$ {Number(transporte).toFixed(2)}</p>
          <p className="font-bold">Custo Total: R$ {custoTotal.toFixed(2)}</p>
          <p>Custo Unitário: R$ {custoUnitario.toFixed(2)}</p>
          <p className="text-lg font-bold">Preço de Venda: R$ {precoVenda.toFixed(2)}</p>
          <p className="text-blue-600">💡 Preço sugerido (mercado): R$ {precoSugerido.toFixed(2)}</p>
        </CardContent>
      </Card>

      {/* GRÁFICO */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Onde você mais gasta</h2>
          <PieChart width={300} height={300}>
            <Pie data={dadosGrafico} dataKey="value" nameKey="name" outerRadius={100} label />
            <Tooltip />
            <Legend />
          </PieChart>
        </CardContent>
      </Card>
    </div>
  );
}
