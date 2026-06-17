
// npm install exceljs file-saver
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { get_segment_name } from "../../../api/advertiser";
import { decodeBase64 } from "../../../utils/utils";

// ─── Couleurs UI (identiques à ExportBase) ────────────────────────────────────
const COLOR = {
  success:   "16A34A",
  warning:   "D97706",
  danger:    "EF4444",
  header_bg: "1E293B",
  header_fg: "FFFFFF",
  title_bg:  "0F172A",
  date_bg:   "F1F5F9",
  black:     "111827",
  gray:      "6B7280",
  ecpm_low:  "ff9b7d",   // ecpm < 0.5  → rouge
  ecpm_mid:  "D4D3DC",   // 0.5 <= ecpm < 1 → gris
  ecpm_high: "52f5a9",   // ecpm >= 1   → vert
};

// ─── Fond de ligne selon eCPM ─────────────────────────────────────────────────
function getEcpmRowBg(ecpm) {
  if (ecpm == null || ecpm < 0.5) return COLOR.ecpm_low;
  if (ecpm >= 1)                  return COLOR.ecpm_high;
  return COLOR.ecpm_mid;
}

// ─── Health Score ─────────────────────────────────────────────────────────────
function getHealthScore(adv) {
  if (!adv) return 0;
  let score = 50;
  if (adv.taux_openers > 20)      score += 15;
  else if (adv.taux_openers > 10) score += 7;
  if (adv.taux_clickers > 3)      score += 15;
  else if (adv.taux_clickers > 1) score += 7;
  if (adv.taux_unsubs < 0.1)      score += 10;
  else if (adv.taux_unsubs < 0.3) score += 5;
  else if (adv.taux_unsubs > 1)   score -= 15;
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
// database_id est fixe ici (on est dans le détail d'une seule base)
async function buildSegmentCache(advertisers, database_id) {
  const unique = new Map();
  for (const adv of (advertisers || [])) {
    for (const brand of (adv.brands || [])) {
      for (const segId of (brand.segment_id || [])) {
        const key = `${database_id}_${segId}`;
        if (!unique.has(key)) unique.set(key, { database_id, segId });
      }
    }
  }
  if (unique.size === 0) return {};

  const entries = [...unique.entries()];
  const names = await Promise.all(
    entries.map(([, { database_id: dbId, segId }]) =>
      get_segment_name(dbId, segId)
        .then((n) => n || String(segId))
        .catch(() => String(segId))
    )
  );
  const cache = {};
  entries.forEach(([key], i) => { cache[key] = names[i]; });
  return cache;
}

// ─────────────────────────────────────────────────────────────────────────────
// exportAdvertiserXLS
//
// @param advertisers   data.advertisers depuis /reporting/database/{id}
// @param agenceMapping [{agence_id, agence_name}]
// @param tag_name      { [tag_id]: tag_name }  — map tags
// @param clsConfig     {A,B,C,D} de DatabaseDetail
// @param databaseInfo  { id, name }
// @param segmentNames  { [segmentId]: segmentName }  ← état de GlobalTable (0 appel API)
// ─────────────────────────────────────────────────────────────────────────────
export async function exportAdvertiserXLS(
  advertisers,
  agenceMapping,
  tag_name,
  clsConfig,
  databaseInfo  = {},
  
) {
  // ── Nom de fichier ────────────────────────────────────────────────────────
  const safeName = (databaseInfo.name || "database")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  const filename = "Export_DB_" + safeName + "_" + (databaseInfo.id || "") + ".xlsx";

  // ── 1. Mappings statiques ─────────────────────────────────────────────────
  const agenceMap = Object.fromEntries(
    (agenceMapping || []).map((a) => [a.agence_id, a.agence_name])
  );
  const tagMap = tag_name || {};

   const segmentCache = await buildSegmentCache(advertisers, databaseInfo.id);
  // ── 2. Création du classeur ───────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DatabaseDetail";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Advertisers", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  const COLS = [
    { label: "Advertiser",  width: 26, align: "center" },  // C1
    { label: "Classe",      width: 10, align: "center" },  // C2
    { label: "Health",      width: 10, align: "center" },  // C3
    { label: "Brand",       width: 24, align: "center" },  // C4
    { label: "Tag",         width: 28, align: "center" },  // C5
    { label: "Lien du Kit", width: 46, align: "center" },  // C6
    { label: "Subject",     width: 46, align: "center" },  // C7
    { label: "Date",        width: 14, align: "center" },  // C8
    { label: "Segment(s)",  width: 28, align: "center" },  // C9
    { label: "ListName",    width: 22, align: "center" },  // C10
    { label: "Model(s)",    width: 20, align: "center" },  // C11
    { label: "Agence",      width: 18, align: "center" },  // C12
    { label: "Sends",       width: 14, align: "center" },  // C13
    { label: "Openers",     width: 14, align: "center" },  // C14
    { label: "Open %",      width: 11, align: "center" },  // C15
    { label: "Clickers",    width: 14, align: "center" },  // C16
    { label: "CTR %",       width: 11, align: "center" },  // C17
    { label: "Unsubs",      width: 14, align: "center" },  // C18
    { label: "Unsub %",     width: 11, align: "center" },  // C19
    { label: "CTO %",       width: 11, align: "center" },  // C20
    { label: "CA",          width: 14, align: "center" },  // C21
    { label: "eCPM",        width: 14, align: "center" },  // C22
    { label: "Clicks val",  width: 12, align: "center" },  // C23
    { label: "Leads val",   width: 12, align: "center" },  // C24
    { label: "Conversion",  width: 12, align: "center" },  // C25
    { label: "Volume val",  width: 12, align: "center" },  // C26
  ];
  const NB = COLS.length;
  COLS.forEach((col, i) => { sheet.getColumn(i + 1).width = col.width; });

  // ── ROW 1 : Titre ─────────────────────────────────────────────────────────
  const titleRow = sheet.getRow(1);
  titleRow.height = 32;
  const tCell = titleRow.getCell(1);
  tCell.value = "Export base : " + (databaseInfo.name || "–") + "  (" + (databaseInfo.id || "–") + ")";
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

  // ── 4. Boucle : advertisers → brands (100% synchrone, 0 appel API) ───────
  let globalRowIdx = 0;

  for (const adv of (advertisers || [])) {
    const advName     = adv.advertiser_name || ("ADV #" + adv.advertiser_id);
    const health      = getHealthScore(adv);
    const healthColor = health >= 70 ? "16A34A" : health >= 40 ? "D97706" : "EF4444";
    const cls         = clsConfig?.[adv.classification] || clsConfig?.C || { color: "#6B7280", bg: "#F3F4F6", label: "?" };
    const clsFg       = cls.color.replace("#", "");
    const clsLabel    = cls.label;

    for (const brand of (adv.brands || [])) {
      const rowBg      = getEcpmRowBg(brand.ecpm);
      globalRowIdx++;

      const brandName  = decodeBase64(brand.name);
      const subject    = decodeBase64(brand.subject);
      const dates      = (brand.date_schedule || []).join(", ");
      const listname   = (brand.ListName      || []).join(", ");
      const agenceName = agenceMap[brand.agence_id] || (brand.agence_id != null ? String(brand.agence_id) : "–");
      const tagName    = tagMap[brand.tag_id]        || (brand.tag_id    != null ? String(brand.tag_id)    : "–");

      // ── Segments : lecture dans segmentNames (état GlobalTable, 0 API) ───
      const segments = (brand.segment_id || [])
        .map((segId) => segmentCache[`${databaseInfo.id}_${segId}`] || String(segId))
        .join(", ");

      // ── Models : model + payvalue ─────────────────────────────────────────
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

      // ── Conversion ────────────────────────────────────────────────────────
      const conversion = brand.leads_val > 0 && brand.clickers > 0
        ? (brand.leads_val / brand.clickers) * 100
        : 0;

      const row = sheet.addRow([]);
      row.height = 22;

      // C1 : Advertiser
      row.getCell(1).value = advName;
      sc(row.getCell(1),  { fg: COLOR.black,   bg: rowBg, bold: true });

      // C2 : Classe
      row.getCell(2).value = clsLabel;
      sc(row.getCell(2),  { fg: clsFg,         bg: rowBg, bold: true, align: "center" });

      // C3 : Health
      row.getCell(3).value = health;
      sc(row.getCell(3),  { fg: healthColor,   bg: rowBg, bold: true, align: "center" });

      // C4 : Brand
      row.getCell(4).value = brandName;
      sc(row.getCell(4),  { fg: COLOR.black,   bg: rowBg, bold: true });

      // C5 : Tag
      row.getCell(5).value = tagName;
      sc(row.getCell(5),  { fg: COLOR.black,   bg: rowBg });

      // C6 : Lien du Kit (hyperlien) — même logique que ExportBase
      const linkCell = row.getCell(6);
      const url = brand.creativities;
      if (url) {
        linkCell.value     = { text: url, hyperlink: url };
        linkCell.font      = { color: { argb: "FF0000FF" }, underline: true };
        linkCell.alignment = { vertical: "middle" };
        linkCell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + rowBg } };
      } else {
        linkCell.value = null;
        blank(linkCell, rowBg);
      }

      // C7 : Subject
      row.getCell(7).value = subject;
      sc(row.getCell(7),  { fg: COLOR.black,   bg: rowBg, italic: true });

      // C8 : Date
      row.getCell(8).value = dates;
      sc(row.getCell(8),  { fg: COLOR.black,   bg: rowBg, align: "center" });

      // C9 : Segment(s)
      row.getCell(9).value = segments;
      sc(row.getCell(9),  { fg: COLOR.black,   bg: rowBg });

      // C10 : ListName
      row.getCell(10).value = listname;
      sc(row.getCell(10), { fg: COLOR.black,   bg: rowBg });

      // C11 : Model(s)
      row.getCell(11).value = models;
      sc(row.getCell(11), { fg: COLOR.black,   bg: rowBg });

      // C12 : Agence
      row.getCell(12).value = agenceName;
      sc(row.getCell(12), { fg: COLOR.black,   bg: rowBg });

      // C13 : Sends
      row.getCell(13).value = brand.sends    ?? null;
      sc(row.getCell(13), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      // C14 : Openers
      row.getCell(14).value = brand.openers  ?? null;
      sc(row.getCell(14), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      // C15 : Open % — vert
      row.getCell(15).value = brand.taux_openers  != null ? brand.taux_openers  / 100 : null;
      sc(row.getCell(15), { fg: COLOR.success, bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      // C16 : Clickers
      row.getCell(16).value = brand.clickers  ?? null;
      sc(row.getCell(16), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      // C17 : CTR % — orange
      row.getCell(17).value = brand.taux_clickers != null ? brand.taux_clickers / 100 : null;
      sc(row.getCell(17), { fg: COLOR.warning, bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      // C18 : Unsubs
      row.getCell(18).value = brand.unsubs    ?? null;
      sc(row.getCell(18), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      // C19 : Unsub % — rouge
      row.getCell(19).value = brand.taux_unsubs   != null ? brand.taux_unsubs   / 100 : null;
      sc(row.getCell(19), { fg: COLOR.danger,  bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      // C20 : CTO % — orange
      row.getCell(20).value = brand.taux_cto  != null ? brand.taux_cto  / 100 : null;
      sc(row.getCell(20), { fg: COLOR.warning, bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      // C21 : CA
      row.getCell(21).value = brand.ca        ?? null;
      sc(row.getCell(21), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0.00" });

      // C22 : eCPM
      row.getCell(22).value = brand.ecpm      ?? null;
      sc(row.getCell(22), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0.00" });

      // C23 : clicks_val
      row.getCell(23).value = brand.clicks_val ?? null;
      sc(row.getCell(23), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      // C24 : leads_val
      row.getCell(24).value = brand.leads_val  ?? null;
      sc(row.getCell(24), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });

      // C25 : Conversion
      row.getCell(25).value = conversion;
      sc(row.getCell(25), { fg: COLOR.black,   bg: rowBg, bold: true, align: "center", fmt: "0.00%" });

      // C26 : volume_val
      row.getCell(26).value = brand.volume_val ?? null;
      sc(row.getCell(26), { fg: COLOR.black,   bg: rowBg, align: "center", fmt: "#,##0" });
    }
  }

  // ── 5. Ligne de totaux ────────────────────────────────────────────────────
  const firstDataRow = 4;
  const lastDataRow  = 3 + globalRowIdx;
  const totalRow = sheet.addRow([]);
  totalRow.height = 26;

  totalRow.getCell(1).value = "TOTAL — " + globalRowIdx + " brands / " + (advertisers || []).length + " advertisers";
  sc(totalRow.getCell(1), { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true });

  for (let c = 2; c <= 12; c++) blank(totalRow.getCell(c), COLOR.header_bg);

  // Sommes : Sends, Openers, Clickers, Unsubs, clicks_val, leads_val, volume_val
  [13, 14, 16, 18, 23, 24, 26].forEach((c) => {
    const L = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "SUM(" + L + firstDataRow + ":" + L + lastDataRow + ")" };
    sc(totalRow.getCell(c), { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true, align: "center", fmt: "#,##0" });
  });

  // Moyennes : Open%, CTR%, Unsub%, CTO%, Conversion
  [[15, COLOR.success], [17, COLOR.warning], [19, COLOR.danger], [20, COLOR.warning], [25, COLOR.success]].forEach(([c, color]) => {
    const L = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "AVERAGE(" + L + firstDataRow + ":" + L + lastDataRow + ")" };
    sc(totalRow.getCell(c), { fg: color, bg: COLOR.header_bg, bold: true, align: "center", fmt: "0.00%" });
  });

  // Sommes : CA, eCPM
  [21, 22].forEach((c) => {
    const L = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "SUM(" + L + firstDataRow + ":" + L + lastDataRow + ")" };
    sc(totalRow.getCell(c), { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true, align: "center", fmt: "#,##0.00" });
  });

  // ── 6. Téléchargement ────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    filename
  );
}