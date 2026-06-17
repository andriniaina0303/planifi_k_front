

// npm install exceljs file-saver
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { get_segment_name } from "../../../api/advertiser";
import { decodeBase64 } from "../../../utils/utils";

// ─── Couleurs UI ──────────────────────────────────────────────────────────────
const COLOR = {
  success:   "16A34A",
  warning:   "D97706",
  danger:    "EF4444",
  header_bg: "1E293B",
  header_fg: "FFFFFF",
  title_bg:  "0F172A",
  date_bg:   "F1F5F9",
  row_alt:   "F8FAFC",
  black:     "111827",
  gray:      "6B7280",
  ecpm_low:  "ff9b7d",
  ecpm_mid:  "D4D3DC",
  ecpm_high: "52f5a9",
};

// ─── Couleur de fond selon eCPM ───────────────────────────────────────────────
function getEcpmRowBg(ecpm) {
  if (ecpm == null || ecpm < 0.5) return COLOR.ecpm_low;
  if (ecpm >= 1)                   return COLOR.ecpm_high;
  return COLOR.ecpm_mid;
}

// ─── Health Score (même logique que GlobalTable) ──────────────────────────────
function getHealthScore(base) {
  if (!base) return 0;
  let score = 50;
  if (base.taux_openers  > 20)  score += 15;
  else if (base.taux_openers  > 10) score += 7;
  if (base.taux_clickers > 3)   score += 15;
  else if (base.taux_clickers > 1)  score += 7;
  if (base.taux_unsubs   < 0.1) score += 10;
  else if (base.taux_unsubs < 0.3)  score += 5;
  else if (base.taux_unsubs > 1)    score -= 15;
  return Math.min(100, Math.max(0, score));
}

// ─── Style cellule ────────────────────────────────────────────────────────────
function sc(cell, { fg, bg, bold = false, italic = false, align = "left", fmt, size = 10 } = {}) {
  cell.font      = { name: "Arial", size, bold, italic, color: { argb: "FF" + (fg || COLOR.black) } };
  if (bg) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + bg } };
  cell.alignment = { horizontal: align, vertical: "middle", wrapText: false };
  if (fmt) cell.numFmt = fmt;
  cell.border = {
    bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
    right:  { style: "thin", color: { argb: "FFE5E7EB" } },
  };
}

function blank(cell, bg) {
  cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + bg } };
  cell.border = {
    bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
    right:  { style: "thin", color: { argb: "FFE5E7EB" } },
  };
}

// ─── Pré-chargement segments en parallèle ────────────────────────────────────
// Collecte tous les couples uniques (database_id, segment_id), les résout
// TOUS via Promise.all → 0 appel réseau pendant la génération Excel.
async function buildSegmentCache(bases) {
  const unique = new Map();
  for (const base of (bases || [])) {
    for (const brand of (base.brands || [])) {
      for (const segId of (brand.segment_id || [])) {
        const key = `${base.database_id}_${segId}`;
        if (!unique.has(key)) unique.set(key, { database_id: base.database_id, segId });
      }
    }
  }
  if (unique.size === 0) return {};

  const entries = [...unique.entries()];
  const names = await Promise.all(
    entries.map(([, { database_id, segId }]) =>
      get_segment_name(database_id, segId)
        .then((n) => n || String(segId))
        .catch(() => String(segId))
    )
  );
  const cache = {};
  entries.forEach(([key], i) => { cache[key] = names[i]; });
  return cache;
}

