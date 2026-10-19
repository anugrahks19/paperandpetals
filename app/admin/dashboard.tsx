"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, ChevronRight, ClipboardList, ExternalLink, Heart, LayoutDashboard, Mail, Package, RefreshCw, Search, ShoppingBag, Users, Wallet, X } from "lucide-react";

type Order = { id:string; name:string; email:string; phone:string; product:string; occasion:string; neededBy:string|null; budget:string|null; notes:string; status:string; quotedPrice:string|null; paymentStatus:string; deliveryNote:string|null; adminNotes:string|null; createdAt:string; updatedAt:string };
type View = "overview"|"orders"|"customers"|"schedule"|"payments";
const statuses = ["new","confirmed","making","ready","dispatched","completed","cancelled"];
const names:Record<string,string> = {new:"New request",confirmed:"Confirmed",making:"In the making",ready:"Ready",dispatched:"Dispatched",completed:"Completed",cancelled:"Cancelled"};
const paymentNames:Record<string,string> = {unpaid:"Awaiting payment","advance-paid":"Advance paid",paid:"Paid in full"};
const views:{id:View;label:string;Icon:typeof LayoutDashboard}[] = [
  {id:"overview",label:"Overview",Icon:LayoutDashboard},
  {id:"orders",label:"Orders",Icon:ShoppingBag},
  {id:"customers",label:"Customers",Icon:Users},
  {id:"schedule",label:"Due dates",Icon:CalendarDays},
  {id:"payments",label:"Payments",Icon:Wallet}
];
const currency = (value:number) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
const money = (value:string|null) => Number((value||"").replace(/[^0-9.]/g,""))||0;
const dateValue = (value:string) => new Date(value.includes("T")?value:value.replace(" ","T")+"Z");
const dateLabel = (value:string|null) => value ? new Date(value+"T12:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "Not specified";
const createdLabel = (value:string) => dateValue(value).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const dayDiff = (value:string) => { const today = new Date(); today.setHours(0,0,0,0); return Math.round((new Date(value+"T12:00:00").getTime()-today.getTime())/86400000); };
function Badge({value,payment=false}:{value:string;payment?:boolean}) { return <span className={"studio-badge "+(payment?"pay-"+value:"stage-"+value)}>{payment ? paymentNames[value]||value : names[value]||value}</span>; }
function Empty({title,description}:{title:string;description:string}) { return <div className="studio-empty"><span>✳</span><h3>{title}</h3><p>{description}</p></div>; }

export default function Dashboard() {
  const [view,setView] = useState<View>("overview");
  const [orders,setOrders] = useState<Order[]>([]);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);
  const [error,setError] = useState("");
  const [updated,setUpdated] = useState<Date|null>(null);
  const [query,setQuery] = useState("");
  const [statusFilter,setStatusFilter] = useState("all");
  const [paymentFilter,setPaymentFilter] = useState("all");
  const [sort,setSort] = useState("newest");
  const [selected,setSelected] = useState<Order|null>(null);
  const [form,setForm] = useState({status:"new",quotedPrice:"",paymentStatus:"unpaid",deliveryNote:"",adminNotes:""});
  const [saving,setSaving] = useState(false);
  const [saveMessage,setSaveMessage] = useState("");
  const load = useCallback(async (first=false) => {
    if(first) setLoading(true); else setRefreshing(true);
    try {
      const response=await fetch("/api/orders",{cache:"no-store"});
      if(!response.ok) throw new Error(response.status===403?"This account does not have dashboard access.":"Could not load customer requests.");
      const data=await response.json() as {orders:Order[]};
      setOrders(data.orders||[]); setUpdated(new Date()); setError("");
    } catch(e) { setError(e instanceof Error?e.message:"Could not load customer requests."); }
    finally { setLoading(false); setRefreshing(false); }
  },[]);
  useEffect(() => { void load(true); const timer=setInterval(() => void load(),30000); return () => clearInterval(timer); },[load]);
  const openOrder=(order:Order) => { setSelected(order); setSaveMessage(""); setForm({status:order.status,quotedPrice:order.quotedPrice||"",paymentStatus:order.paymentStatus||"unpaid",deliveryNote:order.deliveryNote||"",adminNotes:order.adminNotes||""}); };
  const save=async () => {
    if(!selected) return;
    setSaving(true); setSaveMessage("");
    try {
      const response=await fetch("/api/orders/"+encodeURIComponent(selected.id),{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if(!response.ok) throw new Error("Could not save changes. Please try again.");
      const data=await response.json() as {order:Order};
      setSelected(data.order); setOrders(previous=>previous.map(order=>order.id===data.order.id?data.order:order));
      setSaveMessage("Changes saved");
    } catch(e) { setSaveMessage(e instanceof Error?e.message:"Could not save changes."); }
    finally { setSaving(false); }
  };
  const active=orders.filter(o=>!["completed","cancelled"].includes(o.status));
  const newCount=orders.filter(o=>o.status==="new").length;
  const quoted=orders.filter(o=>o.status!=="cancelled").reduce((sum,o)=>sum+money(o.quotedPrice),0);
  const markedPaid=orders.filter(o=>o.status!=="cancelled"&&o.paymentStatus==="paid").reduce((sum,o)=>sum+money(o.quotedPrice),0);
  const awaiting=orders.filter(o=>o.status!=="cancelled"&&o.paymentStatus!=="paid"&&money(o.quotedPrice)>0);
  const due=active.filter(o=>o.neededBy).sort((a,b)=>(a.neededBy||"").localeCompare(b.neededBy||""));
  const recent=[...orders].sort((a,b)=>dateValue(b.createdAt).getTime()-dateValue(a.createdAt).getTime()).slice(0,5);
  const customers=useMemo(()=>{
    const map=new Map<string,{name:string;email:string;phone:string;orders:Order[];latest:string;quoted:number}>();
    for(const order of orders) {
      const key=order.email.trim().toLowerCase();
      const existing=map.get(key);
      if(existing){existing.orders.push(order);existing.quoted+=money(order.quotedPrice);if(dateValue(order.createdAt)>dateValue(existing.latest)){existing.latest=order.createdAt;existing.name=order.name;existing.phone=order.phone;}}
      else map.set(key,{name:order.name,email:order.email,phone:order.phone,orders:[order],latest:order.createdAt,quoted:money(order.quotedPrice)});
    }
    return [...map.values()].sort((a,b)=>dateValue(b.latest).getTime()-dateValue(a.latest).getTime());
  },[orders]);
  const filtered=useMemo(()=>{
    const term=query.trim().toLowerCase();
    return orders.filter(o=>(statusFilter==="all"||o.status===statusFilter)&&(paymentFilter==="all"||o.paymentStatus===paymentFilter)&&(!term||[o.name,o.email,o.phone,o.product,o.occasion,o.id].some(value=>value.toLowerCase().includes(term)))).sort((a,b)=>{
      if(sort==="oldest") return dateValue(a.createdAt).getTime()-dateValue(b.createdAt).getTime();
      if(sort==="due") return (a.neededBy||"9999").localeCompare(b.neededBy||"9999");
      return dateValue(b.createdAt).getTime()-dateValue(a.createdAt).getTime();
    });
  },[orders,query,statusFilter,paymentFilter,sort]);
  const viewCustomer=(email:string)=>{setQuery(email);setStatusFilter("all");setPaymentFilter("all");setView("orders");};
  const title:Record<View,string>={overview:"Studio overview",orders:"All orders",customers:"Your customers",schedule:"Due date planner",payments:"Payment tracker"};
  const subtitle:Record<View,string>={overview:"A clear view of every handmade order.",orders:"Manage requests from your customer booking form.",customers:"The people behind every thoughtful piece.",schedule:"Keep every special occasion on track.",payments:"Track quotes and payment stages."};
  const orderRows=(list:Order[]) => <div className="studio-table-wrap"><table className="studio-table"><thead><tr><th>Customer / request</th><th>Product</th><th>Needed by</th><th>Quote</th><th>Payment</th><th>Status</th><th></th></tr></thead><tbody>{list.map(o=><tr key={o.id}><td><strong>{o.name}</strong><small>{o.email} · {createdLabel(o.createdAt)}</small></td><td>{o.product}<small>{o.occasion}</small></td><td>{dateLabel(o.neededBy)}</td><td>{o.quotedPrice||"—"}</td><td><Badge value={o.paymentStatus} payment/></td><td><Badge value={o.status}/></td><td><button className="studio-row-action" onClick={()=>openOrder(o)} aria-label={"Open order from "+o.name}><ChevronRight size={18}/></button></td></tr>)}</tbody></table></div>;
  return <div className="studio-app">
    <aside className="studio-sidebar">
      <div className="studio-sidebar-brand"><span className="studio-mark">✳</span><div><strong>paper <em>&</em> petals</strong><small>THE PRIVATE STUDIO</small></div></div>
      <div className="studio-sidebar-label">WORKSPACE</div>
      <nav aria-label="Dashboard sections">{views.map(({id,label,Icon})=><button key={id} className={view===id?"active":""} onClick={()=>setView(id)}><Icon size={17}/><span>{label}</span>{id==="orders"&&newCount>0&&<b>{newCount}</b>}</button>)}</nav>
      <div className="studio-sidebar-bottom"><div className="studio-sidebar-note"><Heart size={16}/><p>Made with care, managed with clarity.</p></div><a href="/" target="_blank" rel="noopener noreferrer">View customer website <ExternalLink size={14}/></a></div>
    </aside>
    <main className="studio-main">
      <header className="studio-topbar"><span><span className="studio-live-dot"/> Connected to customer bookings</span><div><span>{updated?"Updated "+updated.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"}):"Connecting..."}</span><button onClick={()=>void load()} disabled={refreshing} aria-label="Refresh dashboard"><RefreshCw size={17} className={refreshing?"studio-spin":""}/></button></div></header>
      <div className="studio-content"><div className="studio-page-heading"><div><span className="studio-kicker">PAPER & PETALS / STUDIO</span><h1>{title[view]}<em>.</em></h1><p>{subtitle[view]}</p></div><div className="studio-date"><CalendarDays size={17}/>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"long",year:"numeric"})}</div></div>
      {error&&<div className="studio-error" role="alert">{error}<button onClick={()=>void load()}>Try again</button></div>}
      {loading?<div className="studio-loading">Opening your studio workspace…</div>:<>
      {view==="overview"&&<>
        <section className="studio-kpis" aria-label="Order summary">
          <div className="studio-kpi"><span className="studio-kpi-icon peach"><ShoppingBag size={20}/></span><small>Total requests</small><strong>{orders.length}</strong><p>From the customer booking form</p></div>
          <div className="studio-kpi"><span className="studio-kpi-icon rose"><Mail size={20}/></span><small>New enquiries</small><strong>{newCount}</strong><p>Waiting for your reply</p></div>
          <div className="studio-kpi"><span className="studio-kpi-icon sage"><Package size={20}/></span><small>Active orders</small><strong>{active.length}</strong><p>Across every stage</p></div>
          <div className="studio-kpi"><span className="studio-kpi-icon lilac"><Check size={20}/></span><small>Completed</small><strong>{orders.filter(o=>o.status==="completed").length}</strong><p>Handmade and delivered</p></div>
        </section>
        <div className="studio-overview-grid"><section className="studio-panel"><div className="studio-panel-head"><div><span className="studio-kicker">THE WORKFLOW</span><h2>Order journey</h2></div><button onClick={()=>setView("orders")}>All orders <ArrowRight size={15}/></button></div><div className="studio-pipeline">{statuses.filter(s=>s!=="cancelled").map(s=><button key={s} onClick={()=>{setStatusFilter(s);setView("orders")}}><span className={"studio-stage-dot stage-"+s}/><span>{names[s]}</span><strong>{orders.filter(o=>o.status===s).length}</strong></button>)}</div></section>
        <section className="studio-panel"><div className="studio-panel-head"><div><span className="studio-kicker">KEEP IN MIND</span><h2>Upcoming dates</h2></div><button onClick={()=>setView("schedule")}>Planner <ArrowRight size={15}/></button></div>{due.length?due.slice(0,5).map(o=><button key={o.id} className="studio-due-row" onClick={()=>openOrder(o)}><span className="studio-date-block"><strong>{new Date((o.neededBy||"")+"T12:00:00").getDate()}</strong><small>{new Date((o.neededBy||"")+"T12:00:00").toLocaleDateString("en-IN",{month:"short"})}</small></span><span><strong>{o.name}</strong><small>{o.product}</small></span><span className={dayDiff(o.neededBy||"")<0?"studio-late":""}>{dayDiff(o.neededBy||"")<0?"Overdue":dayDiff(o.neededBy||"")===0?"Today":dayDiff(o.neededBy||"")+" days"}</span></button>):<Empty title="No dates to watch" description="Order deadlines will appear here when customers choose a date."/>}</section></div>
        <section className="studio-panel studio-recent"><div className="studio-panel-head"><div><span className="studio-kicker">FRESH FROM THE FORM</span><h2>Recent requests</h2></div><button onClick={()=>setView("orders")}>View all <ArrowRight size={15}/></button></div>{recent.length?orderRows(recent):<Empty title="Your first request is on its way" description="Every customer booking appears here as soon as it is submitted."/>}</section>
      </>}
      {view==="orders"&&<section className="studio-panel"><div className="studio-panel-head"><div><span className="studio-kicker">LIVE REQUESTS</span><h2>{filtered.length} {filtered.length===1?"order":"orders"}</h2></div></div><div className="studio-filters"><label className="studio-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search customer, product or occasion…" aria-label="Search orders"/></label><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} aria-label="Filter by status"><option value="all">All statuses</option>{statuses.map(s=><option key={s} value={s}>{names[s]}</option>)}</select><select value={paymentFilter} onChange={e=>setPaymentFilter(e.target.value)} aria-label="Filter by payment"><option value="all">All payments</option>{Object.keys(paymentNames).map(s=><option key={s} value={s}>{paymentNames[s]}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort orders"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="due">Due date</option></select></div>{filtered.length?orderRows(filtered):<Empty title="No matching orders" description={orders.length?"Try changing your search or filters.":"New customer bookings will show up here automatically."}/>}</section>}
      {view==="customers"&&<><div className="studio-section-summary"><div><strong>{customers.length}</strong><span>customer {customers.length===1?"profile":"profiles"}</span></div><p>Profiles are grouped by the email customers enter on the booking form.</p></div>{customers.length?<div className="studio-customer-grid">{customers.map(c=><article key={c.email} className="studio-customer-card"><span className="studio-avatar">{c.name.trim().charAt(0).toUpperCase()}</span><div><h3>{c.name}</h3><p>{c.email}</p><p>{c.phone}</p></div><div className="studio-customer-meta"><span><strong>{c.orders.length}</strong> {c.orders.length===1?"order":"orders"}</span><span>Last request {createdLabel(c.latest)}</span></div><button onClick={()=>viewCustomer(c.email)}>View orders <ArrowRight size={15}/></button></article>)}</div>:<Empty title="No customers yet" description="A customer profile appears as soon as their first booking arrives."/>}</>}
      {view==="schedule"&&<><div className="studio-kpis studio-kpis-three"><div className="studio-kpi"><small>Overdue</small><strong>{due.filter(o=>dayDiff(o.neededBy||"")<0).length}</strong><p>Active orders past their date</p></div><div className="studio-kpi"><small>Next 7 days</small><strong>{due.filter(o=>dayDiff(o.neededBy||"")>=0&&dayDiff(o.neededBy||"")<=7).length}</strong><p>Coming up soon</p></div><div className="studio-kpi"><small>Later / no date</small><strong>{active.length-due.filter(o=>dayDiff(o.neededBy||"")<=7).length}</strong><p>Keep these on your radar</p></div></div>{[["Overdue",due.filter(o=>dayDiff(o.neededBy||"")<0)],["Next 7 days",due.filter(o=>dayDiff(o.neededBy||"")>=0&&dayDiff(o.neededBy||"")<=7)],["Later",due.filter(o=>dayDiff(o.neededBy||"")>7)],["No date given",active.filter(o=>!o.neededBy)]].map(([label,list])=><section className="studio-panel studio-schedule-group" key={label as string}><div className="studio-panel-head"><h2>{label as string}</h2><span>{(list as Order[]).length}</span></div>{(list as Order[]).length?(list as Order[]).map(o=><button className="studio-schedule-row" key={o.id} onClick={()=>openOrder(o)}><CalendarDays size={18}/><span><strong>{o.name} · {o.product}</strong><small>{o.occasion}</small></span><span>{dateLabel(o.neededBy)}</span><Badge value={o.status}/><ChevronRight size={17}/></button>):<p className="studio-muted">No orders in this group.</p>}</section>)}</>}
      {view==="payments"&&<><div className="studio-kpis studio-kpis-three"><div className="studio-kpi"><small>Quoted order value</small><strong className="studio-money">{currency(quoted)}</strong><p>Excludes cancelled requests</p></div><div className="studio-kpi"><small>Marked paid in full</small><strong className="studio-money">{currency(markedPaid)}</strong><p>Based on manual payment status</p></div><div className="studio-kpi"><small>Awaiting payment</small><strong>{awaiting.length}</strong><p>Quoted orders not marked paid</p></div></div><section className="studio-panel"><div className="studio-panel-head"><div><span className="studio-kicker">PAYMENT RECORDS</span><h2>Quotes & payment status</h2></div></div><p className="studio-payment-note">Update agreed price and payment status inside each order. Advance amounts are not recorded, so totals only count orders marked paid in full.</p>{orders.length?orderRows(orders.filter(o=>o.status!=="cancelled")):<Empty title="No payment records yet" description="Add a quote to an order to start tracking payments."/>}</section></>}
      </>}
      </div>
    </main>
    {selected&&<div className="studio-overlay" role="dialog" aria-modal="true" aria-label={"Order from "+selected.name} onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><div className="studio-drawer"><div className="studio-drawer-head"><div><span className="studio-kicker">CUSTOMER ORDER</span><h2>{selected.name}</h2><Badge value={selected.status}/></div><button onClick={()=>setSelected(null)} aria-label="Close order details"><X size={21}/></button></div><div className="studio-drawer-body"><div className="studio-order-id">Request {selected.id.slice(0,8)} · Received {createdLabel(selected.createdAt)}</div><div className="studio-detail-grid"><div><small>Product</small><strong>{selected.product}</strong></div><div><small>Occasion</small><strong>{selected.occasion}</strong></div><div><small>Needed by</small><strong>{dateLabel(selected.neededBy)}</strong></div><div><small>Customer budget</small><strong>{selected.budget||"To discuss"}</strong></div></div><div className="studio-customer-message"><small>PERSONAL DETAILS FROM CUSTOMER</small><p>{selected.notes}</p></div><div className="studio-contact"><a href={"mailto:"+selected.email}><Mail size={16}/> {selected.email}</a><a href={"tel:"+selected.phone}><span>☎</span> {selected.phone}</a></div><div className="studio-editor"><span className="studio-kicker">MANAGE THIS ORDER</span><div className="studio-edit-grid"><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{statuses.map(s=><option key={s} value={s}>{names[s]}</option>)}</select></label><label>Payment status<select value={form.paymentStatus} onChange={e=>setForm({...form,paymentStatus:e.target.value})}>{Object.keys(paymentNames).map(s=><option key={s} value={s}>{paymentNames[s]}</option>)}</select></label></div><label>Agreed price<input value={form.quotedPrice} maxLength={30} onChange={e=>setForm({...form,quotedPrice:e.target.value})} placeholder="e.g. ₹1,200"/></label><label>Delivery / tracking note<input value={form.deliveryNote} maxLength={500} onChange={e=>setForm({...form,deliveryNote:e.target.value})} placeholder="Courier, tracking or pickup details"/></label><label>Private studio notes<textarea value={form.adminNotes} maxLength={1000} onChange={e=>setForm({...form,adminNotes:e.target.value})} placeholder="Materials, follow-ups, production notes…"/></label><button className="studio-save" onClick={()=>void save()} disabled={saving}>{saving?"Saving changes…":"Save changes"} <ArrowRight size={16}/></button>{saveMessage&&<p className="studio-save-message" role="status">{saveMessage}</p>}</div><div className="studio-timestamps"><ClipboardList size={15}/> Last updated {createdLabel(selected.updatedAt)}</div></div></div></div>}
  </div>;
}
