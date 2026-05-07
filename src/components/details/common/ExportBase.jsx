
// npm install exceljs file-saver
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { get_segment_name } from "../../../api/advertiser";

// ─── Couleurs UI (tokens identiques à l'affichage) ───────────────────────────
const COLOR = {
  success:    "16A34A",   // Open %   → vert
  warning:    "D97706",   // CTR %    → orange
  danger:     "EF4444",   // Unsub %  → rouge
  header_bg:  "1E293B",   // en-têtes → gris foncé
  header_fg:  "FFFFFF",
  title_bg:   "0F172A",   // titre advertiser → presque noir
  date_bg:    "F1F5F9",
  row_alt:    "F8FAFC",   // lignes alternées
  black:      "111827",
  gray:       "6B7280",
};

// ─── Décodage base64 + correction mojibake (emojis, accents) ─────────────────
function decodeField(b64) {
  if (!b64) return "";
  try {
    const binaryStr = atob(b64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return b64;
  }
}

// ─── Health Score ─────────────────────────────────────────────────────────────
function getHealthScore(base) {
  if (!base) return 0;
  let score = 50;
  if (base.taux_openers > 20)       score += 15;
  else if (base.taux_openers > 10)  score += 7;
  if (base.taux_clickers > 3)       score += 15;
  else if (base.taux_clickers > 1)  score += 7;
  if (base.taux_unsubs < 0.1)       score += 10;
  else if (base.taux_unsubs < 0.3)  score += 5;
  else if (base.taux_unsubs > 1)    score -= 15;
  return Math.min(100, Math.max(0, score));
}

// ─── Appliquer un style à une cellule ────────────────────────────────────────
function sc(cell, { fg, bg, bold = false, italic = false, align = "left", fmt, size = 10 } = {}) {
  cell.font = {
    name: "Arial", size, bold, italic,
    color: { argb: "FF" + (fg || COLOR.black) },
  };
  if (bg) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + bg } };
  cell.alignment = { horizontal: align, vertical: "middle", wrapText: false };
  if (fmt) cell.numFmt = fmt;
  cell.border = {
    bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
    right:  { style: "thin", color: { argb: "FFE5E7EB" } },
  };
}