// ─────────────────────────────────────────────────────────────────────────────
// exportGlobalTableXLS
//
// Même signature qu'avant SAUF :
//   - suppression de buildSegmentCache / get_segment_name (0 appel API)
//   - ajout du paramètre `segmentNames` : l'état déjà chargé dans GlobalTable
//     format : { "segmentId": "nom du segment", ... }
//
// @param bases          data.bases depuis le store/parent
// @param allbase        [{database_id, database_name}]
// @param clsConfig      {A,B,C,D}
// @param agenceMapping  [{agence_id, agence_name}]
// @param advertiserInfo { id, name }
// @param segmentNames   { [segmentId]: segmentName }  ← état de GlobalTable
// ─────────────────────────────────────────────────────────────────────────────
export async function exportGlobalTableXLS(
  bases,
  allbase,
  clsConfig,
  agenceMapping,
  advertiserInfo = {},
  
) {
  const safeName = (advertiserInfo.name || "export")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  const filename = "Export_Advertiser_" + safeName + "_" + (advertiserInfo.id || "") + ".xlsx";

  // ── 1. Mappings statiques ─────────────────────────────────────────────────
  const dbMap     = Object.fromEntries((allbase       || []).map((db) => [db.database_id, db.database_name]));
  const agenceMap = Object.fromEntries((agenceMapping || []).map((a)  => [a.agence_id,    a.agence_name   ]));

  // ── 2. Pré-chargement parallèle des segments ──────────────────────────────
  const segmentCache = await buildSegmentCache(bases);
  // ── 2. Workbook ───────────────────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "AdvertiserDetail";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Bases", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  const COLS = [
    { label: "Database",    width: 26, align: "center" },
    { label: "Classe",      width: 10, align: "center" },
    { label: "Health",      width: 10, align: "center" },
    { label: "Brand",       width: 24, align: "center" },
    { label: "Lien du Kit", width: 46, align: "center" },
    { label: "Subject",     width: 46, align: "center" },
    { label: "Date",        width: 14, align: "center" },
    { label: "Segment(s)",  width: 28, align: "center" },
    { label: "ListName",    width: 22, align: "center" },
    { label: "Model(s)",    width: 20, align: "center" },
    { label: "Agence",      width: 18, align: "center" },
    { label: "Sends",       width: 14, align: "center" },
    { label: "Openers",     width: 14, align: "center" },
    { label: "Open %",      width: 11, align: "center" },
    { label: "Clickers",    width: 14, align: "center" },
    { label: "CTR %",       width: 11, align: "center" },
    { label: "Unsubs",      width: 14, align: "center" },
    { label: "Unsub %",     width: 11, align: "center" },
    { label: "CTO %",       width: 11, align: "center" },
    { label: "CA",          width: 14, align: "center" },
    { label: "eCPM",        width: 14, align: "center" },
    { label: "Clicks val",  width: 12, align: "center" },
    { label: "Leads val",   width: 12, align: "center" },
    { label: "Conversion",  width: 12, align: "center" },
    { label: "Volume val",  width: 12, align: "center" },
  ];
  const NB = COLS.length;
  COLS.forEach((col, i) => { sheet.getColumn(i + 1).width = col.width; });

  // ── ROW 1 : Titre ─────────────────────────────────────────────────────────
  const titleRow = sheet.getRow(1);
  titleRow.height = 32;
  const tCell = titleRow.getCell(1);
  tCell.value = "Export sur : " + (advertiserInfo.name || "–") + "  (" + (advertiserInfo.id || "–") + ")";
  sc(tCell, { fg: COLOR.header_fg, bg: COLOR.title_bg, bold: true, size: 13 });
  sheet.mergeCells(1, 1, 1, NB);

  // ── ROW 2 : Date de génération ────────────────────────────────────────────
  const dateRow = sheet.getRow(2);
  dateRow.height = 18;
  const dCell = dateRow.getCell(1);
  dCell.value = "Généré le " + new Date().toLocaleString("fr-FR");
  sc(dCell, { fg: COLOR.gray, bg: COLOR.date_bg, italic: true, size: 9 });
  sheet.mergeCells(2, 1, 2, NB);

  // ── ROW 3 : En-têtes ──────────────────────────────────────────────────────
  const headerRow = sheet.getRow(3);
  headerRow.height = 28;
  COLS.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.label;
    sc(cell, { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true, align: col.align });
  });

  // ── 4. Boucle de données — 100% synchrone, 0 appel API ───────────────────
  let globalRowIdx = 0;

  for (const base of (bases || [])) {
    const dbName      = dbMap[base.database_id] || ("DB #" + base.database_id);
    const health      = getHealthScore(base);
    const healthColor = health >= 70 ? "16A34A" : health >= 40 ? "D97706" : "EF4444";
    const cls         = clsConfig?.[base.classification] || clsConfig?.C || { color: "#6B7280", bg: "#F3F4F6", label: "?" };
    const clsFg       = cls.color.replace("#", "");
    const clsLabel    = cls.label;

    for (const brand of (base.brands || [])) {
      const rowBg = getEcpmRowBg(brand.ecpm);
      globalRowIdx++;

      const brandName  = decodeBase64(brand.name);
      const subject    = decodeBase64(brand.subject);
      const dates      = (brand.date_schedule || []).join(", ");
      const listname   = (brand.ListName      || []).join(", ");
      const agenceName = agenceMap[brand.agence_id] || (brand.agence_id != null ? String(brand.agence_id) : "–");

      // ── Segments : lecture dans segmentNames (état de GlobalTable, 0 API) ──
      const segments = (brand.segment_id || [])
        .map((segId) => segmentCache[`${base.database_id}_${segId}`] || String(segId))
        .join(", ");

      // Models
      const models = (brand.models || [])
        .filter((m) => m.model && String(m.model).trim())
        .map((m) => {
          const name = String(m.model).trim();
          if (m.payvalue != null && m.payvalue !== 0 && m.payvalue !== "") {
            const val = Number.isInteger(m.payvalue) ? m.payvalue : parseFloat(m.payvalue.toFixed(2));
            return name + " (" + val + ")";
          }
          return name;
        })
        .join(" | ") || "–";

      const row = sheet.addRow([]);
      row.height = 22;

      row.getCell(1).value = dbName;
      sc(row.getCell(1), { fg: COLOR.black,   bg: rowBg, bold: true });

      row.getCell(2).value = clsLabel;
      sc(row.getCell(2), { fg: clsFg,         bg: rowBg, bold: true, align: "center" });

      row.getCell(3).value = health;
      sc(row.getCell(3), { fg: healthColor,   bg: rowBg, bold: true, align: "center" });

      row.getCell(4).value = brandName;
      sc(row.getCell(4), { fg: COLOR.black,   bg: rowBg, bold: true });

      // C5 : Lien du Kit (hyperlien)
      const linkCell = row.getCell(5);
      const url = brand.creativities;
      if (url) {
        linkCell.value = { text: url, hyperlink: url };
        linkCell.font  = { color: { argb: "FF0000FF" }, underline: true };
        linkCell.alignment = { vertical: "middle" };
        linkCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + rowBg } };
      } else {
        linkCell.value = null;
        blank(linkCell, rowBg);
      }

      row.getCell(6).value = subject;
      sc(row.getCell(6),  { fg: COLOR.black,   bg: rowBg, italic: true });

      row.getCell(7).value = dates;
      sc(row.getCell(7),  { fg: COLOR.black,   bg: rowBg, align: "center" });

      row.getCell(8).value = segments;
      sc(row.getCell(8),  { fg: COLOR.black,   bg: rowBg });

      row.getCell(9).value = listname;
      sc(row.getCell(9),  { fg: COLOR.black,   bg: rowBg });

      row.getCell(10).value = models;
      sc(row.getCell(10), { fg: COLOR.black,   bg: rowBg });

      row.getCell(11).value = agenceName;
      sc(row.getCell(11), { fg: COLOR.black,   bg: rowBg });

      row.getCell(12).value = brand.sends    ?? null;
      sc(row.getCell(12), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      row.getCell(13).value = brand.openers  ?? null;
      sc(row.getCell(13), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      row.getCell(14).value = brand.taux_openers  != null ? brand.taux_openers  / 100 : null;
      sc(row.getCell(14), { fg: COLOR.success, bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      row.getCell(15).value = brand.clickers ?? null;
      sc(row.getCell(15), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      row.getCell(16).value = brand.taux_clickers != null ? brand.taux_clickers / 100 : null;
      sc(row.getCell(16), { fg: COLOR.warning, bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      row.getCell(17).value = brand.unsubs   ?? null;
      sc(row.getCell(17), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      row.getCell(18).value = brand.taux_unsubs   != null ? brand.taux_unsubs   / 100 : null;
      sc(row.getCell(18), { fg: COLOR.danger,  bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      row.getCell(19).value = brand.taux_cto != null ? brand.taux_cto / 100 : null;
      sc(row.getCell(19), { fg: COLOR.warning, bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      row.getCell(20).value = brand.ca       ?? null;
      sc(row.getCell(20), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0.00" });

      row.getCell(21).value = brand.ecpm     ?? null;
      sc(row.getCell(21), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0.00" });

      row.getCell(22).value = brand.clicks_val ?? null;
      sc(row.getCell(22), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      row.getCell(23).value = brand.leads_val  ?? null;
      sc(row.getCell(23), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      const conversion =
        brand.leads_val > 0 && brand.clickers != null
          ? (brand.leads_val / brand.clickers) * 100
          : 0;
      row.getCell(24).value = conversion;
      sc(row.getCell(24), { fg: COLOR.black, bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      row.getCell(25).value = brand.volume_val ?? null;
      sc(row.getCell(25), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });
    }
  }

  // ── 5. Ligne de totaux ────────────────────────────────────────────────────
  const firstDataRow = 4;
  const lastDataRow  = 3 + globalRowIdx;
  const totalRow = sheet.addRow([]);
  totalRow.height = 26;

  totalRow.getCell(1).value = "TOTAL — " + globalRowIdx + " brands / " + (bases || []).length + " bases";
  sc(totalRow.getCell(1), { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true });

  for (let c = 2; c <= 11; c++) blank(totalRow.getCell(c), COLOR.header_bg);

  [12, 13, 15, 17, 22, 23, 25].forEach((c) => {
    const L = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "SUM(" + L + firstDataRow + ":" + L + lastDataRow + ")" };
    sc(totalRow.getCell(c), { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true, align: "center", fmt: "#,##0" });
  });

  [[14, COLOR.success], [16, COLOR.warning], [18, COLOR.danger], [19, COLOR.warning], [24, COLOR.success]].forEach(([c, color]) => {
    const L = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "AVERAGE(" + L + firstDataRow + ":" + L + lastDataRow + ")" };
    sc(totalRow.getCell(c), { fg: color, bg: COLOR.header_bg, bold: true, align: "center", fmt: "0.00%" });
  });

  [20, 21].forEach((c) => {
    const L = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "SUM(" + L + firstDataRow + ":" + L + lastDataRow + ")" };
    sc(totalRow.getCell(c), { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true, align: "center", fmt: "#,##0.00" });
  });

  // ── 6. Téléchargement ─────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    filename
  );
}

export const exportGlobalTableCSV = exportGlobalTableXLS;