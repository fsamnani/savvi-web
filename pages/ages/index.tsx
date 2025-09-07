import React, { useMemo, useState } from "react";

function currency(n:number){const s=n<0?"-":"";const v=Math.abs(n).toFixed(2);return `${s}$${Number(v).toLocaleString()}`}

const efUSD: Record<string, number> = {
  Housing: 0.35, Transportation: 0.45, Groceries: 0.20, Dining: 0.30,
  Utilities: 0.22, Subscriptions: 0.05, Shopping: 0.40, Health: 0.15,
  Travel: 0.50, Income: 0, Transfers: 0, Other: 0.25
};

export default function Home(){
  const [transactions] = useState([
    { id:"t1", date:"2025-08-01", description:"Rent", amount:-2100, category:"Housing" },
    { id:"t2", date:"2025-08-02", description:"Groceries", amount:-92.13, category:"Groceries" },
    { id:"t3", date:"2025-08-03", description:"Paycheck", amount:4200, category:"Income" },
    { id:"t4", date:"2025-08-04", description:"Dining", amount:-56.86, category:"Dining" },
    { id:"t5", date:"2025-08-05", description:"Utilities (est.)", amount:-130.55, category:"Utilities" }
  ]);

  const totalIncome = useMemo(()=>transactions.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0),[transactions]);
  const totalExpense = useMemo(()=>transactions.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0),[transactions]);
  const climate = useMemo(()=>{
    const byCat: Record<string, number> = {};
    let total = 0;
    for(const t of transactions){
      if(t.amount<0){
        const ef = efUSD[t.category as keyof typeof efUSD] ?? efUSD.Other;
        const kg = Math.abs(t.amount) * ef;
        total += kg;
        byCat[t.category] = (byCat[t.category]||0)+kg;
      }
    }
    const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
    return { totalKg: total, top };
  },[transactions]);

  return (
    <div style={{maxWidth:900, margin:"40px auto", padding:"0 20px", fontFamily:"ui-sans-serif, system-ui"}}>
      <h1 style={{marginBottom:8}}>Savvi (preview)</h1>
      <p style={{color:"#475569"}}>Minimal build to verify deploy & preview. Replace mock data later with Firebase + Plaid.</p>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginTop:16}}>
        <Stat label="Income" value={currency(totalIncome)} color="#065f46"/>
        <Stat label="Expenses" value={currency(totalExpense)} color="#b91c1c"/>
        <Stat label="Net" value={currency(totalIncome-totalExpense)} color="#0f766e"/>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:16}}>
        <div style={{border:"1px solid #e2e8f0", borderRadius:12, padding:16}}>
          <h3 style={{marginTop:0}}>Transactions</h3>
          {transactions.map(t=>(
            <div key={t.id} style={{display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f1f5f9"}}>
              <div>
                <div style={{fontWeight:500}}>{t.description}</div>
                <div style={{fontSize:12, color:"#64748b"}}>{t.date} · {t.category}</div>
              </div>
              <div style={{color: t.amount<0?"#b91c1c":"#065f46", fontWeight:600}}>{currency(t.amount)}</div>
            </div>
          ))}
        </div>
        <div style={{border:"1px solid #e2e8f0", borderRadius:12, padding:16}}>
          <h3 style={{marginTop:0}}>Climate (estimate)</h3>
          <div style={{fontSize:32, fontWeight:700}}>{Math.round(climate.totalKg)} kgCO₂e</div>
          {climate.top && (
            <div style={{marginTop:6, color:"#475569"}}>Top driver: <b>{climate.top[0]}</b> · {Math.round(climate.top[1])} kg</div>
          )}
          <ul style={{marginTop:12, color:"#475569"}}>
            <li>Tip: shift 1–2 dining trips to home-cooked this month.</li>
            <li>Tip: check your utility plan; off-peak use often emits less.</li>
          </ul>
          <small style={{color:"#64748b"}}>Spend-based rough estimate for demo only.</small>
        </div>
      </div>
    </div>
  );
}

function Stat({label,value,color}:{label:string;value:string;color:string}){
  return (
    <div style={{border:"1px solid #e2e8f0", borderRadius:12, padding:16}}>
      <div style={{fontSize:12, color:"#64748b"}}>{label}</div>
      <div style={{fontSize:28, fontWeight:700, color}}>{value}</div>
    </div>
  );
}
