// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useRef, useState, useMemo } from "react";
// import {
//   Button, Card, Col, Row, Tag, Table, Select, Tabs, Tooltip, Segmented,
// } from "antd";
// import {
//   ArrowLeftOutlined, BarChartOutlined, TableOutlined,
//   MailOutlined, EyeOutlined, LinkOutlined, StopOutlined, GlobalOutlined,
// } from "@ant-design/icons";
// import { Chart, registerables } from "chart.js";
// import { get_advertisers_detail } from "../../api/advertiser";



// Chart.register(...registerables);

// const { Option } = Select;

// // ── helpers ──────────────────────────────────────────────────────────────────

// const pct = (v) => `${Number(v ?? 0).toFixed(2)}%`;

// const tagColor = (txt) => {
//   if (!txt) return "default";
//   if (txt.includes("🟢") || txt.includes("✅")) return "green";
//   if (txt.includes("🟡") || txt.includes("🔶") || txt.includes("😐")) return "gold";
//   if (txt.includes("🔴") || txt.includes("🚨")) return "red";
//   if (txt.includes("⚠️")) return "orange";
//   if (txt.includes("🔥")) return "purple";
//   if (txt.includes("👍")) return "blue";
//   return "default";
// };

// const CHART_COLORS = ["#1890ff","#52c41a","#faad14","#f5222d","#722ed1","#13c2c2","#eb2f96","#fa541c"];

// // ── MiniChart ─────────────────────────────────────────────────────────────────

// const MiniChart = ({ type, labels, datasets, height = 220 }) => {
//   const ref = useRef(null);
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (!ref.current) return;
//     if (chartRef.current) chartRef.current.destroy();
//     chartRef.current = new Chart(ref.current, {
//       type,
//       data: { labels, datasets },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: { display: datasets.length > 1, position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } },
//         },
//         scales: type !== "doughnut" ? {
//           x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 35 } },
//           y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 10 } } },
//         } : undefined,
//       },
//     });
//     return () => chartRef.current?.destroy();
//   }, [type, labels, JSON.stringify(datasets)]);

//   return (
//     <div style={{ position: "relative", width: "100%", height }}>
//       <canvas ref={ref} />
//     </div>
//   );
// };

// // ── KpiStrip ──────────────────────────────────────────────────────────────────

// const KpiStrip = ({ g }) => {
//   const items = [
//     { label: "Sends",     value: g.sends?.toLocaleString(),         icon: <MailOutlined />,   color: "#1890ff" },
//     { label: "Openers",   value: g.openers?.toLocaleString(),       icon: <EyeOutlined />,    color: "#52c41a" },
//     { label: "Clickers",  value: g.clickers?.toLocaleString(),      icon: <LinkOutlined />,   color: "#faad14" },
//     { label: "Unsubs",    value: g.unsubs?.toLocaleString(),        icon: <StopOutlined />,   color: "#f5222d" },
//     { label: "Open Rate", value: pct(g.taux_openers),               icon: <EyeOutlined />,    color: "#52c41a" },
//     { label: "CTR",       value: pct(g.taux_clickers),              icon: <LinkOutlined />,   color: "#faad14" },
//     { label: "Unsub %",   value: pct(g.taux_unsubs),                icon: <StopOutlined />,   color: "#f5222d" },
//     { label: "eCPM",      value: `$${g.ecpm ?? 0}`,                 icon: <GlobalOutlined />, color: "#722ed1" },
//     { label: "CA",        value: `$${g.ca ?? 0}`,                   icon: <GlobalOutlined />, color: "#13c2c2" },
//   ];
//   return (
//     <Row gutter={[10, 10]} style={{ marginBottom: 16 }}>
//       {items.map((s) => (
//         <Col key={s.label} xs={12} sm={8} md={6} lg={4} xl={3}>
//           <div style={{
//             background: "#fff", border: "1px solid #f0f0f0", borderRadius: 10,
//             padding: "10px 12px", position: "relative", overflow: "hidden",
//           }}>
//             <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: "10px 10px 0 0" }} />
//             <div style={{ fontSize: 11, color: "#999", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
//               <span style={{ color: s.color, fontSize: 11 }}>{s.icon}</span>{s.label}
//             </div>
//             <div style={{ fontSize: 17, fontWeight: 700, color: "#222" }}>{s.value}</div>
//           </div>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// // ── AnalyseBadges ─────────────────────────────────────────────────────────────

// const AnalyseBadges = ({ analyses }) => (
//   <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
//     {Object.entries(analyses || {}).map(([k, v]) => (
//       <Tag key={k} color={tagColor(v)} style={{ fontSize: 11, margin: 0 }}>{v}</Tag>
//     ))}
//   </div>
// );

// // ── DimCharts ─────────────────────────────────────────────────────────────────

// const DimCharts = ({ dimensions }) => (
//   <Row gutter={[14, 14]}>
//     {[["age_range","Tranche d'âge"],["gender","Genre"],["isp","ISP / FAI"]].map(([key, label]) => {
//       const dim = dimensions?.[key];
//       if (!dim) return null;
//       const entries = Object.entries(dim).filter(([, v]) => v.sends > 0);
//       return (
//         <Col key={key} xs={24} lg={8}>
//           <Card size="small" title={label} style={{ borderRadius: 10 }}>
//             <MiniChart
//               type="bar"
//               labels={entries.map(([k]) => k)}
//               height={200}
//               datasets={[
//                 { label: "Sends",    data: entries.map(([,v]) => v.sends),    backgroundColor: "#1890ff44", borderColor: "#1890ff", borderWidth: 1.5, borderRadius: 3 },
//                 { label: "Openers",  data: entries.map(([,v]) => v.openers),  backgroundColor: "#52c41a44", borderColor: "#52c41a", borderWidth: 1.5, borderRadius: 3 },
//                 { label: "Clickers", data: entries.map(([,v]) => v.clickers), backgroundColor: "#faad1444", borderColor: "#faad14", borderWidth: 1.5, borderRadius: 3 },
//                 { label: "Unsubs",   data: entries.map(([,v]) => v.unsubs),   backgroundColor: "#f5222d44", borderColor: "#f5222d", borderWidth: 1.5, borderRadius: 3 },
//               ]}
//             />
//           </Card>
//         </Col>
//       );
//     })}
//   </Row>
// );

// // ── DimTables ─────────────────────────────────────────────────────────────────

// const dimCols = [
//   { title: "Segment",  dataIndex: "segment",       fixed: "left", width: 110 },
//   { title: "Sends",    dataIndex: "sends",         sorter: (a,b) => a.sends - b.sends },
//   { title: "Openers",  dataIndex: "openers",       sorter: (a,b) => a.openers - b.openers },
//   { title: "Clickers", dataIndex: "clickers",      sorter: (a,b) => a.clickers - b.clickers },
//   { title: "Unsubs",   dataIndex: "unsubs",        sorter: (a,b) => a.unsubs - b.unsubs },
//   { title: "CTR %",    dataIndex: "taux_clickers", sorter: (a,b) => a.taux_clickers - b.taux_clickers, render: pct },
//   { title: "Open %",   dataIndex: "taux_openers",  sorter: (a,b) => a.taux_openers - b.taux_openers,   render: pct },
//   { title: "Unsub %",  dataIndex: "taux_unsubs",   sorter: (a,b) => a.taux_unsubs - b.taux_unsubs,     render: pct },
//   { title: "CTO %",    dataIndex: "taux_cto",      sorter: (a,b) => a.taux_cto - b.taux_cto,           render: pct },
//   { title: "Analyses", dataIndex: "analyses", width: 300, render: (a) => <AnalyseBadges analyses={a} /> },
// ];