// ─── Cellule vide avec fond ───────────────────────────────────────────────────
function blank(cell, bg) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + bg } };
  cell.border = {
    bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
    right:  { style: "thin", color: { argb: "FFE5E7EB" } },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRÉ-CHARGEMENT PARALLÈLE des segments
//
// Collecte toutes les paires uniques (database_id, segment_id) sur l'ensemble
// des bases/brands, les résout EN PARALLÈLE via Promise.all, puis retourne
// un Map plat : "database_id_segment_id" → segment_name.
//
// Résultat : 0 appel réseau pendant la génération Excel → téléchargement immédiat.
// ─────────────────────────────────────────────────────────────────────────────
async function buildSegmentCache(bases) {
  // 1. Collecter les paires uniques
  const unique = new Map(); // cacheKey → { database_id, segId }
  for (const base of (bases || [])) {
    for (const brand of (base.brands || [])) {
      for (const segId of (brand.segment_id || [])) {
        const key = `${base.database_id}_${segId}`;
        if (!unique.has(key)) {
          unique.set(key, { database_id: base.database_id, segId });
        }
      }
    }
  }

  if (unique.size === 0) return {};

  // 2. Résoudre TOUTES les paires en parallèle
  const entries = [...unique.entries()]; // [[key, {database_id, segId}], ...]
  const names = await Promise.all(
    entries.map(([, { database_id, segId }]) =>
      get_segment_name(database_id, segId)
        .then((n) => n || String(segId))
        .catch(() => String(segId))   // ne pas bloquer si une requête échoue
    )
  );

  // 3. Construire le cache { cacheKey: segmentName }
  const cache = {};
  entries.forEach(([key], i) => { cache[key] = names[i]; });
  return cache;
}

// ─────────────────────────────────────────────────────────────────────────────
// exportGlobalTableXLS
//
// @param bases          data.bases depuis l'API
// @param allbase        [{id, basename}]  — résolution database_id → nom
// @param clsConfig      {A,B,C,D} de AdvertiserDetail (source de vérité classes)
// @param agenceMapping  [{agency_id, agency_name}]
// @param advertiserInfo { id, name }  — pour le titre du rapport
// @param filename       nom du fichier généré
// ─────────────────────────────────────────────────────────────────────────────
export async function exportGlobalTableXLS(
  bases,
  allbase,
  clsConfig,
  agenceMapping,
  advertiserInfo = {},
  filename = "bases_export.xlsx",
) {
  // ── 1. MAPPING STATIQUE — résolutions rapides O(1) ────────────────────────
  console.log("Database mapping complet :", allbase);
  const dbMap     = Object.fromEntries((allbase || []).map((db)    => [db.database_id, db.database_name]));
  const agenceMap = Object.fromEntries((agenceMapping || []).map((agence) => [agence.agence_id, agence.agence_name]));

  // ── 2. PRÉ-CHARGEMENT PARALLÈLE des segments ─────────────────────────────
  //    Toutes les résolutions API se font ICI, avant ExcelJS.
  //    La boucle de génération ci-dessous est 100 % synchrone.
  const segmentCache = await buildSegmentCache(bases);

  // ── 3. Création du classeur ───────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "AdvertiserDetail";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Bases", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  // ── Définition des colonnes ────────────────────────────────────────────────
  const COLS = [
    { label: "Database",     width: 26, align: "left"   },  // C1
    { label: "Classe",       width: 10, align: "center" },  // C2
    { label: "Health",       width: 10, align: "center" },  // C3
    { label: "Brand",        width: 24, align: "left"   },  // C4
    { label: "Subject",      width: 46, align: "left"   },  // C5
    { label: "Date",         width: 14, align: "center" },  // C6
    { label: "Segment(s)",   width: 16, align: "left"   },  // C7
    { label: "ListName",     width: 22, align: "left"   },  // C8
    { label: "Model(s)",     width: 20, align: "left"   },  // C9
    { label: "Agence",       width: 14, align: "center" },  // C10
    { label: "Sends",        width: 14, align: "right"  },  // C11
    { label: "Openers",      width: 14, align: "right"  },  // C12
    { label: "Open %",       width: 11, align: "right"  },  // C13
    { label: "Clickers",     width: 14, align: "right"  },  // C14
    { label: "CTR %",        width: 11, align: "right"  },  // C15
    { label: "Unsubs",       width: 14, align: "right"  },  // C16
    { label: "Unsub %",      width: 11, align: "right"  },  // C17
    { label: "CTO %",        width: 11, align: "right"  },  // C18
    { label: "CA",           width: 14, align: "right"  },  // C19
    { label: "eCPM",         width: 14, align: "right"  },  // C20
    { label: "Clicks val",   width: 12, align: "right"  },  // C21
    { label: "Leads val",    width: 12, align: "right"  },  // C22
    { label: "Volume val",   width: 12, align: "right"  },  // C23
  ];
  const NB = COLS.length;
  COLS.forEach((col, i) => { sheet.getColumn(i + 1).width = col.width; });

  // ── ROW 1 : Titre advertiser ───────────────────────────────────────────────
  // const titleRow = sheet.getRow(1);
  // titleRow.height = 32;
  // const tCell = titleRow.getCell(1);
  // tCell.value = "Export sur : " + (advertiserInfo.name || "–") + "  (" + (advertiserInfo.id || "–") + ")";
  // sc(tCell, { fg: COLOR.header_fg, bg: COLOR.title_bg, bold: true, size: 13 });
  // sheet.mergeCells(1, 1, 1, NB);

  // ── ROW 2 : Date de génération ─────────────────────────────────────────────
  const dateRow = sheet.getRow(2);
  dateRow.height = 18;
  const dCell = dateRow.getCell(1);
  dCell.value = "Généré le " + new Date().toLocaleString("fr-FR");
  sc(dCell, { fg: COLOR.gray, bg: COLOR.date_bg, italic: true, size: 9 });
  sheet.mergeCells(2, 1, 2, NB);

  // ── ROW 3 : En-têtes colonnes ──────────────────────────────────────────────
  const headerRow = sheet.getRow(3);
  headerRow.height = 28;
  COLS.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.label;
    sc(cell, { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true, align: col.align });
  });

  // ── 4. BOUCLE DE DONNÉES — 100 % synchrone (aucun await) ─────────────────
  let globalRowIdx = 0;
