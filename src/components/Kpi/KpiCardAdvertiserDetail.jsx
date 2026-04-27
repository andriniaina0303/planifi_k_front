
// ── Design Tokens (subset used by KpiCard) ───────────────────────────────────

// const tokens = {
//   shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
//   shadowMd: "0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.03)",
// };

// // ── Styles ───────────────────────────────────────────────────────────────────

// const styles = {
//   kpiCard: {
//     borderRadius: 14,
//     border: "1px solid #e5e7eb",
//     boxShadow: tokens.shadow,
//     transition: "all 0.2s ease",
//     cursor: "default",
//     overflow: "hidden",
//   },
// };

// // ── KpiCard ──────────────────────────────────────────────────────────────────

// const KpiCard = ({ icon, label, value, color, subtitle }) => (
//   <div
//     style={styles.kpiCard}
//     onMouseEnter={(e) => {
//       e.currentTarget.style.boxShadow = tokens.shadowMd;
//       e.currentTarget.style.transform = "translateY(-2px)";
//     }}
//     onMouseLeave={(e) => {
//       e.currentTarget.style.boxShadow = tokens.shadow;
//       e.currentTarget.style.transform = "translateY(0)";
//     }}
//   >
//     <div style={{ padding: "16px 18px" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "flex-start",
//           justifyContent: "space-between",
//         }}
//       >
//         <div style={{ flex: 1 }}>
//           <div
//             style={{
//               fontSize: 11,
//               color: "#9ca3af",
//               fontWeight: 600,
//               textTransform: "uppercase",
//               letterSpacing: 0.5,
//               marginBottom: 6,
//             }}
//           >
//             {label}
//           </div>
//           <div
//             style={{
//               fontSize: 22,
//               fontWeight: 800,
//               color: "#111827",
//               lineHeight: 1.2,
//             }}
//           >
//             {value}
//           </div>
//           {subtitle && (
//             <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
//               {subtitle}
//             </div>
//           )}
//         </div>
//         <div
//           style={{
//             width: 42,
//             height: 42,
//             borderRadius: 12,
//             background: `${color}12`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color,
//             fontSize: 18,
//             flexShrink: 0,
//           }}
//         >
//           {icon}
//         </div>
//       </div>
//     </div>
//     <div
//       style={{
//         height: 3,
//         background: `linear-gradient(90deg, ${color}, ${color}66)`,
//       }}
//     />
//   </div>
// );

// export default KpiCardAdvertiserDetail;