// const DimTables = ({ dimensions }) => {
//   const [filters, setFilters] = useState({});
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       {[["age_range","Tranche d'âge"],["gender","Genre"],["isp","ISP / FAI"]].map(([key, label]) => {
//         const dim = dimensions?.[key];
//         if (!dim) return null;
//         const rows = Object.entries(dim).map(([seg, v]) => ({ key: seg, segment: seg, ...v }));
//         const f = filters[key] || {};
//         const filtered = rows.filter((r) => {
//           if (f.minSends && r.sends < Number(f.minSends)) return false;
//           if (f.emoji && !Object.values(r.analyses || {}).some((v) => v.includes(f.emoji))) return false;
//           return true;
//         });
//         return (
//           <Card key={key} size="small" title={label} style={{ borderRadius: 10 }}
//             extra={
//               <div style={{ display: "flex", gap: 8 }}>
//                 <Select placeholder="Min sends" allowClear size="small" style={{ width: 140 }}
//                   onChange={(v) => setFilters((p) => ({ ...p, [key]: { ...p[key], minSends: v } }))}>
//                   {[100,500,1000,5000,10000].map((n) => <Option key={n} value={n}>≥ {n.toLocaleString()}</Option>)}
//                 </Select>
//                 <Select placeholder="Statut" allowClear size="small" style={{ width: 100 }}
//                   onChange={(v) => setFilters((p) => ({ ...p, [key]: { ...p[key], emoji: v } }))}>
//                   {["✅","🟢","🟡","🔶","🔴","⚠️","🚨","🔥","👍"].map((e) => <Option key={e} value={e}>{e}</Option>)}
//                 </Select>
//               </div>
//             }
//           >
//             <Table dataSource={filtered} columns={dimCols} size="small" rowKey="segment"
//               pagination={{ pageSize: 8, size: "small" }} scroll={{ x: 900 }} />
//           </Card>
//         );
//       })}
//     </div>
//   );
// };

// // ── BaseCard ──────────────────────────────────────────────────────────────────

// const clsColor = { A: "green", B: "blue", C: "gold", D: "red" };

// const brandCols = [
//   { title: "Brand",    dataIndex: "name",         fixed: "left", width: 130 },
//   {
//     title: "Créa", dataIndex: "creativities",
//     render: (url) => url && url !== "url_vide"
//       ? <Tooltip title={url}><Tag color="blue" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", display: "inline-block" }}>{url.length > 35 ? url.slice(0,35)+"…" : url}</Tag></Tooltip>
//       : <Tag color="default">url_vide</Tag>,
//   },
//   { title: "Sends",    dataIndex: "sends",         sorter: (a,b) => a.sends - b.sends },
//   { title: "Openers",  dataIndex: "openers",       sorter: (a,b) => a.openers - b.openers },
//   { title: "Clickers", dataIndex: "clickers",      sorter: (a,b) => a.clickers - b.clickers },
//   { title: "Unsubs",   dataIndex: "unsubs",        sorter: (a,b) => a.unsubs - b.unsubs },
//   { title: "CTR %",    dataIndex: "taux_clickers", sorter: (a,b) => a.taux_clickers - b.taux_clickers, render: pct },
//   { title: "CTO %",    dataIndex: "taux_cto",      sorter: (a,b) => a.taux_cto - b.taux_cto,           render: pct },
//   { title: "Unsub %",  dataIndex: "taux_unsubs",   sorter: (a,b) => a.taux_unsubs - b.taux_unsubs,     render: pct },
//   { title: "Analyses", dataIndex: "analyses", width: 280, render: (a) => <AnalyseBadges analyses={a} /> },
// ];

// const BaseCard = ({ base, viewMode }) => {
//   const [tab, setTab] = useState("overview");

//   const tabItems = [
//     {
//       key: "overview",
//       label: "Vue globale",
//       children: (
//         <div style={{ paddingTop: 10 }}>
//           <KpiStrip g={base} />
//           <AnalyseBadges analyses={base.analyses} />
//         </div>
//       ),
//     },
//     {
//       key: "brands",
//       label: `Brands (${base.brands?.length || 0})`,
//       children: (
//         <div style={{ paddingTop: 10 }}>
//           {viewMode === "chart" ? (
//             <MiniChart type="bar"
//               labels={base.brands.map((b) => b.name)}
//               height={220}
//               datasets={[
//                 { label: "Sends",    data: base.brands.map((b) => b.sends),    backgroundColor: "#1890ff88", borderRadius: 4 },
//                 { label: "Openers",  data: base.brands.map((b) => b.openers),  backgroundColor: "#52c41a88", borderRadius: 4 },
//                 { label: "Clickers", data: base.brands.map((b) => b.clickers), backgroundColor: "#faad1488", borderRadius: 4 },
//               ]}
//             />
//           ) : (
//             <Table dataSource={base.brands.map((b,i) => ({ key: i, ...b }))}
//               columns={brandCols} size="small" pagination={false} scroll={{ x: 900 }} />
//           )}
//         </div>
//       ),
//     },
//     {
//       key: "dimensions",
//       label: "Dimensions",
//       children: (
//         <div style={{ paddingTop: 10 }}>
//           {viewMode === "chart"
//             ? <DimCharts dimensions={base.dimensions} />
//             : <DimTables dimensions={base.dimensions} />
//           }
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Card
//       style={{ borderRadius: 12, marginBottom: 14, border: "1px solid #e8e8e8" }}
//       title={
//         <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//           <span style={{ fontWeight: 700 }}>DB #{base.database_id}</span>
//           <Tag color="purple" style={{ fontFamily: "monospace", margin: 0 }}>Router {base.id_routers}</Tag>
//           <Tag color={clsColor[base.classification] || "default"} style={{ margin: 0 }}>Classe {base.classification}</Tag>
//           <span style={{ fontSize: 11, color: "#bbb", fontWeight: 400 }}>{base.date_schedule?.join(", ")}</span>
//         </div>
//       }
//     >
//       <Tabs activeKey={tab} onChange={setTab} size="small" items={tabItems} />
//     </Card>
//   );
// };

// // ── GlobalCharts ──────────────────────────────────────────────────────────────

// const GlobalCharts = ({ bases }) => {
//   const labels = bases.map((b) => `DB #${b.database_id}`);
//   return (
//     <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
//       {[
//         { title: "Sends par base", datasets: [{ label: "Sends", data: bases.map((b) => b.sends), backgroundColor: "#1890ff99", borderRadius: 4 }] },
//         { title: "Engagement par base", datasets: [
//           { label: "Openers",  data: bases.map((b) => b.openers),  backgroundColor: "#52c41a88", borderRadius: 4 },
//           { label: "Clickers", data: bases.map((b) => b.clickers), backgroundColor: "#faad1488", borderRadius: 4 },
//           { label: "Unsubs",   data: bases.map((b) => b.unsubs),   backgroundColor: "#f5222d88", borderRadius: 4 },
//         ]},
//         { title: "CTR % par base", datasets: [{ label: "CTR %", data: bases.map((b) => b.taux_clickers), backgroundColor: "#722ed199", borderRadius: 4 }] },
//         { title: "Répartition sends", type: "doughnut", datasets: [{ data: bases.map((b) => b.sends), backgroundColor: CHART_COLORS.slice(0, bases.length), borderWidth: 2 }] },
//       ].map(({ title, datasets, type }) => (
//         <Col key={title} xs={24} md={12}>
//           <Card size="small" title={title} style={{ borderRadius: 10 }}>
//             <MiniChart type={type || "bar"} labels={labels} datasets={datasets} height={190} />
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// // ── GlobalTable ───────────────────────────────────────────────────────────────

// const GlobalTable = ({ bases }) => {
//   const [f, setF] = useState({ minSends: null, cls: null });
//   const rows = useMemo(() => {
//     let d = bases.map((b) => ({ key: b.database_id, ...b }));
//     if (f.minSends) d = d.filter((r) => r.sends >= f.minSends);
//     if (f.cls)      d = d.filter((r) => r.classification === f.cls);
//     return d;
//   }, [bases, f]);

//   const cols = [
//     { title: "DB",     dataIndex: "database_id",    fixed: "left", width: 70 },
//     { title: "Router", dataIndex: "id_routers",     width: 90 },
//     { title: "Classe", dataIndex: "classification", render: (v) => <Tag color={clsColor[v] || "default"}>{v}</Tag> },
//     { title: "Sends",    dataIndex: "sends",         sorter: (a,b) => a.sends - b.sends },
//     { title: "Openers",  dataIndex: "openers",       sorter: (a,b) => a.openers - b.openers },
//     { title: "Clickers", dataIndex: "clickers",      sorter: (a,b) => a.clickers - b.clickers },
//     { title: "Unsubs",   dataIndex: "unsubs",        sorter: (a,b) => a.unsubs - b.unsubs },
//     { title: "CTR %",    dataIndex: "taux_clickers", sorter: (a,b) => a.taux_clickers - b.taux_clickers, render: pct },
//     { title: "Open %",   dataIndex: "taux_openers",  sorter: (a,b) => a.taux_openers - b.taux_openers,   render: pct },
//     { title: "Unsub %",  dataIndex: "taux_unsubs",   sorter: (a,b) => a.taux_unsubs - b.taux_unsubs,     render: pct },
//     { title: "CA",       dataIndex: "ca",            sorter: (a,b) => a.ca - b.ca, render: (v) => `$${v}` },
//     { title: "eCPM",     dataIndex: "ecpm",          sorter: (a,b) => a.ecpm - b.ecpm, render: (v) => `$${v}` },
//     { title: "Analyses", dataIndex: "analyses", width: 280, render: (a) => <AnalyseBadges analyses={a} /> },
//   ];

//   return (
//     <>
//       <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
//         <Select placeholder="Min sends" allowClear size="small" style={{ width: 160 }}
//           onChange={(v) => setF((p) => ({ ...p, minSends: v }))}>
//           {[100,500,1000,5000,10000,20000].map((n) => <Option key={n} value={n}>≥ {n.toLocaleString()} sends</Option>)}
//         </Select>
//         <Select placeholder="Classe" allowClear size="small" style={{ width: 110 }}
//           onChange={(v) => setF((p) => ({ ...p, cls: v }))}>
//           {["A","B","C","D"].map((c) => <Option key={c} value={c}>Classe {c}</Option>)}
//         </Select>
//       </div>
//       <Table dataSource={rows} columns={cols} size="small" scroll={{ x: 1100 }} pagination={{ pageSize: 10, size: "small" }} />
//     </>
//   );
// };

// // ── AdvertiserDetailBackup ──────────────────────────────────────────────────────────

// const AdvertiserDetailBackup = ({ _mockData }) => {
//   const { advertiser_id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(_mockData || null);
//   const [loading, setLoading] = useState(!_mockData);
//   const [viewMode, setViewMode] = useState("chart");
//   const [mainTab, setMainTab] = useState("bases");

//     const fetchd = async () => {
//     try {
//         const res = await get_advertisers_detail(advertiser_id);
//         console.log(res)
//         setData(res);
//     } catch (e) {
//         console.error(e);
//     } finally {
//         setLoading(false);
//     }
//     };

// useEffect(() => {
//   fetchd();
// }, [advertiser_id]);


//   if (loading) return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 12 }}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       <div style={{ width: 34, height: 34, border: "3px solid #eee", borderTop: "3px solid #1890ff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
//       <span style={{ color: "#aaa", fontSize: 13 }}>Chargement…</span>
//     </div>
//   );

//   if (!data) return (
//     <div style={{ padding: 24 }}>
//       <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>Retour</Button>
//       <Card style={{ borderRadius: 12, textAlign: "center", padding: 48 }}>
//         <p style={{ color: "#aaa" }}>Aucune donnée pour l'advertiser <b>#{advertiser_id}</b>.</p>
//       </Card>
//     </div>
//   );

//   const mainTabItems = [
//     {
//       key: "global",
//       label: "Analyse globale",
//       children: (
//         <div style={{ paddingTop: 14 }}>
//           <KpiStrip g={data.globales} />
//           <AnalyseBadges analyses={data.globales.analyses} />
//         </div>
//       ),
//     },
//     {
//       key: "bases",
//       label: `Bases (${data.bases?.length || 0})`,
//       children: (
//         <div style={{ paddingTop: 14 }}>
//           {viewMode === "chart" ? <GlobalCharts bases={data.bases} /> : <GlobalTable bases={data.bases} />}
//           <div style={{ marginTop: 8 }}>
//             {data.bases.map((base) => <BaseCard key={base.database_id} base={base} viewMode={viewMode} />)}
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 24, minHeight: "100vh", background: "#f5f6fa" }}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Retour</Button>
//           <div>
//             <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Advertiser #{data.advertiser_id}</div>
//             <div style={{ fontSize: 12, color: "#aaa" }}>
//               {data.bases?.length} base(s) · {data.globales?.sends?.toLocaleString()} sends total
//             </div>
//           </div>
//         </div>
//         <Segmented
//           value={viewMode}
//           onChange={setViewMode}
//           options={[
//             { label: "Charts",   value: "chart", icon: <BarChartOutlined /> },
//             { label: "Tableaux", value: "table", icon: <TableOutlined /> },
//           ]}
//         />
//       </div>

//       <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: "0 20px 20px" }}>
//         <Tabs activeKey={mainTab} onChange={setMainTab} items={mainTabItems} />
//       </Card>
//     </div>
//   );
// };

// export default AdvertiserDetailBackup;

// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useRef, useState, useMemo, useCallback } from "react";
// import {
//   Button, Card, Col, Row, Tag, Table, Select, Tabs, Tooltip, Segmented,
//   Statistic, Progress, Divider, Badge, Space, Typography, Empty, Dropdown,
// } from "antd";
// import {
//   ArrowLeftOutlined, BarChartOutlined, TableOutlined,
//   MailOutlined, EyeOutlined, LinkOutlined, StopOutlined, GlobalOutlined,
//   DashboardOutlined, DatabaseOutlined, RiseOutlined, FallOutlined,
//   FireOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined,
//   DownloadOutlined, FilterOutlined, InfoCircleOutlined, StarOutlined,
//   TeamOutlined, DollarOutlined, ThunderboltOutlined, PieChartOutlined,
//   AreaChartOutlined, FundOutlined, TrophyOutlined, AlertOutlined,
//   MoreOutlined, FullscreenOutlined, ReloadOutlined,
// } from "@ant-design/icons";
// import { Chart, registerables } from "chart.js";
// import { get_advertisers_detail } from "../../api/advertiser";

// Chart.register(...registerables);

// const { Option } = Select;
// const { Title, Text } = Typography;

// // ── Design Tokens ────────────────────────────────────────────────────────────

// const tokens = {
//   bg: "#f0f2f5",
//   cardBg: "#ffffff",
//   cardRadius: 16,
//   headerGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//   primary: "#4f46e5",
//   success: "#10b981",
//   warning: "#f59e0b",
//   danger: "#ef4444",
//   info: "#3b82f6",
//   purple: "#8b5cf6",
//   cyan: "#06b6d4",
//   pink: "#ec4899",
//   orange: "#f97316",
//   shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
//   shadowMd: "0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.03)",
//   shadowLg: "0 10px 25px rgba(0,0,0,0.08)",
// };

// const CHART_PALETTE = [
//   "#4f46e5", "#10b981", "#f59e0b", "#ef4444",
//   "#8b5cf6", "#06b6d4", "#ec4899", "#f97316",
//   "#14b8a6", "#6366f1", "#84cc16", "#e11d48",
// ];

// // ── Helpers ──────────────────────────────────────────────────────────────────

// const fmt = (v) => Number(v ?? 0).toLocaleString("fr-FR");
// const pct = (v) => `${Number(v ?? 0).toFixed(2)}%`;
// const usd = (v) => `$${Number(v ?? 0).toFixed(2)}`;

// const getHealthScore = (g) => {
//   const openRate = Number(g.taux_openers || 0);
//   const ctr = Number(g.taux_clickers || 0);
//   const unsubRate = Number(g.taux_unsubs || 0);
//   let score = 0;
//   if (openRate > 15) score += 35; else if (openRate > 10) score += 25; else if (openRate > 5) score += 15; else score += 5;
//   if (ctr > 3) score += 35; else if (ctr > 1.5) score += 25; else if (ctr > 0.5) score += 15; else score += 5;
//   if (unsubRate < 0.1) score += 30; else if (unsubRate < 0.3) score += 20; else if (unsubRate < 0.5) score += 10; else score += 0;
//   return Math.min(100, score);
// };

// const getHealthColor = (score) => {
//   if (score >= 75) return tokens.success;
//   if (score >= 50) return tokens.warning;
//   if (score >= 25) return tokens.orange;
//   return tokens.danger;
// };

// const getHealthLabel = (score) => {
//   if (score >= 75) return "Excellent";
//   if (score >= 50) return "Bon";
//   if (score >= 25) return "Moyen";
//   return "Critique";
// };

// const clsConfig = {
//   A: { color: "#10b981", bg: "#ecfdf5", label: "Premium", icon: <TrophyOutlined /> },
//   B: { color: "#3b82f6", bg: "#eff6ff", label: "Bon", icon: <StarOutlined /> },
//   C: { color: "#f59e0b", bg: "#fffbeb", label: "Standard", icon: <AlertOutlined /> },
//   D: { color: "#ef4444", bg: "#fef2f2", label: "À surveiller", icon: <WarningOutlined /> },
// };

// const tagColor = (txt) => {
//   if (!txt) return "default";
//   if (txt.includes("🟢") || txt.includes("✅")) return "success";
//   if (txt.includes("🟡") || txt.includes("🔶") || txt.includes("😐")) return "warning";
//   if (txt.includes("🔴") || txt.includes("🚨")) return "error";
//   if (txt.includes("⚠️")) return "warning";
//   if (txt.includes("🔥")) return "purple";
//   if (txt.includes("👍")) return "processing";
//   return "default";
// };

// // ── Styles ───────────────────────────────────────────────────────────────────

// const styles = {
//   page: {
//     padding: "24px 28px",
//     minHeight: "100vh",
//     background: tokens.bg,
//     fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//   },
//   headerCard: {
//     background: tokens.headerGradient,
//     borderRadius: tokens.cardRadius,
//     border: "none",
//     marginBottom: 24,
//     boxShadow: tokens.shadowLg,
//     overflow: "hidden",
//   },
//   card: {
//     borderRadius: tokens.cardRadius,
//     border: "1px solid #e5e7eb",
//     boxShadow: tokens.shadow,
//     overflow: "hidden",
//   },
//   kpiCard: {
//     borderRadius: 14,
//     border: "1px solid #e5e7eb",
//     boxShadow: tokens.shadow,
//     transition: "all 0.2s ease",
//     cursor: "default",
//     overflow: "hidden",
//     height: "100%",
//   },
//   sectionTitle: {
//     fontSize: 15,
//     fontWeight: 700,
//     color: "#1f2937",
//     marginBottom: 16,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//   },
//   badge: {
//     padding: "3px 10px",
//     borderRadius: 20,
//     fontSize: 11,
//     fontWeight: 600,
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 4,
//   },
// };

// // ── SmartChart ────────────────────────────────────────────────────────────────

// const SmartChart = ({ type, labels, datasets, height = 240, options: extraOpts = {} }) => {
//   const ref = useRef(null);
//   const chartRef = useRef(null);
//   const depsKey = JSON.stringify({ labels, datasets });

//   useEffect(() => {
//     if (!ref.current) return;
//     if (chartRef.current) chartRef.current.destroy();

//     const isDoughnut = type === "doughnut" || type === "pie";
//     const isLine = type === "line";

//     chartRef.current = new Chart(ref.current, {
//       type,
//       data: { labels, datasets },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         interaction: { mode: "index", intersect: false },
//         plugins: {
//           legend: {
//             display: datasets.length > 1 || isDoughnut,
//             position: isDoughnut ? "right" : "bottom",
//             labels: {
//               boxWidth: 8,
//               boxHeight: 8,
//               borderRadius: 4,
//               useBorderRadius: true,
//               font: { size: 11, family: "'Inter', sans-serif", weight: "500" },
//               padding: 12,
//               color: "#6b7280",
//             },
//           },
//           tooltip: {
//             backgroundColor: "rgba(17,24,39,0.9)",
//             titleFont: { size: 12, family: "'Inter', sans-serif", weight: "600" },
//             bodyFont: { size: 11, family: "'Inter', sans-serif" },
//             padding: 10,
//             cornerRadius: 8,
//             displayColors: true,
//             boxWidth: 8,
//             boxHeight: 8,
//             boxPadding: 4,
//           },
//         },
//         scales: !isDoughnut ? {
//           x: {
//             grid: { display: false },
//             ticks: { font: { size: 10, family: "'Inter', sans-serif" }, color: "#9ca3af", maxRotation: 45 },
//             border: { display: false },
//           },
//           y: {
//             grid: { color: "rgba(0,0,0,0.04)", drawBorder: false },
//             ticks: { font: { size: 10, family: "'Inter', sans-serif" }, color: "#9ca3af", padding: 8 },
//             border: { display: false },
//           },
//         } : undefined,
//         ...extraOpts,
//       },
//     });
//     return () => chartRef.current?.destroy();
//   }, [depsKey, type]);

//   return (
//     <div style={{ position: "relative", width: "100%", height }}>
//       <canvas ref={ref} />
//     </div>
//   );
// };

// // ── HealthGauge ──────────────────────────────────────────────────────────────

// const HealthGauge = ({ score }) => {
//   const color = getHealthColor(score);
//   const label = getHealthLabel(score);
//   return (
//     <div style={{ textAlign: "center" }}>
//       <Progress
//         type="dashboard"
//         percent={score}
//         strokeColor={{
//           "0%": color,
//           "100%": score >= 50 ? tokens.success : tokens.danger,
//         }}
//         trailColor="#f3f4f6"
//         strokeWidth={8}
//         width={130}
//         format={() => (
//           <div>
//             <div style={{ fontSize: 26, fontWeight: 800, color }}>{score}</div>
//             <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{label}</div>
//           </div>
//         )}
//       />
//     </div>
//   );
// };

// // ── KpiCard ──────────────────────────────────────────────────────────────────

// const KpiCard = ({ icon, label, value, color, subtitle, trend }) => (
//   <div
//     style={styles.kpiCard}
//     onMouseEnter={(e) => { e.currentTarget.style.boxShadow = tokens.shadowMd; e.currentTarget.style.transform = "translateY(-2px)"; }}
//     onMouseLeave={(e) => { e.currentTarget.style.boxShadow = tokens.shadow; e.currentTarget.style.transform = "translateY(0)"; }}
//   >
//     <div style={{ padding: "16px 18px" }}>
//       <div style={{
//         display: "flex", alignItems: "flex-start", justifyContent: "space-between",
//       }}>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
//             {label}
//           </div>
//           <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
//             {value}
//           </div>
//           {subtitle && (
//             <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{subtitle}</div>
//           )}
//         </div>
//         <div style={{
//           width: 42, height: 42, borderRadius: 12,
//           background: `${color}12`, display: "flex",
//           alignItems: "center", justifyContent: "center",
//           color, fontSize: 18, flexShrink: 0,
//         }}>
//           {icon}
//         </div>
//       </div>
//       {trend !== undefined && (
//         <div style={{
//           marginTop: 8, display: "flex", alignItems: "center", gap: 4,
//           fontSize: 11, fontWeight: 600,
//           color: trend >= 0 ? tokens.success : tokens.danger,
//         }}>
//           {trend >= 0 ? <RiseOutlined /> : <FallOutlined />}
//           {Math.abs(trend)}% vs moy.
//         </div>
//       )}
//     </div>
//     <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
//   </div>
// );

// // ── KpiDashboard ─────────────────────────────────────────────────────────────

// const KpiDashboard = ({ g }) => {
//   const kpis = [
//     { icon: <MailOutlined />,          label: "Total Sends",    value: fmt(g.sends),          color: tokens.primary,  subtitle: "Emails envoyés" },
//     { icon: <EyeOutlined />,           label: "Openers",        value: fmt(g.openers),        color: tokens.success,  subtitle: pct(g.taux_openers) + " open rate" },
//     { icon: <LinkOutlined />,          label: "Clickers",       value: fmt(g.clickers),       color: tokens.warning,  subtitle: pct(g.taux_clickers) + " CTR" },
//     { icon: <StopOutlined />,          label: "Unsubs",         value: fmt(g.unsubs),         color: tokens.danger,   subtitle: pct(g.taux_unsubs) + " unsub rate" },
//     { icon: <ThunderboltOutlined />,   label: "CTO",            value: pct(g.taux_cto),       color: tokens.cyan,     subtitle: "Click-to-Open" },
//     { icon: <DollarOutlined />,        label: "eCPM",           value: usd(g.ecpm),           color: tokens.purple,   subtitle: "Revenue / 1k" },
//     { icon: <DollarOutlined />,        label: "Chiffre d'aff.", value: usd(g.ca),             color: tokens.pink,     subtitle: "Revenue total" },
//   ];

//   return (
//     <Row gutter={[14, 14]}>
//       {kpis.map((kpi) => (
//         <Col key={kpi.label} xs={12} sm={8} md={6} lg={6} xl={3}>
//           <KpiCard {...kpi} />
//         </Col>
//       ))}
//       <Col xs={24} sm={8} md={6} lg={6} xl={3}>
//         <div style={{ ...styles.kpiCard, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
//           <HealthGauge score={getHealthScore(g)} />
//         </div>
//       </Col>
//     </Row>
//   );
// };

// // ── AnalyseBadges ────────────────────────────────────────────────────────────

// const AnalyseBadges = ({ analyses, compact = false }) => {
//   if (!analyses || Object.keys(analyses).length === 0) return <Text type="secondary" style={{ fontSize: 11 }}>Aucune analyse</Text>;

//   return (
//     <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//       {Object.entries(analyses).map(([k, v]) => (
//         <Tooltip key={k} title={k}>
//           <Tag
//             color={tagColor(v)}
//             style={{
//               fontSize: compact ? 10 : 11,
//               margin: 0,
//               borderRadius: 6,
//               fontWeight: 500,
//               padding: compact ? "0 6px" : "2px 8px",
//               lineHeight: compact ? "18px" : "22px",
//               maxWidth: compact ? 150 : 220,
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {v}
//           </Tag>
//         </Tooltip>
//       ))}
//     </div>
//   );
// };

// // ── RateBar ──────────────────────────────────────────────────────────────────

// const RateBar = ({ label, value, color, max = 100 }) => (
//   <div style={{ marginBottom: 10 }}>
//     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
//       <Text style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{label}</Text>
//       <Text style={{ fontSize: 11, fontWeight: 700, color }}>{pct(value)}</Text>
//     </div>
//     <div style={{ height: 6, borderRadius: 3, background: "#f3f4f6", overflow: "hidden" }}>
//       <div style={{
//         height: "100%", borderRadius: 3,
//         width: `${Math.min((Number(value || 0) / max) * 100, 100)}%`,
//         background: `linear-gradient(90deg, ${color}, ${color}bb)`,
//         transition: "width 0.6s ease",
//       }} />
//     </div>
//   </div>
// );

// // ── FunnelViz ────────────────────────────────────────────────────────────────

// const FunnelViz = ({ g }) => {
//   const steps = [
//     { label: "Sends", value: g.sends || 0, color: tokens.primary, icon: <MailOutlined /> },
//     { label: "Openers", value: g.openers || 0, color: tokens.success, icon: <EyeOutlined /> },
//     { label: "Clickers", value: g.clickers || 0, color: tokens.warning, icon: <LinkOutlined /> },
//   ];
//   const maxVal = steps[0].value || 1;

//   return (
//     <div style={{ padding: "8px 0" }}>
//       {steps.map((step, i) => {
//         const widthPct = Math.max((step.value / maxVal) * 100, 12);
//         const dropRate = i > 0 ? ((1 - step.value / (steps[i - 1].value || 1)) * 100).toFixed(1) : null;
//         return (
//           <div key={step.label} style={{ marginBottom: i < steps.length - 1 ? 6 : 0 }}>
//             {dropRate && (
//               <div style={{ textAlign: "center", fontSize: 10, color: tokens.danger, fontWeight: 600, marginBottom: 3 }}>
//                 <FallOutlined /> -{dropRate}%
//               </div>
//             )}
//             <div style={{
//               display: "flex", alignItems: "center", gap: 10,
//             }}>
//               <div style={{
//                 width: 28, height: 28, borderRadius: 8,
//                 background: `${step.color}15`, display: "flex",
//                 alignItems: "center", justifyContent: "center",
//                 color: step.color, fontSize: 13, flexShrink: 0,
//               }}>
//                 {step.icon}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div style={{
//                   height: 28, borderRadius: 8,
//                   background: `linear-gradient(90deg, ${step.color}22, ${step.color}08)`,
//                   position: "relative", overflow: "hidden",
//                 }}>
//                   <div style={{
//                     height: "100%", borderRadius: 8, width: `${widthPct}%`,
//                     background: `linear-gradient(90deg, ${step.color}, ${step.color}cc)`,
//                     display: "flex", alignItems: "center", paddingLeft: 10,
//                     transition: "width 0.8s ease",
//                   }}>
//                     <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
//                       {fmt(step.value)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <Text style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", minWidth: 50, textAlign: "right" }}>
//                 {step.label}
//               </Text>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// // ── DimSection (Charts + Tables) ─────────────────────────────────────────────

// const DIM_KEYS = [
//   { key: "age_range", label: "Tranche d'âge", icon: <TeamOutlined /> },
//   { key: "gender",    label: "Genre",          icon: <TeamOutlined /> },
//   { key: "isp",       label: "ISP / FAI",      icon: <GlobalOutlined /> },
// ];

// const dimCols = [
//   { title: "Segment",  dataIndex: "segment",       fixed: "left", width: 120, render: (v) => <Text strong style={{ fontSize: 12 }}>{v}</Text> },
//   { title: "Sends",    dataIndex: "sends",         sorter: (a, b) => a.sends - b.sends,               render: fmt, align: "right" },
//   { title: "Openers",  dataIndex: "openers",       sorter: (a, b) => a.openers - b.openers,           render: fmt, align: "right" },
//   { title: "Clickers", dataIndex: "clickers",      sorter: (a, b) => a.clickers - b.clickers,         render: fmt, align: "right" },
//   { title: "Unsubs",   dataIndex: "unsubs",        sorter: (a, b) => a.unsubs - b.unsubs,             render: fmt, align: "right" },
//   { title: "Open %",   dataIndex: "taux_openers",  sorter: (a, b) => a.taux_openers - b.taux_openers, render: (v) => <Text style={{ color: tokens.success, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
//   { title: "CTR %",    dataIndex: "taux_clickers", sorter: (a, b) => a.taux_clickers - b.taux_clickers, render: (v) => <Text style={{ color: tokens.warning, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
//   { title: "Unsub %",  dataIndex: "taux_unsubs",   sorter: (a, b) => a.taux_unsubs - b.taux_unsubs,   render: (v) => <Text style={{ color: tokens.danger, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
//   { title: "CTO %",    dataIndex: "taux_cto",      sorter: (a, b) => a.taux_cto - b.taux_cto,         render: pct, align: "right" },
//   { title: "Analyses", dataIndex: "analyses",      width: 280, render: (a) => <AnalyseBadges analyses={a} compact /> },
// ];

// const DimSection = ({ dimensions, viewMode }) => {
//   const [dimFilters, setDimFilters] = useState({});

//   return (
//     <Row gutter={[16, 16]}>
//       {DIM_KEYS.map(({ key, label, icon }) => {
//         const dim = dimensions?.[key];
//         if (!dim) return null;
//         const entries = Object.entries(dim).filter(([, v]) => v.sends > 0);
//         if (entries.length === 0) return null;

//         const f = dimFilters[key] || {};
//         const rows = entries.map(([seg, v]) => ({ key: seg, segment: seg, ...v }));
//         const filtered = rows.filter((r) => {
//           if (f.minSends && r.sends < Number(f.minSends)) return false;
//           return true;
//         });

//         return (
//           <Col key={key} xs={24} lg={viewMode === "chart" ? 8 : 24}>
//             <Card
//               size="small"
//               style={styles.card}
//               title={
//                 <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
//                   <span style={{ color: tokens.primary }}>{icon}</span>
//                   {label}
//                   <Tag style={{ marginLeft: "auto", borderRadius: 10, fontSize: 10 }}>{entries.length}</Tag>
//                 </div>
//               }
//               extra={viewMode === "table" && (
//                 <Select
//                   placeholder="Min sends" allowClear size="small"
//                   style={{ width: 130 }}
//                   onChange={(v) => setDimFilters((p) => ({ ...p, [key]: { ...p[key], minSends: v } }))}
//                 >
//                   {[100, 500, 1000, 5000, 10000].map((n) => <Option key={n} value={n}>≥ {fmt(n)}</Option>)}
//                 </Select>
//               )}
//             >
//               {viewMode === "chart" ? (
//                 <SmartChart
//                   type="bar"
//                   labels={entries.map(([k]) => k)}
//                   height={220}
//                   datasets={[
//                     { label: "Sends",    data: entries.map(([, v]) => v.sends),    backgroundColor: `${tokens.primary}55`, borderColor: tokens.primary, borderWidth: 1.5, borderRadius: 4 },
//                     { label: "Openers",  data: entries.map(([, v]) => v.openers),  backgroundColor: `${tokens.success}55`, borderColor: tokens.success, borderWidth: 1.5, borderRadius: 4 },
//                     { label: "Clickers", data: entries.map(([, v]) => v.clickers), backgroundColor: `${tokens.warning}55`, borderColor: tokens.warning, borderWidth: 1.5, borderRadius: 4 },
//                   ]}
//                 />
//               ) : (
//                 <Table
//                   dataSource={filtered}
//                   columns={dimCols}
//                   size="small"
//                   rowKey="segment"
//                   pagination={{ pageSize: 6, size: "small", showSizeChanger: false }}
//                   scroll={{ x: 900 }}
//                   style={{ marginTop: 4 }}
//                 />
//               )}
//             </Card>
//           </Col>
//         );
//       })}
//     </Row>
//   );
// };

// // ── BrandSection ─────────────────────────────────────────────────────────────

// const brandCols = [
//   {
//     title: "Brand", dataIndex: "name", fixed: "left", width: 140,
//     render: (v) => <Text strong style={{ fontSize: 12 }}>{v}</Text>,
//   },
//   {
//     title: "Créa", dataIndex: "creativities", width: 200,
//     render: (url) => url && url !== "url_vide"
//       ? <Tooltip title={url}>
//           <a href={url} target="_blank" rel="noreferrer"
//             style={{ fontSize: 11, color: tokens.primary, maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", whiteSpace: "nowrap" }}>
//             <LinkOutlined style={{ marginRight: 4 }} />{url.length > 30 ? url.slice(0, 30) + "…" : url}
//           </a>
//         </Tooltip>
//       : <Text type="secondary" style={{ fontSize: 11 }}>—</Text>,
//   },
//   { title: "Sends",    dataIndex: "sends",         sorter: (a, b) => a.sends - b.sends,               render: fmt, align: "right" },
//   { title: "Openers",  dataIndex: "openers",       sorter: (a, b) => a.openers - b.openers,           render: fmt, align: "right" },
//   { title: "Clickers", dataIndex: "clickers",      sorter: (a, b) => a.clickers - b.clickers,         render: fmt, align: "right" },
//   { title: "Unsubs",   dataIndex: "unsubs",        sorter: (a, b) => a.unsubs - b.unsubs,             render: fmt, align: "right" },
//   { title: "Open %",   dataIndex: "taux_openers",  sorter: (a, b) => (a.taux_openers || 0) - (b.taux_openers || 0), render: (v) => <Text style={{ color: tokens.success, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
//   { title: "CTR %",    dataIndex: "taux_clickers", sorter: (a, b) => a.taux_clickers - b.taux_clickers, render: (v) => <Text style={{ color: tokens.warning, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
//   { title: "CTO %",    dataIndex: "taux_cto",      sorter: (a, b) => a.taux_cto - b.taux_cto,         render: pct, align: "right" },
//   { title: "Unsub %",  dataIndex: "taux_unsubs",   sorter: (a, b) => a.taux_unsubs - b.taux_unsubs,   render: (v) => <Text style={{ color: tokens.danger, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
//   { title: "Analyses", dataIndex: "analyses",      width: 260, render: (a) => <AnalyseBadges analyses={a} compact /> },
// ];

// // ── BaseCard ─────────────────────────────────────────────────────────────────

// const BaseCard = ({ base, viewMode }) => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const cls = clsConfig[base.classification] || clsConfig.C;
//   const health = getHealthScore(base);

//   return (
//     <Card
//       style={{
//         ...styles.card,
//         marginBottom: 16,
//         borderLeft: `4px solid ${cls.color}`,
//       }}
//       bodyStyle={{ padding: 0 }}
//     >
//       {/* Header */}
//       <div style={{
//         padding: "14px 20px",
//         borderBottom: "1px solid #f3f4f6",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         flexWrap: "wrap", gap: 10,
//         background: `linear-gradient(90deg, ${cls.bg}, transparent)`,
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <div style={{
//             width: 38, height: 38, borderRadius: 10,
//             background: `${cls.color}18`, display: "flex",
//             alignItems: "center", justifyContent: "center",
//             color: cls.color, fontSize: 16, fontWeight: 700,
//           }}>
//             <DatabaseOutlined />
//           </div>
//           <div>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <Text style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
//                 Database #{base.database_id}
//               </Text>
//               <span style={{
//                 ...styles.badge,
//                 color: cls.color, background: cls.bg,
//               }}>
//                 {cls.icon} {cls.label}
//               </span>
//               <Tag color="purple" style={{ borderRadius: 6, fontSize: 10, margin: 0, fontFamily: "monospace" }}>
//                 Router {base.id_routers}
//               </Tag>
//             </div>
//             {base.date_schedule && (
//               <Text style={{ fontSize: 11, color: "#9ca3af" }}>
//                 Planifié: {base.date_schedule.join(", ")}
//               </Text>
//             )}
//           </div>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//           <div style={{ textAlign: "center" }}>
//             <Progress
//               type="circle" percent={health} width={40} strokeWidth={8}
//               strokeColor={getHealthColor(health)}
//               trailColor="#f3f4f6"
//               format={() => <span style={{ fontSize: 10, fontWeight: 700, color: getHealthColor(health) }}>{health}</span>}
//             />
//           </div>
//           <div style={{ display: "flex", gap: 16 }}>
//             {[
//               { l: "Sends", v: fmt(base.sends), c: tokens.primary },
//               { l: "Open%", v: pct(base.taux_openers), c: tokens.success },
//               { l: "CTR%",  v: pct(base.taux_clickers), c: tokens.warning },
//             ].map(({ l, v, c }) => (
//               <div key={l} style={{ textAlign: "center" }}>
//                 <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>{l}</div>
//                 <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div style={{ padding: "0 20px 16px" }}>
//         <Tabs
//           activeKey={activeTab}
//           onChange={setActiveTab}
//           size="small"
//           style={{ marginBottom: 0 }}
//           items={[
//             {
//               key: "overview",
//               label: <span><DashboardOutlined /> Vue globale</span>,
//               children: (
//                 <Row gutter={[16, 16]} style={{ paddingTop: 8 }}>
//                   <Col xs={24} md={14}>
//                     <Row gutter={[10, 10]}>
//                       {[
//                         { l: "Sends",   v: fmt(base.sends),    c: tokens.primary, i: <MailOutlined /> },
//                         { l: "Openers", v: fmt(base.openers),  c: tokens.success, i: <EyeOutlined /> },
//                         { l: "Clickers", v: fmt(base.clickers), c: tokens.warning, i: <LinkOutlined /> },
//                         { l: "Unsubs",  v: fmt(base.unsubs),   c: tokens.danger,  i: <StopOutlined /> },
//                         { l: "eCPM",    v: usd(base.ecpm),     c: tokens.purple,  i: <DollarOutlined /> },
//                         { l: "CA",      v: usd(base.ca),       c: tokens.cyan,    i: <DollarOutlined /> },
//                       ].map(({ l, v, c, i }) => (
//                         <Col key={l} xs={8}>
//                           <div style={{
//                             padding: "10px 12px", borderRadius: 10,
//                             border: "1px solid #f3f4f6", background: "#fafafa",
//                           }}>
//                             <div style={{ fontSize: 10, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
//                               <span style={{ color: c }}>{i}</span>{l}
//                             </div>
//                             <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{v}</div>
//                           </div>
//                         </Col>
//                       ))}
//                     </Row>
//                     <div style={{ marginTop: 12 }}>
//                       <RateBar label="Open Rate" value={base.taux_openers} color={tokens.success} max={50} />
//                       <RateBar label="Click Rate" value={base.taux_clickers} color={tokens.warning} max={10} />
//                       <RateBar label="Unsub Rate" value={base.taux_unsubs} color={tokens.danger} max={2} />
//                     </div>
//                   </Col>
//                   <Col xs={24} md={10}>
//                     <div style={{ marginBottom: 12 }}>
//                       <Text style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Funnel de conversion</Text>
//                     </div>
//                     <FunnelViz g={base} />
//                     <Divider style={{ margin: "12px 0" }} />
//                     <Text style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Analyses</Text>
//                     <AnalyseBadges analyses={base.analyses} />
//                   </Col>
//                 </Row>
//               ),
//             },
//             {
//               key: "brands",
//               label: <span><FireOutlined /> Brands ({base.brands?.length || 0})</span>,
//               children: (
//                 <div style={{ paddingTop: 8 }}>
//                   {viewMode === "chart" ? (
//                     <Row gutter={[14, 14]}>
//                       <Col xs={24} lg={14}>
//                         <SmartChart
//                           type="bar"
//                           labels={base.brands?.map((b) => b.name) || []}
//                           height={240}
//                           datasets={[
//                             { label: "Sends",    data: base.brands?.map((b) => b.sends) || [],    backgroundColor: `${tokens.primary}77`, borderColor: tokens.primary, borderWidth: 1.5, borderRadius: 5 },
//                             { label: "Openers",  data: base.brands?.map((b) => b.openers) || [],  backgroundColor: `${tokens.success}77`, borderColor: tokens.success, borderWidth: 1.5, borderRadius: 5 },
//                             { label: "Clickers", data: base.brands?.map((b) => b.clickers) || [], backgroundColor: `${tokens.warning}77`, borderColor: tokens.warning, borderWidth: 1.5, borderRadius: 5 },
//                           ]}
//                         />
//                       </Col>
//                       <Col xs={24} lg={10}>
//                         <SmartChart
//                           type="doughnut"
//                           labels={base.brands?.map((b) => b.name) || []}
//                           height={240}
//                           datasets={[{
//                             data: base.brands?.map((b) => b.sends) || [],
//                             backgroundColor: CHART_PALETTE.slice(0, base.brands?.length || 0),
//                             borderWidth: 2,
//                             borderColor: "#fff",
//                           }]}
//                         />
//                       </Col>
//                     </Row>
//                   ) : (
//                     <Table
//                       dataSource={base.brands?.map((b, i) => ({ key: i, ...b })) || []}
//                       columns={brandCols}
//                       size="small"
//                       pagination={{ pageSize: 8, size: "small", showSizeChanger: false }}
//                       scroll={{ x: 1100 }}
//                     />
//                   )}
//                 </div>
//               ),
//             },
//             {
//               key: "dimensions",
//               label: <span><PieChartOutlined /> Dimensions</span>,
//               children: (
//                 <div style={{ paddingTop: 8 }}>
//                   <DimSection dimensions={base.dimensions} viewMode={viewMode} />
//                 </div>
//               ),
//             },
//           ]}
//         />
//       </div>
//     </Card>
//   );
// };

// // ── GlobalOverview ───────────────────────────────────────────────────────────

// const GlobalOverview = ({ data }) => {
//   const g = data.globales;
//   const health = getHealthScore(g);

//   return (
//     <div>
//       <KpiDashboard g={g} />

//       <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
//         {/* Funnel */}
//         <Col xs={24} md={8}>
//           <Card size="small" style={styles.card}
//             title={<span style={styles.sectionTitle}><FundOutlined style={{ color: tokens.primary }} /> Funnel</span>}>
//             <FunnelViz g={g} />
//           </Card>
//         </Col>

//         {/* Rates */}
//         <Col xs={24} md={8}>
//           <Card size="small" style={styles.card}
//             title={<span style={styles.sectionTitle}><AreaChartOutlined style={{ color: tokens.success }} /> Taux clés</span>}>
//             <div style={{ padding: "8px 0" }}>
//               <RateBar label="Open Rate" value={g.taux_openers} color={tokens.success} max={50} />
//               <RateBar label="Click Rate (CTR)" value={g.taux_clickers} color={tokens.warning} max={10} />
//               <RateBar label="Click-to-Open (CTO)" value={g.taux_cto} color={tokens.cyan} max={30} />
//               <RateBar label="Unsub Rate" value={g.taux_unsubs} color={tokens.danger} max={2} />
//             </div>
//           </Card>
//         </Col>

//         {/* Analyses */}
//         <Col xs={24} md={8}>
//           <Card size="small" style={styles.card}
//             title={<span style={styles.sectionTitle}><CheckCircleOutlined style={{ color: tokens.success }} /> Diagnostic</span>}>
//             <div style={{ padding: "8px 0" }}>
//               <div style={{ marginBottom: 14, textAlign: "center" }}>
//                 <HealthGauge score={health} />
//               </div>
//               <Divider style={{ margin: "10px 0" }} />
//               <AnalyseBadges analyses={g.analyses} />
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       {/* Comparaison graphique */}
//       <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
//         <Col xs={24} lg={12}>
//           <Card size="small" style={styles.card}
//             title={<span style={styles.sectionTitle}><BarChartOutlined style={{ color: tokens.primary }} /> Volume par base</span>}>
//             <SmartChart
//               type="bar"
//               labels={data.bases.map((b) => `DB #${b.database_id}`)}
//               height={220}
//               datasets={[
//                 { label: "Sends",    data: data.bases.map((b) => b.sends),    backgroundColor: `${tokens.primary}66`, borderColor: tokens.primary, borderWidth: 1.5, borderRadius: 5 },
//                 { label: "Openers",  data: data.bases.map((b) => b.openers),  backgroundColor: `${tokens.success}66`, borderColor: tokens.success, borderWidth: 1.5, borderRadius: 5 },
//                 { label: "Clickers", data: data.bases.map((b) => b.clickers), backgroundColor: `${tokens.warning}66`, borderColor: tokens.warning, borderWidth: 1.5, borderRadius: 5 },
//               ]}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} lg={12}>
//           <Card size="small" style={styles.card}
//             title={<span style={styles.sectionTitle}><PieChartOutlined style={{ color: tokens.purple }} /> Répartition des sends</span>}>
//             <SmartChart
//               type="doughnut"
//               labels={data.bases.map((b) => `DB #${b.database_id}`)}
//               height={220}
//               datasets={[{
//                 data: data.bases.map((b) => b.sends),
//                 backgroundColor: CHART_PALETTE.slice(0, data.bases.length),
//                 borderWidth: 3,
//                 borderColor: "#fff",
//                 hoverBorderWidth: 0,
//               }]}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Taux par base */}
//       <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
//         <Col xs={24} lg={12}>
//           <Card size="small" style={styles.card}
//             title={<span style={styles.sectionTitle}><RiseOutlined style={{ color: tokens.success }} /> Taux d'engagement par base</span>}>
//             <SmartChart
//               type="line"
//               labels={data.bases.map((b) => `DB #${b.database_id}`)}
//               height={200}
//               datasets={[
//                 { label: "Open %",  data: data.bases.map((b) => b.taux_openers),  borderColor: tokens.success, backgroundColor: `${tokens.success}22`, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4, pointBackgroundColor: "#fff", pointBorderWidth: 2 },
//                 { label: "CTR %",   data: data.bases.map((b) => b.taux_clickers), borderColor: tokens.warning, backgroundColor: `${tokens.warning}22`, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4, pointBackgroundColor: "#fff", pointBorderWidth: 2 },
//                 { label: "Unsub %", data: data.bases.map((b) => b.taux_unsubs),   borderColor: tokens.danger,  backgroundColor: `${tokens.danger}22`,  fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4, pointBackgroundColor: "#fff", pointBorderWidth: 2 },
//               ]}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} lg={12}>
//           <Card size="small" style={styles.card}
//             title={<span style={styles.sectionTitle}><DollarOutlined style={{ color: tokens.pink }} /> Revenue par base</span>}>
//             <SmartChart
//               type="bar"
//               labels={data.bases.map((b) => `DB #${b.database_id}`)}
//               height={200}
//               datasets={[
//                 { label: "CA ($)",   data: data.bases.map((b) => b.ca || 0),   backgroundColor: `${tokens.pink}66`,   borderColor: tokens.pink,   borderWidth: 1.5, borderRadius: 5 },
//                 { label: "eCPM ($)", data: data.bases.map((b) => b.ecpm || 0), backgroundColor: `${tokens.purple}66`, borderColor: tokens.purple, borderWidth: 1.5, borderRadius: 5 },
//               ]}
//             />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// // ── GlobalTable ──────────────────────────────────────────────────────────────

// const GlobalTable = ({ bases }) => {
//   const [f, setF] = useState({ minSends: null, cls: null });

//   const rows = useMemo(() => {
//     let d = bases.map((b) => ({ key: b.database_id, ...b }));
//     if (f.minSends) d = d.filter((r) => r.sends >= f.minSends);
//     if (f.cls)      d = d.filter((r) => r.classification === f.cls);
//     return d;
//   }, [bases, f]);

//   const cols = [
//     {
//       title: "Database", dataIndex: "database_id", fixed: "left", width: 100,
//       render: (v) => <Text strong style={{ fontSize: 12 }}>DB #{v}</Text>,
//     },
//     {
//       title: "Router", dataIndex: "id_routers", width: 90,
//       render: (v) => <Tag color="purple" style={{ borderRadius: 6, fontSize: 10, margin: 0, fontFamily: "monospace" }}>{v}</Tag>,
//     },
//     {
//       title: "Classe", dataIndex: "classification", width: 110,
//       render: (v) => {
//         const c = clsConfig[v] || clsConfig.C;
//         return <span style={{ ...styles.badge, color: c.color, background: c.bg }}>{c.icon} {c.label}</span>;
//       },
//     },
//     {
//       title: "Health", dataIndex: "taux_openers", width: 80,
//       render: (_, r) => {
//         const s = getHealthScore(r);
//         return <Progress type="circle" percent={s} width={30} strokeWidth={10} strokeColor={getHealthColor(s)} format={() => <span style={{ fontSize: 9, fontWeight: 700 }}>{s}</span>} />;
//       },
//     },
//     { title: "Sends",    dataIndex: "sends",         sorter: (a, b) => a.sends - b.sends,               render: fmt, align: "right" },
//     { title: "Openers",  dataIndex: "openers",       sorter: (a, b) => a.openers - b.openers,           render: fmt, align: "right" },
//     { title: "Clickers", dataIndex: "clickers",      sorter: (a, b) => a.clickers - b.clickers,         render: fmt, align: "right" },
//     { title: "Unsubs",   dataIndex: "unsubs",        sorter: (a, b) => a.unsubs - b.unsubs,             render: fmt, align: "right" },
//     { title: "Open %",   dataIndex: "taux_openers",  sorter: (a, b) => a.taux_openers - b.taux_openers, render: (v) => <Text style={{ color: tokens.success, fontWeight: 600, fontSize: 12 }}>{pct(v)}</Text>, align: "right" },
//     { title: "CTR %",    dataIndex: "taux_clickers", sorter: (a, b) => a.taux_clickers - b.taux_clickers, render: (v) => <Text style={{ color: tokens.warning, fontWeight: 600, fontSize: 12 }}>{pct(v)}</Text>, align: "right" },
//     { title: "Unsub %",  dataIndex: "taux_unsubs",   sorter: (a, b) => a.taux_unsubs - b.taux_unsubs,   render: (v) => <Text style={{ color: tokens.danger, fontWeight: 600, fontSize: 12 }}>{pct(v)}</Text>, align: "right" },
//     { title: "CA",       dataIndex: "ca",            sorter: (a, b) => (a.ca || 0) - (b.ca || 0),       render: usd, align: "right" },
//     { title: "eCPM",     dataIndex: "ecpm",          sorter: (a, b) => (a.ecpm || 0) - (b.ecpm || 0),   render: usd, align: "right" },
//     { title: "Analyses", dataIndex: "analyses",      width: 260, render: (a) => <AnalyseBadges analyses={a} compact /> },
//   ];

//   return (
//     <Card size="small" style={styles.card}>
//       <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
//         <Select placeholder="Min sends" allowClear size="small" style={{ width: 160 }}
//           suffixIcon={<FilterOutlined />}
//           onChange={(v) => setF((p) => ({ ...p, minSends: v }))}>
//           {[100, 500, 1000, 5000, 10000, 20000].map((n) => <Option key={n} value={n}>≥ {fmt(n)} sends</Option>)}
//         </Select>
//         <Select placeholder="Classification" allowClear size="small" style={{ width: 150 }}
//           onChange={(v) => setF((p) => ({ ...p, cls: v }))}>
//           {Object.entries(clsConfig).map(([k, c]) => (
//             <Option key={k} value={k}><span style={{ color: c.color }}>{c.icon}</span> Classe {k} — {c.label}</Option>
//           ))}
//         </Select>
//         <div style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center" }}>
//           {rows.length} résultat(s)
//         </div>
//       </div>
//       <Table
//         dataSource={rows}
//         columns={cols}
//         size="small"
//         scroll={{ x: 1400 }}
//         pagination={{ pageSize: 10, size: "small", showSizeChanger: true, showTotal: (t) => <Text style={{ fontSize: 11, color: "#9ca3af" }}>{t} bases</Text> }}
//       />
//     </Card>
//   );
// };

// // ── Main Component ───────────────────────────────────────────────────────────

// const AdvertiserDetailBackup = ({ _mockData }) => {
//   const { advertiser_id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(_mockData || null);
//   const [loading, setLoading] = useState(!_mockData);
//   const [viewMode, setViewMode] = useState("chart");
//   const [mainTab, setMainTab] = useState("global");

//   const fetchd = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await get_advertisers_detail(advertiser_id);
//       setData(res);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }, [advertiser_id]);

//   useEffect(() => {
//     if (!_mockData) fetchd();
//   }, [advertiser_id, fetchd, _mockData]);

//   // ── Loading State ──
//   if (loading) return (
//     <div style={{
//       display: "flex", alignItems: "center", justifyContent: "center",
//       height: "80vh", flexDirection: "column", gap: 16, background: tokens.bg,
//     }}>
//       <style>{`
//         @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
//         @keyframes spin { to { transform: rotate(360deg) } }
//       `}</style>
//       <div style={{
//         width: 48, height: 48,
//         border: "3px solid #e5e7eb",
//         borderTop: `3px solid ${tokens.primary}`,
//         borderRadius: "50%",
//         animation: "spin 0.8s linear infinite",
//       }} />
//       <div>
//         <Text style={{ color: "#6b7280", fontSize: 14, fontWeight: 500, animation: "pulse 1.5s infinite" }}>
//           Chargement du rapport…
//         </Text>
//       </div>
//     </div>
//   );

//   // ── Empty State ──
//   if (!data) return (
//     <div style={{ ...styles.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
//       <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ position: "absolute", top: 24, left: 24 }}>Retour</Button>
//       <Empty
//         description={
//           <div>
//             <Text style={{ fontSize: 15, color: "#6b7280" }}>Aucune donnée disponible</Text>
//             <br />
//             <Text type="secondary" style={{ fontSize: 12 }}>Advertiser #{advertiser_id}</Text>
//           </div>
//         }
//       />
//       <Button type="primary" icon={<ReloadOutlined />} onClick={fetchd} style={{ marginTop: 16, borderRadius: 8 }}>
//         Réessayer
//       </Button>
//     </div>
//   );

//   const health = getHealthScore(data.globales);
//   const totalBrands = data.bases?.reduce((s, b) => s + (b.brands?.length || 0), 0) || 0;

//   return (
//     <div style={styles.page}>
//       {/* ── Header ── */}
//       <div style={{
//         ...styles.headerCard,
//         padding: "20px 28px",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         flexWrap: "wrap", gap: 14,
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//           <Button
//             icon={<ArrowLeftOutlined />}
//             onClick={() => navigate(-1)}
//             style={{
//               borderRadius: 10, border: "1px solid rgba(255,255,255,0.3)",
//               background: "rgba(255,255,255,0.15)", color: "#fff",
//             }}
//             ghost
//           />
//           <div>
//             <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
//               Advertiser #{data.advertiser_id}
//             </div>
//             <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
//               {[
//                 { icon: <DatabaseOutlined />, text: `${data.bases?.length || 0} bases` },
//                 { icon: <MailOutlined />,      text: `${fmt(data.globales?.sends)} sends` },
//                 { icon: <FireOutlined />,      text: `${totalBrands} brands` },
//               ].map(({ icon, text }) => (
//                 <span key={text} style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 4 }}>
//                   {icon} {text}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//           {/* Health badge */}
//           <div style={{
//             padding: "8px 16px", borderRadius: 12,
//             background: "rgba(255,255,255,0.15)",
//             backdropFilter: "blur(10px)",
//             display: "flex", alignItems: "center", gap: 10,
//           }}>
//             <Progress
//               type="circle" percent={health} width={36} strokeWidth={8}
//               strokeColor="#fff" trailColor="rgba(255,255,255,0.2)"
//               format={() => <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{health}</span>}
//             />
//             <div>
//               <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Health Score</div>
//               <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{getHealthLabel(health)}</div>
//             </div>
//           </div>

//           <Segmented
//             value={viewMode}
//             onChange={setViewMode}
//             style={{
//               background: "rgba(255,255,255,0.15)",
//               borderRadius: 10,
//             }}
//             options={[
//               { label: <span style={{ color: viewMode === "chart" ? tokens.primary : "#fff", padding: "2px 6px" }}><BarChartOutlined /> Charts</span>, value: "chart" },
//               { label: <span style={{ color: viewMode === "table" ? tokens.primary : "#fff", padding: "2px 6px" }}><TableOutlined /> Tables</span>, value: "table" },
//             ]}
//           />
//         </div>
//       </div>

//       {/* ── Main Content ── */}
//       <Card
//         style={{ ...styles.card, border: "none" }}
//         bodyStyle={{ padding: 0 }}
//       >
//         <Tabs
//           activeKey={mainTab}
//           onChange={setMainTab}
//           size="large"
//           style={{ padding: "0 24px" }}
//           tabBarStyle={{ marginBottom: 0, fontWeight: 600 }}
//           items={[
//             {
//               key: "global",
//               label: (
//                 <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                   <DashboardOutlined /> Analyse globale
//                 </span>
//               ),
//               children: (
//                 <div style={{ padding: "20px 4px 24px" }}>
//                   <GlobalOverview data={data} />
//                 </div>
//               ),
//             },
//             {
//               key: "bases",
//               label: (
//                 <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                   <DatabaseOutlined /> Bases
//                   <Badge count={data.bases?.length || 0} style={{ backgroundColor: tokens.primary, fontSize: 10, marginLeft: 2 }} />
//                 </span>
//               ),
//               children: (
//                 <div style={{ padding: "20px 4px 24px" }}>
//                   {viewMode === "table" && <GlobalTable bases={data.bases} />}
//                   {viewMode === "chart" && (
//                     <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
//                       <Col xs={24} md={12}>
//                         <Card size="small" style={styles.card}
//                           title={<span style={styles.sectionTitle}><BarChartOutlined style={{ color: tokens.primary }} /> Sends par base</span>}>
//                           <SmartChart
//                             type="bar"
//                             labels={data.bases.map((b) => `DB #${b.database_id}`)}
//                             height={200}
//                             datasets={[{
//                               label: "Sends",
//                               data: data.bases.map((b) => b.sends),
//                               backgroundColor: data.bases.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length] + "88"),
//                               borderColor: data.bases.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]),
//                               borderWidth: 1.5,
//                               borderRadius: 6,
//                             }]}
//                           />
//                         </Card>
//                       </Col>
//                       <Col xs={24} md={12}>
//                         <Card size="small" style={styles.card}
//                           title={<span style={styles.sectionTitle}><PieChartOutlined style={{ color: tokens.purple }} /> Répartition</span>}>
//                           <SmartChart
//                             type="doughnut"
//                             labels={data.bases.map((b) => `DB #${b.database_id}`)}
//                             height={200}
//                             datasets={[{
//                               data: data.bases.map((b) => b.sends),
//                               backgroundColor: CHART_PALETTE.slice(0, data.bases.length),
//                               borderWidth: 3, borderColor: "#fff",
//                             }]}
//                           />
//                         </Card>
//                       </Col>
//                     </Row>
//                   )}

//                   {/* Base Cards */}
//                   <div style={styles.sectionTitle}>
//                     <DatabaseOutlined style={{ color: tokens.primary }} />
//                     Détail par base ({data.bases?.length})
//                   </div>
//                   {data.bases.map((base) => (
//                     <BaseCard key={base.database_id} base={base} viewMode={viewMode} />
//                   ))}
//                 </div>
//               ),
//             },
//             {
//               key: "dimensions",
//               label: (
//                 <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                   <PieChartOutlined /> Dimensions globales
//                 </span>
//               ),
//               children: (
//                 <div style={{ padding: "20px 4px 24px" }}>
//                   {/* Merge all bases dimensions for global view */}
//                   {(() => {
//                     const merged = {};
//                     data.bases.forEach((base) => {
//                       if (!base.dimensions) return;
//                       Object.entries(base.dimensions).forEach(([dimKey, dimData]) => {
//                         if (!merged[dimKey]) merged[dimKey] = {};
//                         Object.entries(dimData).forEach(([seg, vals]) => {
//                           if (!merged[dimKey][seg]) merged[dimKey][seg] = { sends: 0, openers: 0, clickers: 0, unsubs: 0 };
//                           merged[dimKey][seg].sends    += vals.sends || 0;
//                           merged[dimKey][seg].openers  += vals.openers || 0;
//                           merged[dimKey][seg].clickers += vals.clickers || 0;
//                           merged[dimKey][seg].unsubs   += vals.unsubs || 0;
//                         });
//                       });
//                     });
//                     // Recalculate rates
//                     Object.values(merged).forEach((dimData) => {
//                       Object.values(dimData).forEach((v) => {
//                         v.taux_openers  = v.sends ? (v.openers / v.sends) * 100 : 0;
//                         v.taux_clickers = v.sends ? (v.clickers / v.sends) * 100 : 0;
//                         v.taux_unsubs   = v.sends ? (v.unsubs / v.sends) * 100 : 0;
//                         v.taux_cto      = v.openers ? (v.clickers / v.openers) * 100 : 0;
//                       });
//                     });

//                     return Object.keys(merged).length > 0
//                       ? <DimSection dimensions={merged} viewMode={viewMode} />
//                       : <Empty description="Aucune dimension disponible" />;
//                   })()}
//                 </div>
//               ),
//             },
//           ]}
//         />
//       </Card>

//       {/* Footer */}
//       <div style={{ textAlign: "center", padding: "20px 0 8px", color: "#9ca3af", fontSize: 11 }}>
//         Rapport généré automatiquement · Advertiser #{data.advertiser_id} · {new Date().toLocaleDateString("fr-FR")}
//       </div>
//     </div>
//   );
// };

// export default AdvertiserDetailBackup;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Button, Card, Col, Row, Tag, Table, Select, Tabs, Tooltip, Segmented,
  Statistic, Progress, Divider, Badge, Space, Typography, Empty, Dropdown,
  Popover,
} from "antd";
import {
  ArrowLeftOutlined, BarChartOutlined, TableOutlined,
  MailOutlined, EyeOutlined, LinkOutlined, StopOutlined, GlobalOutlined,
  DashboardOutlined, DatabaseOutlined, RiseOutlined, FallOutlined,
  FireOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined,
  DownloadOutlined, FilterOutlined, InfoCircleOutlined, StarOutlined,
  TeamOutlined, DollarOutlined, ThunderboltOutlined, PieChartOutlined,
  AreaChartOutlined, FundOutlined, TrophyOutlined, AlertOutlined,
  MoreOutlined, FullscreenOutlined, ReloadOutlined, QuestionCircleOutlined,
  BulbOutlined, AimOutlined, SafetyCertificateOutlined, ExperimentOutlined,
  CrownOutlined, HeartOutlined,
} from "@ant-design/icons";
import { Chart, registerables } from "chart.js";
import { get_advertisers_detail } from "../../../api/advertiser";

Chart.register(...registerables);

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

// ── Design Tokens ────────────────────────────────────────────────────────────

const tokens = {
  bg: "#f0f2f5",
  cardBg: "#ffffff",
  cardRadius: 16,
  headerGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  primary: "#4f46e5",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  pink: "#ec4899",
  orange: "#f97316",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.03)",
  shadowLg: "0 10px 25px rgba(0,0,0,0.08)",
};

const CHART_PALETTE = [
  "#4f46e5", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#ec4899", "#f97316",
  "#14b8a6", "#6366f1", "#84cc16", "#e11d48",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v) => Number(v ?? 0).toLocaleString("fr-FR");
const pct = (v) => `${Number(v ?? 0).toFixed(2)}%`;
const usd = (v) => `$${Number(v ?? 0).toFixed(2)}`;

// ── Health Score System ──────────────────────────────────────────────────────
// Le Health Score est un indicateur composite (0-100) qui mesure la "santé"
// d'une campagne ou base en combinant 3 métriques pondérées :
//
//   1. Open Rate (35 points max)
//      - > 15%  → 35 pts (Excellent)
//      - > 10%  → 25 pts (Bon)
//      - > 5%   → 15 pts (Moyen)
//      - ≤ 5%   → 5 pts  (Faible)
//
//   2. Click Rate / CTR (35 points max)
//      - > 3%   → 35 pts (Excellent)
//      - > 1.5% → 25 pts (Bon)
//      - > 0.5% → 15 pts (Moyen)
//      - ≤ 0.5% → 5 pts  (Faible)
//
//   3. Unsub Rate inversé (30 points max) — plus c'est bas, mieux c'est
//      - < 0.1% → 30 pts (Excellent)
//      - < 0.3% → 20 pts (Bon)
//      - < 0.5% → 10 pts (Moyen)
//      - ≥ 0.5% → 0 pts  (Critique)
//
// Classification finale :
//   75–100  → Excellent (vert)
//   50–74   → Bon (jaune/warning)
//   25–49   → Moyen / Standard (orange)
//   0–24    → Critique / À surveiller (rouge)

const getHealthScore = (g) => {
  const openRate = Number(g.taux_openers || 0);
  const ctr = Number(g.taux_clickers || 0);
  const unsubRate = Number(g.taux_unsubs || 0);
  let score = 0;

  // Open Rate (35 pts max)
  if (openRate > 15) score += 35;
  else if (openRate > 10) score += 25;
  else if (openRate > 5) score += 15;
  else score += 5;

  // CTR (35 pts max)
  if (ctr > 3) score += 35;
  else if (ctr > 1.5) score += 25;
  else if (ctr > 0.5) score += 15;
  else score += 5;

  // Unsub inverse (30 pts max)
  if (unsubRate < 0.1) score += 30;
  else if (unsubRate < 0.3) score += 20;
  else if (unsubRate < 0.5) score += 10;
  else score += 0;

  return Math.min(100, score);
};

const getHealthColor = (score) => {
  if (score >= 75) return tokens.success;
  if (score >= 50) return tokens.warning;
  if (score >= 25) return tokens.orange;
  return tokens.danger;
};

const getHealthLabel = (score) => {
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Bon";
  if (score >= 25) return "Standard";
  return "À surveiller";
};

const getHealthDetails = (g) => {
  const openRate = Number(g.taux_openers || 0);
  const ctr = Number(g.taux_clickers || 0);
  const unsubRate = Number(g.taux_unsubs || 0);

  const openPts = openRate > 15 ? 35 : openRate > 10 ? 25 : openRate > 5 ? 15 : 5;
  const ctrPts = ctr > 3 ? 35 : ctr > 1.5 ? 25 : ctr > 0.5 ? 15 : 5;
  const unsubPts = unsubRate < 0.1 ? 30 : unsubRate < 0.3 ? 20 : unsubRate < 0.5 ? 10 : 0;

  return [
    {
      label: "Open Rate",
      value: pct(openRate),
      points: openPts,
      max: 35,
      thresholds: "> 15% = 35pts · > 10% = 25pts · > 5% = 15pts · ≤ 5% = 5pts",
      color: openPts >= 25 ? tokens.success : openPts >= 15 ? tokens.warning : tokens.danger,
    },
    {
      label: "Click Rate (CTR)",
      value: pct(ctr),
      points: ctrPts,
      max: 35,
      thresholds: "> 3% = 35pts · > 1.5% = 25pts · > 0.5% = 15pts · ≤ 0.5% = 5pts",
      color: ctrPts >= 25 ? tokens.success : ctrPts >= 15 ? tokens.warning : tokens.danger,
    },
    {
      label: "Unsub Rate (inversé)",
      value: pct(unsubRate),
      points: unsubPts,
      max: 30,
      thresholds: "< 0.1% = 30pts · < 0.3% = 20pts · < 0.5% = 10pts · ≥ 0.5% = 0pts",
      color: unsubPts >= 20 ? tokens.success : unsubPts >= 10 ? tokens.warning : tokens.danger,
    },
  ];
};

const clsConfig = {
  A: { color: "#10b981", bg: "#ecfdf5", label: "Premium", icon: <TrophyOutlined /> },
  B: { color: "#3b82f6", bg: "#eff6ff", label: "Bon", icon: <StarOutlined /> },
  C: { color: "#f59e0b", bg: "#fffbeb", label: "Standard", icon: <AlertOutlined /> },
  D: { color: "#ef4444", bg: "#fef2f2", label: "À surveiller", icon: <WarningOutlined /> },
};

const tagColor = (txt) => {
  if (!txt) return "default";
  if (txt.includes("🟢") || txt.includes("✅")) return "success";
  if (txt.includes("🟡") || txt.includes("🔶") || txt.includes("😐")) return "warning";
  if (txt.includes("🔴") || txt.includes("🚨")) return "error";
  if (txt.includes("⚠️")) return "warning";
  if (txt.includes("🔥")) return "purple";
  if (txt.includes("👍")) return "processing";
  return "default";
};

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  page: {
    padding: "24px 28px",
    minHeight: "100vh",
    background: tokens.bg,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  headerCard: {
    background: tokens.headerGradient,
    borderRadius: tokens.cardRadius,
    border: "none",
    marginBottom: 24,
    boxShadow: tokens.shadowLg,
    overflow: "hidden",
  },
  card: {
    borderRadius: tokens.cardRadius,
    border: "1px solid #e5e7eb",
    boxShadow: tokens.shadow,
    overflow: "hidden",
  },
  kpiCard: {
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    boxShadow: tokens.shadow,
    transition: "all 0.2s ease",
    cursor: "default",
    overflow: "hidden",
    //height: "100%",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
};

// ── SmartChart ────────────────────────────────────────────────────────────────

const SmartChart = ({ type, labels, datasets, height = 240, options: extraOpts = {} }) => {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const depsKey = JSON.stringify({ labels, datasets });

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const isDoughnut = type === "doughnut" || type === "pie";

    chartRef.current = new Chart(ref.current, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: datasets.length > 1 || isDoughnut,
            position: isDoughnut ? "right" : "bottom",
            labels: {
              boxWidth: 8, boxHeight: 8, borderRadius: 4, useBorderRadius: true,
              font: { size: 11, family: "'Inter', sans-serif", weight: "500" },
              padding: 12, color: "#6b7280",
            },
          },
          tooltip: {
            backgroundColor: "rgba(17,24,39,0.9)",
            titleFont: { size: 12, family: "'Inter', sans-serif", weight: "600" },
            bodyFont: { size: 11, family: "'Inter', sans-serif" },
            padding: 10, cornerRadius: 8, displayColors: true,
            boxWidth: 8, boxHeight: 8, boxPadding: 4,
          },
        },
        scales: !isDoughnut ? {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, family: "'Inter', sans-serif" }, color: "#9ca3af", maxRotation: 45 },
            border: { display: false },
          },
          y: {
            grid: { color: "rgba(0,0,0,0.04)", drawBorder: false },
            ticks: { font: { size: 10, family: "'Inter', sans-serif" }, color: "#9ca3af", padding: 8 },
            border: { display: false },
          },
        } : undefined,
        ...extraOpts,
      },
    });
    return () => chartRef.current?.destroy();
  }, [depsKey, type]);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <canvas ref={ref} />
    </div>
  );
};