// Ajoutez ceci juste avant la boucle for (const base of (bases || []))
console.log("Première base complète :", bases[0]);
console.log("Agence ID sur base :", bases[0]?.agence_id || bases[0]?.agence_id);
  for (const base of (bases || [])) {
    const dbName     = dbMap[base.database_id]     || ("DB #"    + base.database_id);
    const health     = getHealthScore(base);
    const healthColor = health >= 70 ? "16A34A" : health >= 40 ? "D97706" : "EF4444";

    const cls      = (clsConfig && clsConfig[base.classification]) || (clsConfig && clsConfig.C) || { color: "#6B7280", bg: "#F3F4F6", label: base.classification || "?" };
    const clsFg    = cls.color.replace("#", "");
    const clsBg    = cls.bg.replace("#", "");
    const clsLabel = cls.label;

    for (const brand of (base.brands || [])) {

          // ✅ DÉPLACER ICI : agence_id vient du brand, pas de base
      const agenceName = agenceMap[brand.agence_id] || ("Agence #" + brand.agence_id);

      const rowBg = globalRowIdx % 2 === 1 ? COLOR.row_alt : "FFFFFF";
      globalRowIdx++;

      const brandName = decodeField(brand.name);
      const subject   = decodeField(brand.subject);
      const dates     = (brand.date_schedule || []).join(", ");

      // ✅ Lecture directe dans le cache pré-chargé — aucun appel réseau
      const segments = (brand.segment_id || [])
        .map((segId) => segmentCache[`${base.database_id}_${segId}`] || String(segId))
        .join(", ");

      const listname = (brand.ListName || []).join(", ");
      const models = (brand.models || [])
        .filter((m) => m.model && String(m.model).trim())
        .map((m) => {
          const name = String(m.model).trim();
          // Affiche payvalue seulement si présent et non nul
          if (m.payvalue != null && m.payvalue !== 0 && m.payvalue !== "") {
            // Supprime le .0 inutile : 15.0 → "15", 15.5 → "15.5"
            const val = Number.isInteger(m.payvalue)
              ? m.payvalue
              : parseFloat(m.payvalue.toFixed(2));
            return `${name.padEnd(5)}(${val})`;
          }
          return name;
        })
        .join(" | ") || "–";

      const row = sheet.addRow([]);
      row.height = 22;

      // C1 : Database
      row.getCell(1).value = dbName;
      sc(row.getCell(1), { fg: COLOR.black, bg: rowBg, bold: true });

      // C2 : Classe
      row.getCell(2).value = clsLabel;
      sc(row.getCell(2), { fg: clsFg, bg: clsBg, bold: true, align: "center" });

      // C3 : Health
      row.getCell(3).value = health;
      sc(row.getCell(3), { fg: healthColor, bg: rowBg, bold: true, align: "center" });

      // C4 : Brand name
      row.getCell(4).value = brandName;
      sc(row.getCell(4), { fg: COLOR.black, bg: rowBg, bold: true });

      // C5 : Subject
      row.getCell(5).value = subject;
      sc(row.getCell(5), { fg: COLOR.gray, bg: rowBg, italic: true });

      // C6 : Date schedule
      row.getCell(6).value = dates;
      sc(row.getCell(6), { fg: COLOR.gray, bg: rowBg, align: "center" });

      // C7 : Segment(s)
      row.getCell(7).value = segments;
      sc(row.getCell(7), { fg: COLOR.gray, bg: rowBg });

      // C8 : ListName
      row.getCell(8).value = listname;
      sc(row.getCell(8), { fg: COLOR.gray, bg: rowBg });

      // C9 : Model(s)
      row.getCell(9).value = models;
      sc(row.getCell(9), { fg: COLOR.gray, bg: rowBg });

      // C10 : Agence
      row.getCell(10).value = agenceName;
      sc(row.getCell(10), { fg: COLOR.black, bg: rowBg, bold: true });

      // C11 : Sends
      row.getCell(11).value = brand.sends ?? null;
      sc(row.getCell(11), { fg: COLOR.black, bg: rowBg, align: "right", fmt: "#,##0" });

      // C12 : Openers
      row.getCell(12).value = brand.openers ?? null;
      sc(row.getCell(12), { fg: COLOR.black, bg: rowBg, align: "right", fmt: "#,##0" });

      // C13 : Open %
      row.getCell(13).value = brand.taux_openers != null ? brand.taux_openers / 100 : null;
      sc(row.getCell(13), { fg: COLOR.success, bg: rowBg, bold: true, align: "right", fmt: "0.00%" });

      // C14 : Clickers
      row.getCell(14).value = brand.clickers ?? null;
      sc(row.getCell(14), { fg: COLOR.black, bg: rowBg, align: "right", fmt: "#,##0" });

      // C15 : CTR %
      row.getCell(15).value = brand.taux_clickers != null ? brand.taux_clickers / 100 : null;
      sc(row.getCell(15), { fg: COLOR.warning, bg: rowBg, bold: true, align: "right", fmt: "0.00%" });

      // C16 : Unsubs
      row.getCell(16).value = brand.unsubs ?? null;
      sc(row.getCell(16), { fg: COLOR.black, bg: rowBg, align: "right", fmt: "#,##0" });

      // C17 : Unsub %
      row.getCell(17).value = brand.taux_unsubs != null ? brand.taux_unsubs / 100 : null;
      sc(row.getCell(17), { fg: COLOR.danger, bg: rowBg, bold: true, align: "right", fmt: "0.00%" });

      // C18 : CTO %
      row.getCell(18).value = brand.taux_cto != null ? brand.taux_cto / 100 : null;
      sc(row.getCell(18), { fg: COLOR.warning, bg: rowBg, bold: true, align: "right", fmt: "0.00%" });

      // C19 : CA
      row.getCell(19).value = brand.ca ?? null;
      sc(row.getCell(19), { fg: COLOR.black, bg: rowBg, align: "right", fmt: "#,##0.00" });

      // C20 : eCPM
      row.getCell(20).value = brand.ecpm ?? null;
      sc(row.getCell(20), { fg: COLOR.black, bg: rowBg, align: "right", fmt: "#,##0.00" });

      // C21 : clicks_val
      row.getCell(21).value = brand.clicks_val ?? null;
      sc(row.getCell(21), { fg: COLOR.black, bg: rowBg, align: "right", fmt: "#,##0" });

      // C22 : leads_val
      row.getCell(22).value = brand.leads_val ?? null;
      sc(row.getCell(22), { fg: COLOR.black, bg: rowBg, align: "right", fmt: "#,##0" });

      // C23 : volume_val
      row.getCell(23).value = brand.volume_val ?? null;
      sc(row.getCell(23), { fg: COLOR.black, bg: rowBg, align: "right", fmt: "#,##0" });
    } // fin for brand
  } // fin for base

  // ── Ligne de totaux ────────────────────────────────────────────────────────
  const firstDataRow = 4;
  const lastDataRow  = 3 + globalRowIdx;

  const totalRow = sheet.addRow([]);
  totalRow.height = 26;

  totalRow.getCell(1).value = "TOTAL — " + globalRowIdx + " brands / " + (bases || []).length + " bases";
  sc(totalRow.getCell(1), { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true });

  for (let c = 2; c <= 10; c++) blank(totalRow.getCell(c), COLOR.header_bg);

  // SUM : Sends(11), Openers(12), Clickers(14), Unsubs(16), clicks_val(21), leads_val(22), volume_val(23)
  [11, 12, 14, 16, 21, 22, 23].forEach((c) => {
    const L = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "SUM(" + L + firstDataRow + ":" + L + lastDataRow + ")" };
    sc(totalRow.getCell(c), { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true, align: "right", fmt: "#,##0" });
  });

  // AVERAGE : Open%(13), CTR%(15), Unsub%(17), CTO%(18)
  [[13, COLOR.success], [15, COLOR.warning], [17, COLOR.danger], [18, COLOR.warning]].forEach(([c, color]) => {
    const L = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "AVERAGE(" + L + firstDataRow + ":" + L + lastDataRow + ")" };
    sc(totalRow.getCell(c), { fg: color, bg: COLOR.header_bg, bold: true, align: "right", fmt: "0.00%" });
  });

  // SUM : CA(19), eCPM(20)
  [19, 20].forEach((c) => {
    const L = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "SUM(" + L + firstDataRow + ":" + L + lastDataRow + ")" };
    sc(totalRow.getCell(c), { fg: COLOR.header_fg, bg: COLOR.header_bg, bold: true, align: "right", fmt: "#,##0.00" });
  });

  // ── Génération et téléchargement ──────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    filename
  );
}