// ── HealthGauge ──────────────────────────────────────────────────────────────

const HealthExplainer = ({ g }) => {
  const details = getHealthDetails(g);
  const total = getHealthScore(g);

  return (
    <div style={{ width: 320, padding: 4 }}>
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: 13 }}>🩺 Comment est calculé le Health Score ?</Text>
        <Paragraph style={{ fontSize: 11, color: "#6b7280", margin: "6px 0 0" }}>
          Score composite sur 100 points basé sur 3 métriques pondérées.
          Plus le score est haut, meilleure est la "santé" de la campagne.
        </Paragraph>
      </div>

      {details.map((d) => (
        <div key={d.label} style={{
          padding: "8px 10px", borderRadius: 8, marginBottom: 6,
          background: "#f9fafb", border: "1px solid #f3f4f6",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <Text style={{ fontSize: 11, fontWeight: 600 }}>{d.label}</Text>
            <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>
              {d.points}/{d.max} pts
            </span>
          </div>
          <Progress
            percent={(d.points / d.max) * 100}
            showInfo={false}
            strokeColor={d.color}
            trailColor="#e5e7eb"
            size="small"
            style={{ marginBottom: 4 }}
          />
          <Text style={{ fontSize: 9, color: "#9ca3af" }}>
            Actuel: {d.value} · Seuils: {d.thresholds}
          </Text>
        </div>
      ))}

      <Divider style={{ margin: "8px 0" }} />

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "6px 10px", borderRadius: 8,
        background: `${getHealthColor(total)}12`,
      }}>
        <Text strong style={{ fontSize: 12 }}>Score total</Text>
        <span style={{ fontSize: 16, fontWeight: 800, color: getHealthColor(total) }}>
          {total}/100 — {getHealthLabel(total)}
        </span>
      </div>

      <Divider style={{ margin: "10px 0 6px" }} />
      <div style={{ fontSize: 10, color: "#9ca3af" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span><span style={{ color: tokens.success }}>●</span> 75-100 Excellent</span>
          <span><span style={{ color: tokens.warning }}>●</span> 50-74 Bon</span>
          <span><span style={{ color: tokens.orange }}>●</span> 25-49 Standard</span>
          <span><span style={{ color: tokens.danger }}>●</span> 0-24 À surveiller</span>
        </div>
      </div>
    </div>
  );
};

const HealthGauge = ({ score, g, showExplainer = false }) => {
  const color = getHealthColor(score);
  const label = getHealthLabel(score);

  const gauge = (
    <div style={{ textAlign: "center" }}>
      <Progress
        type="dashboard"
        percent={score}
        strokeColor={{ "0%": color, "100%": score >= 50 ? tokens.success : tokens.danger }}
        trailColor="#f3f4f6"
        strokeWidth={8}
        width={130}
        format={() => (
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>{score}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{label}</div>
          </div>
        )}
      />
      {showExplainer && g && (
        <Popover content={<HealthExplainer g={g} />} title={null} trigger="click" placement="bottom">
          <Button
            type="link" size="small"
            icon={<QuestionCircleOutlined />}
            style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}
          >
            Comment ça marche ?
          </Button>
        </Popover>
      )}
    </div>
  );

  return gauge;
};

// ── KpiCard ──────────────────────────────────────────────────────────────────

const KpiCard = ({ icon, label, value, color, subtitle }) => (
  <div
    style={styles.kpiCard}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = tokens.shadowMd; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = tokens.shadow; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <div style={{ padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            {label}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{value}</div>
          {subtitle && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{subtitle}</div>}
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `${color}12`, display: "flex",
          alignItems: "center", justifyContent: "center",
          color, fontSize: 18, flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </div>
    <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
  </div>
);

// ── KpiDashboard ─────────────────────────────────────────────────────────────

const KpiDashboard = ({ g }) => {
  const kpis = [
    { icon: <MailOutlined />,        label: "Total Sends",    value: fmt(g.sends),    color: tokens.primary, subtitle: "Emails envoyés" },
    { icon: <EyeOutlined />,         label: "Openers",        value: fmt(g.openers),  color: tokens.success, subtitle: pct(g.taux_openers) + " open rate" },
    { icon: <LinkOutlined />,        label: "Clickers",       value: fmt(g.clickers), color: tokens.warning, subtitle: pct(g.taux_clickers) + " CTR" },
    { icon: <StopOutlined />,        label: "Unsubs",         value: fmt(g.unsubs),   color: tokens.danger,  subtitle: pct(g.taux_unsubs) + " unsub rate" },
    { icon: <ThunderboltOutlined />, label: "CTO",            value: pct(g.taux_cto), color: tokens.cyan,    subtitle: "Click-to-Open" },
    { icon: <DollarOutlined />,      label: "eCPM",           value: usd(g.ecpm),     color: tokens.purple,  subtitle: "Revenue / 1k" },
    { icon: <DollarOutlined />,      label: "Chiffre d'aff.", value: usd(g.ca),       color: tokens.pink,    subtitle: "Revenue total" },
  ];

  return (
    <Row gutter={[14, 14]}>
      {kpis.map((kpi) => (
        <Col key={kpi.label} xs={12} sm={8} md={6} lg={6} xl={3}>
          <KpiCard {...kpi} />
        </Col>
      ))}
      <Col xs={24} sm={8} md={6} lg={6} xl={3}>
        <div style={{ ...styles.kpiCard, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
          <HealthGauge score={getHealthScore(g)} g={g} showExplainer />
        </div>
      </Col>
    </Row>
  );
};

// ── AnalyseBadges ────────────────────────────────────────────────────────────

const AnalyseBadges = ({ analyses, compact = false }) => {
  if (!analyses || Object.keys(analyses).length === 0)
    return <Text type="secondary" style={{ fontSize: 11 }}>Aucune analyse</Text>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {Object.entries(analyses).map(([k, v]) => (
        <Tooltip key={k} title={k}>
          <Tag
            color={tagColor(v)}
            style={{
              fontSize: compact ? 10 : 11, margin: 0, borderRadius: 6, fontWeight: 500,
              padding: compact ? "0 6px" : "2px 8px",
              lineHeight: compact ? "18px" : "22px",
              maxWidth: compact ? 150 : 220,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}
          >
            {v}
          </Tag>
        </Tooltip>
      ))}
    </div>
  );
};

// ── RateBar ──────────────────────────────────────────────────────────────────

const RateBar = ({ label, value, color, max = 100 }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
      <Text style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{label}</Text>
      <Text style={{ fontSize: 11, fontWeight: 700, color }}>{pct(value)}</Text>
    </div>
    <div style={{ height: 6, borderRadius: 3, background: "#f3f4f6", overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 3,
        width: `${Math.min((Number(value || 0) / max) * 100, 100)}%`,
        background: `linear-gradient(90deg, ${color}, ${color}bb)`,
        transition: "width 0.6s ease",
      }} />
    </div>
  </div>
);

// ── FunnelViz ────────────────────────────────────────────────────────────────

const FunnelViz = ({ g }) => {
  const steps = [
    { label: "Sends", value: g.sends || 0, color: tokens.primary, icon: <MailOutlined /> },
    { label: "Openers", value: g.openers || 0, color: tokens.success, icon: <EyeOutlined /> },
    { label: "Clickers", value: g.clickers || 0, color: tokens.warning, icon: <LinkOutlined /> },
  ];
  const maxVal = steps[0].value || 1;

  return (
    <div style={{ padding: "8px 0" }}>
      {steps.map((step, i) => {
        const widthPct = Math.max((step.value / maxVal) * 100, 12);
        const dropRate = i > 0 ? ((1 - step.value / (steps[i - 1].value || 1)) * 100).toFixed(1) : null;
        return (
          <div key={step.label} style={{ marginBottom: i < steps.length - 1 ? 6 : 0 }}>
            {dropRate && (
              <div style={{ textAlign: "center", fontSize: 10, color: tokens.danger, fontWeight: 600, marginBottom: 3 }}>
                <FallOutlined /> -{dropRate}%
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: `${step.color}15`, display: "flex",
                alignItems: "center", justifyContent: "center",
                color: step.color, fontSize: 13, flexShrink: 0,
              }}>
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  height: 28, borderRadius: 8,
                  background: `linear-gradient(90deg, ${step.color}22, ${step.color}08)`,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 8, width: `${widthPct}%`,
                    background: `linear-gradient(90deg, ${step.color}, ${step.color}cc)`,
                    display: "flex", alignItems: "center", paddingLeft: 10,
                    transition: "width 0.8s ease",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                      {fmt(step.value)}
                    </span>
                  </div>
                </div>
              </div>
              <Text style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", minWidth: 50, textAlign: "right" }}>
                {step.label}
              </Text>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── SegmentRecommendations ───────────────────────────────────────────────────

const SegmentRecommendations = ({ data }) => {
  const recommendations = useMemo(() => {
    const merged = {};
    data.bases.forEach((base) => {
      if (!base.dimensions) return;
      Object.entries(base.dimensions).forEach(([dimKey, dimData]) => {
        if (!merged[dimKey]) merged[dimKey] = {};
        Object.entries(dimData).forEach(([seg, vals]) => {
          if (!merged[dimKey][seg]) merged[dimKey][seg] = { sends: 0, openers: 0, clickers: 0, unsubs: 0 };
          merged[dimKey][seg].sends += vals.sends || 0;
          merged[dimKey][seg].openers += vals.openers || 0;
          merged[dimKey][seg].clickers += vals.clickers || 0;
          merged[dimKey][seg].unsubs += vals.unsubs || 0;
        });
      });
    });

    const dimLabels = {
      age_range: { label: "Tranche d'âge", icon: <TeamOutlined />, color: tokens.primary },
      gender: { label: "Civilité / Genre", icon: <HeartOutlined />, color: tokens.pink },
      isp: { label: "ISP / FAI", icon: <GlobalOutlined />, color: tokens.cyan },
    };

    const results = [];

    Object.entries(merged).forEach(([dimKey, segments]) => {
      const meta = dimLabels[dimKey] || { label: dimKey, icon: <PieChartOutlined />, color: tokens.purple };
      const entries = Object.entries(segments)
        .filter(([, v]) => v.sends > 0)
        .map(([seg, v]) => ({
          segment: seg,
          ...v,
          openRate: v.sends ? (v.openers / v.sends) * 100 : 0,
          ctr: v.sends ? (v.clickers / v.sends) * 100 : 0,
          unsubRate: v.sends ? (v.unsubs / v.sends) * 100 : 0,
        }));

      if (entries.length === 0) return;

      // Meilleur CTR
      const bestCtr = [...entries].sort((a, b) => b.ctr - a.ctr)[0];
      // Meilleur open rate
      const bestOpen = [...entries].sort((a, b) => b.openRate - a.openRate)[0];
      // Plus bas unsub
      const bestUnsub = [...entries].sort((a, b) => a.unsubRate - b.unsubRate)[0];
      // Pire segment
      const worstCtr = [...entries].sort((a, b) => a.ctr - b.ctr)[0];
      // Plus gros volume
      const biggestVol = [...entries].sort((a, b) => b.sends - a.sends)[0];

      results.push({
        dimKey,
        ...meta,
        bestCtr,
        bestOpen,
        bestUnsub,
        worstCtr,
        biggestVol,
        totalSegments: entries.length,
      });
    });

    return results;
  }, [data]);

  if (recommendations.length === 0) return null;

  return (
    <Card
      size="small"
      style={{ ...styles.card, marginTop: 20, border: `1px solid ${tokens.primary}33` }}
      title={
        <span style={{ ...styles.sectionTitle, marginBottom: 0 }}>
          <BulbOutlined style={{ color: tokens.warning, fontSize: 18 }} />
          Recommandations par segment
          <Tag color="blue" style={{ borderRadius: 10, fontSize: 10, marginLeft: 8 }}>
            {recommendations.length} dimensions analysées
          </Tag>
        </span>
      }
    >
      <Paragraph style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>
        Récapitulatif des meilleurs segments identifiés sur l'ensemble des bases pour optimiser le ciblage.
      </Paragraph>

      <Row gutter={[14, 14]}>
        {recommendations.map((rec) => (
          <Col key={rec.dimKey} xs={24} md={8}>
            <div style={{
              borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden",
              background: "#fff", height: "100%",
            }}>
              {/* Header dim */}
              <div style={{
                padding: "12px 16px",
                background: `linear-gradient(135deg, ${rec.color}12, ${rec.color}05)`,
                borderBottom: "1px solid #f3f4f6",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${rec.color}18`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: rec.color, fontSize: 14,
                }}>
                  {rec.icon}
                </div>
                <div>
                  <Text strong style={{ fontSize: 13 }}>{rec.label}</Text>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{rec.totalSegments} segments</div>
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ padding: "12px 16px" }}>
                {/* Best CTR */}
                <div style={{
                  padding: "8px 10px", borderRadius: 8, marginBottom: 8,
                  background: `${tokens.success}08`, border: `1px solid ${tokens.success}22`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <AimOutlined style={{ color: tokens.success, fontSize: 12 }} />
                    <Text style={{ fontSize: 10, fontWeight: 600, color: tokens.success, textTransform: "uppercase" }}>
                      Meilleur CTR
                    </Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text strong style={{ fontSize: 13 }}>{rec.bestCtr.segment}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 700, color: tokens.success }}>{pct(rec.bestCtr.ctr)}</Text>
                  </div>
                  <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                    {fmt(rec.bestCtr.sends)} sends · {pct(rec.bestCtr.openRate)} open
                  </Text>
                </div>

                {/* Best Open */}
                <div style={{
                  padding: "8px 10px", borderRadius: 8, marginBottom: 8,
                  background: `${tokens.info}08`, border: `1px solid ${tokens.info}22`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <EyeOutlined style={{ color: tokens.info, fontSize: 12 }} />
                    <Text style={{ fontSize: 10, fontWeight: 600, color: tokens.info, textTransform: "uppercase" }}>
                      Meilleur Open Rate
                    </Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text strong style={{ fontSize: 13 }}>{rec.bestOpen.segment}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 700, color: tokens.info }}>{pct(rec.bestOpen.openRate)}</Text>
                  </div>
                  <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                    {fmt(rec.bestOpen.sends)} sends · {pct(rec.bestOpen.ctr)} CTR
                  </Text>
                </div>

                {/* Best Unsub (lowest) */}
                <div style={{
                  padding: "8px 10px", borderRadius: 8, marginBottom: 8,
                  background: `${tokens.cyan}08`, border: `1px solid ${tokens.cyan}22`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <SafetyCertificateOutlined style={{ color: tokens.cyan, fontSize: 12 }} />
                    <Text style={{ fontSize: 10, fontWeight: 600, color: tokens.cyan, textTransform: "uppercase" }}>
                      Moins de désabo
                    </Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text strong style={{ fontSize: 13 }}>{rec.bestUnsub.segment}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 700, color: tokens.cyan }}>{pct(rec.bestUnsub.unsubRate)}</Text>
                  </div>
                  <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                    {fmt(rec.bestUnsub.sends)} sends
                  </Text>
                </div>

                {/* Worst — à éviter */}
                <div style={{
                  padding: "8px 10px", borderRadius: 8,
                  background: `${tokens.danger}06`, border: `1px solid ${tokens.danger}18`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <CloseCircleOutlined style={{ color: tokens.danger, fontSize: 12 }} />
                    <Text style={{ fontSize: 10, fontWeight: 600, color: tokens.danger, textTransform: "uppercase" }}>
                      À éviter / surveiller
                    </Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text strong style={{ fontSize: 13 }}>{rec.worstCtr.segment}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 700, color: tokens.danger }}>{pct(rec.worstCtr.ctr)} CTR</Text>
                  </div>
                  <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                    {fmt(rec.worstCtr.sends)} sends · {pct(rec.worstCtr.unsubRate)} unsub
                  </Text>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Résumé textuel */}
      <div style={{
        marginTop: 16, padding: "14px 18px", borderRadius: 10,
        background: "linear-gradient(135deg, #fefce8, #fef9c3)",
        border: "1px solid #fde68a",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <ExperimentOutlined style={{ color: tokens.warning, fontSize: 18, marginTop: 2 }} />
          <div>
            <Text strong style={{ fontSize: 12, color: "#92400e" }}>💡 Synthèse ciblage</Text>
            <div style={{ fontSize: 11, color: "#78350f", marginTop: 4, lineHeight: 1.7 }}>
              {recommendations.map((rec) => (
                <div key={rec.dimKey}>
                  <strong>{rec.label} :</strong> privilégier{" "}
                  <Tag color="green" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>{rec.bestCtr.segment}</Tag>
                  {" "}(CTR {pct(rec.bestCtr.ctr)})
                  {rec.bestCtr.segment !== rec.bestOpen.segment && (
                    <span>
                      {" "}ou <Tag color="blue" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>{rec.bestOpen.segment}</Tag>
                      {" "}(Open {pct(rec.bestOpen.openRate)})
                    </span>
                  )}
                  {" "}· éviter{" "}
                  <Tag color="red" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>{rec.worstCtr.segment}</Tag>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ── DimSection ───────────────────────────────────────────────────────────────

const DIM_KEYS = [
  { key: "age_range", label: "Tranche d'âge", icon: <TeamOutlined /> },
  { key: "gender", label: "Genre", icon: <HeartOutlined /> },
  { key: "isp", label: "ISP / FAI", icon: <GlobalOutlined /> },
];

const dimCols = [
  { title: "Segment", dataIndex: "segment", fixed: "left", width: 120, render: (v) => <Text strong style={{ fontSize: 12 }}>{v}</Text> },
  { title: "Sends", dataIndex: "sends", sorter: (a, b) => a.sends - b.sends, render: fmt, align: "right" },
  { title: "Openers", dataIndex: "openers", sorter: (a, b) => a.openers - b.openers, render: fmt, align: "right" },
  { title: "Clickers", dataIndex: "clickers", sorter: (a, b) => a.clickers - b.clickers, render: fmt, align: "right" },
  { title: "Unsubs", dataIndex: "unsubs", sorter: (a, b) => a.unsubs - b.unsubs, render: fmt, align: "right" },
  { title: "Open %", dataIndex: "taux_openers", sorter: (a, b) => a.taux_openers - b.taux_openers, render: (v) => <Text style={{ color: tokens.success, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
  { title: "CTR %", dataIndex: "taux_clickers", sorter: (a, b) => a.taux_clickers - b.taux_clickers, render: (v) => <Text style={{ color: tokens.warning, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
  { title: "Unsub %", dataIndex: "taux_unsubs", sorter: (a, b) => a.taux_unsubs - b.taux_unsubs, render: (v) => <Text style={{ color: tokens.danger, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
  { title: "CTO %", dataIndex: "taux_cto", sorter: (a, b) => a.taux_cto - b.taux_cto, render: pct, align: "right" },
  { title: "Analyses", dataIndex: "analyses", width: 280, render: (a) => <AnalyseBadges analyses={a} compact /> },
];

const DimSection = ({ dimensions, viewMode, hideFilters = false }) => (
  <Row gutter={[16, 16]}>
    {DIM_KEYS.map(({ key, label, icon }) => {
      const dim = dimensions?.[key];
      if (!dim) return null;
      const entries = Object.entries(dim).filter(([, v]) => v.sends > 0);
      if (entries.length === 0) return null;

      const rows = entries.map(([seg, v]) => ({ key: seg, segment: seg, ...v }));

      return (
        <Col key={key} xs={24} lg={viewMode === "chart" ? 8 : 24}>
          <Card
            size="small"
            style={styles.card}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: tokens.primary }}>{icon}</span>
                {label}
                <Tag style={{ marginLeft: "auto", borderRadius: 10, fontSize: 10 }}>{entries.length}</Tag>
              </div>
            }
          >
            {viewMode === "chart" ? (
              <SmartChart
                type="bar"
                labels={entries.map(([k]) => k)}
                height={220}
                datasets={[
                  { label: "Sends", data: entries.map(([, v]) => v.sends), backgroundColor: `${tokens.primary}55`, borderColor: tokens.primary, borderWidth: 1.5, borderRadius: 4 },
                  { label: "Openers", data: entries.map(([, v]) => v.openers), backgroundColor: `${tokens.success}55`, borderColor: tokens.success, borderWidth: 1.5, borderRadius: 4 },
                  { label: "Clickers", data: entries.map(([, v]) => v.clickers), backgroundColor: `${tokens.warning}55`, borderColor: tokens.warning, borderWidth: 1.5, borderRadius: 4 },
                ]}
              />
            ) : (
              <Table
                dataSource={rows}
                columns={dimCols}
                size="small"
                rowKey="segment"
                pagination={{ pageSize: 6, size: "small", showSizeChanger: false }}
                scroll={{ x: 900 }}
                style={{ marginTop: 4 }}
              />
            )}
          </Card>
        </Col>
      );
    })}
  </Row>
);

// ── BrandSection columns ─────────────────────────────────────────────────────

const brandCols = [
  { title: "Brand", dataIndex: "name", fixed: "left", width: 140, render: (v) => <Text strong style={{ fontSize: 12 }}>{v}</Text> },
  {
    title: "Créa", dataIndex: "creativities", width: 200,
    render: (url) => url && url !== "url_vide"
      ? <Tooltip title={url}>
          <a href={url} target="_blank" rel="noreferrer"
            style={{ fontSize: 11, color: tokens.primary, maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", whiteSpace: "nowrap" }}>
            <LinkOutlined style={{ marginRight: 4 }} />{url.length > 30 ? url.slice(0, 30) + "…" : url}
          </a>
        </Tooltip>
      : <Text type="secondary" style={{ fontSize: 11 }}>—</Text>,
  },
  { title: "Sends", dataIndex: "sends", sorter: (a, b) => a.sends - b.sends, render: fmt, align: "right" },
  { title: "Openers", dataIndex: "openers", sorter: (a, b) => a.openers - b.openers, render: fmt, align: "right" },
  { title: "Clickers", dataIndex: "clickers", sorter: (a, b) => a.clickers - b.clickers, render: fmt, align: "right" },
  { title: "Unsubs", dataIndex: "unsubs", sorter: (a, b) => a.unsubs - b.unsubs, render: fmt, align: "right" },
  { title: "Open %", dataIndex: "taux_openers", sorter: (a, b) => (a.taux_openers || 0) - (b.taux_openers || 0), render: (v) => <Text style={{ color: tokens.success, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
  { title: "CTR %", dataIndex: "taux_clickers", sorter: (a, b) => a.taux_clickers - b.taux_clickers, render: (v) => <Text style={{ color: tokens.warning, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
  { title: "CTO %", dataIndex: "taux_cto", sorter: (a, b) => a.taux_cto - b.taux_cto, render: pct, align: "right" },
  { title: "Unsub %", dataIndex: "taux_unsubs", sorter: (a, b) => a.taux_unsubs - b.taux_unsubs, render: (v) => <Text style={{ color: tokens.danger, fontWeight: 600 }}>{pct(v)}</Text>, align: "right" },
  { title: "Analyses", dataIndex: "analyses", width: 260, render: (a) => <AnalyseBadges analyses={a} compact /> },
];

// ── BaseCard ─────────────────────────────────────────────────────────────────

const BaseCard = ({ base, viewMode }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const cls = clsConfig[base.classification] || clsConfig.C;
  const health = getHealthScore(base);

  return (
    <Card
      style={{ ...styles.card, marginBottom: 16, borderLeft: `4px solid ${cls.color}` }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header avec sends, CTR, unsub rate */}
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid #f3f4f6",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10,
        background: `linear-gradient(90deg, ${cls.bg}, transparent)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `${cls.color}18`, display: "flex",
            alignItems: "center", justifyContent: "center",
            color: cls.color, fontSize: 16, fontWeight: 700,
          }}>
            <DatabaseOutlined />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                Database #{base.database_id}
              </Text>
              <span style={{ ...styles.badge, color: cls.color, background: cls.bg }}>
                {cls.icon} {cls.label}
              </span>
              <Tag color="purple" style={{ borderRadius: 6, fontSize: 10, margin: 0, fontFamily: "monospace" }}>
                Router {base.id_routers}
              </Tag>
            </div>
            {base.date_schedule && (
              <Text style={{ fontSize: 11, color: "#9ca3af" }}>
                Planifié: {base.date_schedule.join(", ")}
              </Text>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Mini health */}
          <Popover content={<HealthExplainer g={base} />} title={null} trigger="click" placement="bottomRight">
            <div style={{ textAlign: "center", cursor: "pointer" }}>
              <Progress
                type="circle" percent={health} width={40} strokeWidth={8}
                strokeColor={getHealthColor(health)} trailColor="#f3f4f6"
                format={() => <span style={{ fontSize: 10, fontWeight: 700, color: getHealthColor(health) }}>{health}</span>}
              />
            </div>
          </Popover>

          {/* KPIs inline dans le header */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { l: "Sends",   v: fmt(base.sends),           c: tokens.primary, icon: <MailOutlined /> },
              { l: "Open%",   v: pct(base.taux_openers),    c: tokens.success, icon: <EyeOutlined /> },
              { l: "CTR%",    v: pct(base.taux_clickers),   c: tokens.warning, icon: <LinkOutlined /> },
              { l: "Unsub%",  v: pct(base.taux_unsubs),     c: tokens.danger,  icon: <StopOutlined /> },
            ].map(({ l, v, c, icon }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500, display: "flex", alignItems: "center", gap: 3, justifyContent: "center" }}>
                  <span style={{ color: c, fontSize: 10 }}>{icon}</span>{l}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 20px 16px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          style={{ marginBottom: 0 }}
          items={[
            {
              key: "overview",
              label: <span><DashboardOutlined /> Vue globale</span>,
              children: (
                <Row gutter={[16, 16]} style={{ paddingTop: 8 }}>
                  <Col xs={24} md={14}>
                    <Row gutter={[10, 10]}>
                      {[
                        { l: "Sends",    v: fmt(base.sends),    c: tokens.primary, i: <MailOutlined /> },
                        { l: "Openers",  v: fmt(base.openers),  c: tokens.success, i: <EyeOutlined /> },
                        { l: "Clickers", v: fmt(base.clickers), c: tokens.warning, i: <LinkOutlined /> },
                        { l: "Unsubs",   v: fmt(base.unsubs),   c: tokens.danger,  i: <StopOutlined /> },
                        { l: "eCPM",     v: usd(base.ecpm),     c: tokens.purple,  i: <DollarOutlined /> },
                        { l: "CA",       v: usd(base.ca),       c: tokens.cyan,    i: <DollarOutlined /> },
                      ].map(({ l, v, c, i }) => (
                        <Col key={l} xs={8}>
                          <div style={{
                            padding: "10px 12px", borderRadius: 10,
                            border: "1px solid #f3f4f6", background: "#fafafa",
                          }}>
                            <div style={{ fontSize: 10, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
                              <span style={{ color: c }}>{i}</span>{l}
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{v}</div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                    <div style={{ marginTop: 12 }}>
                      <RateBar label="Open Rate" value={base.taux_openers} color={tokens.success} max={50} />
                      <RateBar label="Click Rate" value={base.taux_clickers} color={tokens.warning} max={10} />
                      <RateBar label="Unsub Rate" value={base.taux_unsubs} color={tokens.danger} max={2} />
                    </div>
                  </Col>
                  <Col xs={24} md={10}>
                    <div style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Funnel de conversion</Text>
                    </div>
                    <FunnelViz g={base} />
                    <Divider style={{ margin: "12px 0" }} />
                    <Text style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Analyses</Text>
                    <AnalyseBadges analyses={base.analyses} />
                  </Col>
                </Row>
              ),
            },
            {
              key: "brands",
              label: <span><FireOutlined /> Brands ({base.brands?.length || 0})</span>,
              children: (
                <div style={{ paddingTop: 8 }}>
                  {viewMode === "chart" ? (
                    <Row gutter={[14, 14]}>
                      <Col xs={24} lg={14}>
                        <SmartChart
                          type="bar"
                          labels={base.brands?.map((b) => b.name) || []}
                          height={240}
                          datasets={[
                            { label: "Sends", data: base.brands?.map((b) => b.sends) || [], backgroundColor: `${tokens.primary}77`, borderColor: tokens.primary, borderWidth: 1.5, borderRadius: 5 },
                            { label: "Openers", data: base.brands?.map((b) => b.openers) || [], backgroundColor: `${tokens.success}77`, borderColor: tokens.success, borderWidth: 1.5, borderRadius: 5 },
                            { label: "Clickers", data: base.brands?.map((b) => b.clickers) || [], backgroundColor: `${tokens.warning}77`, borderColor: tokens.warning, borderWidth: 1.5, borderRadius: 5 },
                          ]}
                        />
                      </Col>
                      <Col xs={24} lg={10}>
                        <SmartChart
                          type="doughnut"
                          labels={base.brands?.map((b) => b.name) || []}
                          height={240}
                          datasets={[{
                            data: base.brands?.map((b) => b.sends) || [],
                            backgroundColor: CHART_PALETTE.slice(0, base.brands?.length || 0),
                            borderWidth: 2, borderColor: "#fff",
                          }]}
                        />
                      </Col>
                    </Row>
                  ) : (
                    <Table
                      dataSource={base.brands?.map((b, i) => ({ key: i, ...b })) || []}
                      columns={brandCols}
                      size="small"
                      pagination={{ pageSize: 8, size: "small", showSizeChanger: false }}
                      scroll={{ x: 1100 }}
                    />
                  )}
                </div>
              ),
            },
            {
              key: "dimensions",
              label: <span><PieChartOutlined /> Dimensions</span>,
              children: (
                <div style={{ paddingTop: 8 }}>
                  <DimSection dimensions={base.dimensions} viewMode={viewMode} hideFilters />
                </div>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
};

// ── GlobalOverview ───────────────────────────────────────────────────────────

const GlobalOverview = ({ data }) => {
  const g = data.globales;
  const health = getHealthScore(g);

  return (
    <div>
      <KpiDashboard g={g} />

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} md={8}>
          <Card size="small" style={styles.card}
            title={<span style={styles.sectionTitle}><FundOutlined style={{ color: tokens.primary }} /> Funnel</span>}>
            <FunnelViz g={g} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" style={styles.card}
            title={<span style={styles.sectionTitle}><AreaChartOutlined style={{ color: tokens.success }} /> Taux clés</span>}>
            <div style={{ padding: "8px 0" }}>
              <RateBar label="Open Rate" value={g.taux_openers} color={tokens.success} max={50} />
              <RateBar label="Click Rate (CTR)" value={g.taux_clickers} color={tokens.warning} max={10} />
              <RateBar label="Click-to-Open (CTO)" value={g.taux_cto} color={tokens.cyan} max={30} />
              <RateBar label="Unsub Rate" value={g.taux_unsubs} color={tokens.danger} max={2} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" style={styles.card}
            title={
              <span style={styles.sectionTitle}>
                <CheckCircleOutlined style={{ color: tokens.success }} /> Diagnostic
                <Popover content={<HealthExplainer g={g} />} title={null} trigger="click" placement="bottomRight">
                  <QuestionCircleOutlined style={{ color: "#9ca3af", fontSize: 13, cursor: "pointer", marginLeft: 4 }} />
                </Popover>
              </span>
            }>
            <div style={{ padding: "8px 0" }}>
              <div style={{ marginBottom: 14, textAlign: "center" }}>
                <HealthGauge score={health} g={g} showExplainer />
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <AnalyseBadges analyses={g.analyses} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Comparaison graphique */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card size="small" style={styles.card}
            title={<span style={styles.sectionTitle}><BarChartOutlined style={{ color: tokens.primary }} /> Volume par base</span>}>
            <SmartChart
              type="bar"
              labels={data.bases.map((b) => `DB #${b.database_id}`)}
              height={220}
              datasets={[
                { label: "Sends", data: data.bases.map((b) => b.sends), backgroundColor: `${tokens.primary}66`, borderColor: tokens.primary, borderWidth: 1.5, borderRadius: 5 },
                { label: "Openers", data: data.bases.map((b) => b.openers), backgroundColor: `${tokens.success}66`, borderColor: tokens.success, borderWidth: 1.5, borderRadius: 5 },
                { label: "Clickers", data: data.bases.map((b) => b.clickers), backgroundColor: `${tokens.warning}66`, borderColor: tokens.warning, borderWidth: 1.5, borderRadius: 5 },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" style={styles.card}
            title={<span style={styles.sectionTitle}><PieChartOutlined style={{ color: tokens.purple }} /> Répartition des sends</span>}>
            <SmartChart
              type="doughnut"
              labels={data.bases.map((b) => `DB #${b.database_id}`)}
              height={220}
              datasets={[{
                data: data.bases.map((b) => b.sends),
                backgroundColor: CHART_PALETTE.slice(0, data.bases.length),
                borderWidth: 3, borderColor: "#fff", hoverBorderWidth: 0,
              }]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card size="small" style={styles.card}
            title={<span style={styles.sectionTitle}><RiseOutlined style={{ color: tokens.success }} /> Taux d'engagement par base</span>}>
            <SmartChart
              type="line"
              labels={data.bases.map((b) => `DB #${b.database_id}`)}
              height={200}
              datasets={[
                { label: "Open %", data: data.bases.map((b) => b.taux_openers), borderColor: tokens.success, backgroundColor: `${tokens.success}22`, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4, pointBackgroundColor: "#fff", pointBorderWidth: 2 },
                { label: "CTR %", data: data.bases.map((b) => b.taux_clickers), borderColor: tokens.warning, backgroundColor: `${tokens.warning}22`, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4, pointBackgroundColor: "#fff", pointBorderWidth: 2 },
                { label: "Unsub %", data: data.bases.map((b) => b.taux_unsubs), borderColor: tokens.danger, backgroundColor: `${tokens.danger}22`, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4, pointBackgroundColor: "#fff", pointBorderWidth: 2 },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" style={styles.card}
            title={<span style={styles.sectionTitle}><DollarOutlined style={{ color: tokens.pink }} /> Revenue par base</span>}>
            <SmartChart
              type="bar"
              labels={data.bases.map((b) => `DB #${b.database_id}`)}
              height={200}
              datasets={[
                { label: "CA ($)", data: data.bases.map((b) => b.ca || 0), backgroundColor: `${tokens.pink}66`, borderColor: tokens.pink, borderWidth: 1.5, borderRadius: 5 },
                { label: "eCPM ($)", data: data.bases.map((b) => b.ecpm || 0), backgroundColor: `${tokens.purple}66`, borderColor: tokens.purple, borderWidth: 1.5, borderRadius: 5 },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Recommandations segment */}
      <SegmentRecommendations data={data} />
    </div>
  );
};

// ── GlobalTable ──────────────────────────────────────────────────────────────

const GlobalTable = ({ bases }) => {
  const [f, setF] = useState({ minSends: null, cls: null });

  const rows = useMemo(() => {
    let d = bases.map((b) => ({ key: b.database_id, ...b }));
    if (f.minSends) d = d.filter((r) => r.sends >= f.minSends);
    if (f.cls) d = d.filter((r) => r.classification === f.cls);
    return d;
  }, [bases, f]);

  const cols = [
    { title: "Database", dataIndex: "database_id", fixed: "left", width: 100, render: (v) => <Text strong style={{ fontSize: 12 }}>DB #{v}</Text> },
    { title: "Router", dataIndex: "id_routers", width: 90, render: (v) => <Tag color="purple" style={{ borderRadius: 6, fontSize: 10, margin: 0, fontFamily: "monospace" }}>{v}</Tag> },
    {
      title: "Classe", dataIndex: "classification", width: 110,
      render: (v) => {
        const c = clsConfig[v] || clsConfig.C;
        return <span style={{ ...styles.badge, color: c.color, background: c.bg }}>{c.icon} {c.label}</span>;
      },
    },
    {
      title: "Health", width: 80,
      render: (_, r) => {
        const s = getHealthScore(r);
        return (
          <Popover content={<HealthExplainer g={r} />} title={null} trigger="click">
            <Progress type="circle" percent={s} width={30} strokeWidth={10} strokeColor={getHealthColor(s)}
              format={() => <span style={{ fontSize: 9, fontWeight: 700 }}>{s}</span>}
              style={{ cursor: "pointer" }} />
          </Popover>
        );
      },
    },
    { title: "Sends", dataIndex: "sends", sorter: (a, b) => a.sends - b.sends, render: fmt, align: "right" },
    { title: "Openers", dataIndex: "openers", sorter: (a, b) => a.openers - b.openers, render: fmt, align: "right" },
    { title: "Clickers", dataIndex: "clickers", sorter: (a, b) => a.clickers - b.clickers, render: fmt, align: "right" },
    { title: "Unsubs", dataIndex: "unsubs", sorter: (a, b) => a.unsubs - b.unsubs, render: fmt, align: "right" },
    { title: "Open %", dataIndex: "taux_openers", sorter: (a, b) => a.taux_openers - b.taux_openers, render: (v) => <Text style={{ color: tokens.success, fontWeight: 600, fontSize: 12 }}>{pct(v)}</Text>, align: "right" },
    { title: "CTR %", dataIndex: "taux_clickers", sorter: (a, b) => a.taux_clickers - b.taux_clickers, render: (v) => <Text style={{ color: tokens.warning, fontWeight: 600, fontSize: 12 }}>{pct(v)}</Text>, align: "right" },
    { title: "Unsub %", dataIndex: "taux_unsubs", sorter: (a, b) => a.taux_unsubs - b.taux_unsubs, render: (v) => <Text style={{ color: tokens.danger, fontWeight: 600, fontSize: 12 }}>{pct(v)}</Text>, align: "right" },
    { title: "CA", dataIndex: "ca", sorter: (a, b) => (a.ca || 0) - (b.ca || 0), render: usd, align: "right" },
    { title: "eCPM", dataIndex: "ecpm", sorter: (a, b) => (a.ecpm || 0) - (b.ecpm || 0), render: usd, align: "right" },
    { title: "Analyses", dataIndex: "analyses", width: 260, render: (a) => <AnalyseBadges analyses={a} compact /> },
  ];

  return (
    <Card size="small" style={styles.card}>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <Select placeholder="Min sends" allowClear size="small" style={{ width: 160 }}
          suffixIcon={<FilterOutlined />}
          onChange={(v) => setF((p) => ({ ...p, minSends: v }))}>
          {[100, 500, 1000, 5000, 10000, 20000].map((n) => <Option key={n} value={n}>≥ {fmt(n)} sends</Option>)}
        </Select>
        <Select placeholder="Classification" allowClear size="small" style={{ width: 150 }}
          onChange={(v) => setF((p) => ({ ...p, cls: v }))}>
          {Object.entries(clsConfig).map(([k, c]) => (
            <Option key={k} value={k}><span style={{ color: c.color }}>{c.icon}</span> Classe {k} — {c.label}</Option>
          ))}
        </Select>
        <div style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center" }}>
          {rows.length} résultat(s)
        </div>
      </div>
      <Table
        dataSource={rows}
        columns={cols}
        size="small"
        scroll={{ x: 1400 }}
        pagination={{ pageSize: 10, size: "small", showSizeChanger: true, showTotal: (t) => <Text style={{ fontSize: 11, color: "#9ca3af" }}>{t} bases</Text> }}
      />
    </Card>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

const AdvertiserDetailBackup = ({ _mockData }) => {
  const { advertiser_id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(_mockData || null);
  const [loading, setLoading] = useState(!_mockData);
  const [viewMode, setViewMode] = useState("chart");
  const [mainTab, setMainTab] = useState("global");

  const fetchd = useCallback(async () => {
    try {
      setLoading(true);
      const res = await get_advertisers_detail(advertiser_id);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [advertiser_id]);

  useEffect(() => {
    if (!_mockData) fetchd();
  }, [advertiser_id, fetchd, _mockData]);

  if (loading) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "80vh", flexDirection: "column", gap: 16, background: tokens.bg,
    }}>
      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
      <div style={{
        width: 48, height: 48, border: "3px solid #e5e7eb",
        borderTop: `3px solid ${tokens.primary}`,
        borderRadius: "50%", animation: "spin 0.8s linear infinite",
      }} />
      <Text style={{ color: "#6b7280", fontSize: 14, fontWeight: 500, animation: "pulse 1.5s infinite" }}>
        Chargement du rapport…
      </Text>
    </div>
  );

  if (!data) return (
    <div style={{ ...styles.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ position: "absolute", top: 24, left: 24 }}>Retour</Button>
      <Empty description={
        <div>
          <Text style={{ fontSize: 15, color: "#6b7280" }}>Aucune donnée disponible</Text>
          <br /><Text type="secondary" style={{ fontSize: 12 }}>Advertiser #{advertiser_id}</Text>
        </div>
      } />
      <Button type="primary" icon={<ReloadOutlined />} onClick={fetchd} style={{ marginTop: 16, borderRadius: 8 }}>Réessayer</Button>
    </div>
  );

  const health = getHealthScore(data.globales);
  const totalBrands = data.bases?.reduce((s, b) => s + (b.brands?.length || 0), 0) || 0;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={{
        ...styles.headerCard, padding: "20px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              borderRadius: 10, border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)", color: "#fff",
            }}
            ghost
          />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
              Advertiser #{data.advertiser_id}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
              {[
                { icon: <DatabaseOutlined />, text: `${data.bases?.length || 0} bases` },
                { icon: <MailOutlined />, text: `${fmt(data.globales?.sends)} sends` },
                { icon: <FireOutlined />, text: `${totalBrands} brands` },
              ].map(({ icon, text }) => (
                <span key={text} style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 4 }}>
                  {icon} {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Popover content={<HealthExplainer g={data.globales} />} title={null} trigger="click" placement="bottomRight">
            <div style={{
              padding: "8px 16px", borderRadius: 12,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            }}>
              <Progress
                type="circle" percent={health} width={36} strokeWidth={8}
                strokeColor="#fff" trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{health}</span>}
              />
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Health Score</div>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{getHealthLabel(health)}</div>
              </div>
              <QuestionCircleOutlined style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} />
            </div>
          </Popover>

          <Segmented
            value={viewMode}
            onChange={setViewMode}
            style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10 }}
            options={[
              { label: <span style={{ color: viewMode === "chart" ? tokens.primary : "#fff", padding: "2px 6px" }}><BarChartOutlined /> Charts</span>, value: "chart" },
              { label: <span style={{ color: viewMode === "table" ? tokens.primary : "#fff", padding: "2px 6px" }}><TableOutlined /> Tables</span>, value: "table" },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <Card style={{ ...styles.card, border: "none" }} bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={mainTab}
          onChange={setMainTab}
          size="large"
          style={{ padding: "0 24px" }}
          tabBarStyle={{ marginBottom: 0, fontWeight: 600 }}
          items={[
            {
              key: "global",
              label: <span style={{ display: "flex", alignItems: "center", gap: 6 }}><DashboardOutlined /> Analyse globale</span>,
              children: <div style={{ padding: "20px 4px 24px" }}><GlobalOverview data={data} /></div>,
            },
            {
              key: "bases",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <DatabaseOutlined /> Bases
                  <Badge count={data.bases?.length || 0} style={{ backgroundColor: tokens.primary, fontSize: 10, marginLeft: 2 }} />
                </span>
              ),
              children: (
                <div style={{ padding: "20px 4px 24px" }}>
                  {viewMode === "table" && <GlobalTable bases={data.bases} />}
                  {viewMode === "chart" && (
                    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                      <Col xs={24} md={12}>
                        <Card size="small" style={styles.card}
                          title={<span style={styles.sectionTitle}><BarChartOutlined style={{ color: tokens.primary }} /> Sends par base</span>}>
                          <SmartChart
                            type="bar"
                            labels={data.bases.map((b) => `DB #${b.database_id}`)}
                            height={200}
                            datasets={[{
                              label: "Sends",
                              data: data.bases.map((b) => b.sends),
                              backgroundColor: data.bases.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length] + "88"),
                              borderColor: data.bases.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]),
                              borderWidth: 1.5, borderRadius: 6,
                            }]}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card size="small" style={styles.card}
                          title={<span style={styles.sectionTitle}><PieChartOutlined style={{ color: tokens.purple }} /> Répartition</span>}>
                          <SmartChart
                            type="doughnut"
                            labels={data.bases.map((b) => `DB #${b.database_id}`)}
                            height={200}
                            datasets={[{
                              data: data.bases.map((b) => b.sends),
                              backgroundColor: CHART_PALETTE.slice(0, data.bases.length),
                              borderWidth: 3, borderColor: "#fff",
                            }]}
                          />
                        </Card>
                      </Col>
                    </Row>
                  )}
                  <div style={styles.sectionTitle}>
                    <DatabaseOutlined style={{ color: tokens.primary }} />
                    Détail par base ({data.bases?.length})
                  </div>
                  {data.bases.map((base) => (
                    <BaseCard key={base.database_id} base={base} viewMode={viewMode} />
                  ))}
                </div>
              ),
            },
            {
              key: "dimensions",
              label: <span style={{ display: "flex", alignItems: "center", gap: 6 }}><PieChartOutlined /> Dimensions globales</span>,
              children: (
                <div style={{ padding: "20px 4px 24px" }}>
                  {(() => {
                    const merged = {};
                    data.bases.forEach((base) => {
                      if (!base.dimensions) return;
                      Object.entries(base.dimensions).forEach(([dimKey, dimData]) => {
                        if (!merged[dimKey]) merged[dimKey] = {};
                        Object.entries(dimData).forEach(([seg, vals]) => {
                          if (!merged[dimKey][seg]) merged[dimKey][seg] = { sends: 0, openers: 0, clickers: 0, unsubs: 0 };
                          merged[dimKey][seg].sends += vals.sends || 0;
                          merged[dimKey][seg].openers += vals.openers || 0;
                          merged[dimKey][seg].clickers += vals.clickers || 0;
                          merged[dimKey][seg].unsubs += vals.unsubs || 0;
                        });
                      });
                    });
                    Object.values(merged).forEach((dimData) => {
                      Object.values(dimData).forEach((v) => {
                        v.taux_openers = v.sends ? (v.openers / v.sends) * 100 : 0;
                        v.taux_clickers = v.sends ? (v.clickers / v.sends) * 100 : 0;
                        v.taux_unsubs = v.sends ? (v.unsubs / v.sends) * 100 : 0;
                        v.taux_cto = v.openers ? (v.clickers / v.openers) * 100 : 0;
                      });
                    });
                    return Object.keys(merged).length > 0
                      ? <DimSection dimensions={merged} viewMode={viewMode} hideFilters />
                      : <Empty description="Aucune dimension disponible" />;
                  })()}
                </div>
              ),
            },
          ]}
        />
      </Card>

      <div style={{ textAlign: "center", padding: "20px 0 8px", color: "#9ca3af", fontSize: 11 }}>
        Rapport généré automatiquement · Advertiser #{data.advertiser_id} · {new Date().toLocaleDateString("fr-FR")}
      </div>
    </div>
  );
};

export default AdvertiserDetailBackup;