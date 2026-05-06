// Installer ces dépendances : npm install exceljs file-saver
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Colors matching UI tokens
const COLOR = {
  success:   "16A34A",
  warning:   "D97706",
  danger:    "EF4444",
  header_bg: "1E293B",
  header_fg: "FFFFFF",
  row_alt:   "F8FAFC",
  black:     "111827",
};

function getHealthScore(base) {
  if (!base) return 0;
  let score = 50;
  if (base.taux_openers > 20) score += 15;
  else if (base.taux_openers > 10) score += 7;
  if (base.taux_clickers > 3) score += 15;
  else if (base.taux_clickers > 1) score += 7;
  if (base.taux_unsubs < 0.1) score += 10;
  else if (base.taux_unsubs < 0.3) score += 5;
  else if (base.taux_unsubs > 1) score -= 15;
  return Math.min(100, Math.max(0, score));
}

function styleCell(cell, { fgColor, bgColor, bold = false, align = "left", numFmt } = {}) {
  cell.font = { name: "Arial", size: 10, bold, color: { argb: "FF" + (fgColor || COLOR.black) } };
  if (bgColor) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + bgColor } };
  cell.alignment = { horizontal: align, vertical: "middle", wrapText: false };
  if (numFmt) cell.numFmt = numFmt;
  cell.border = {
    bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
    right:  { style: "thin", color: { argb: "FFE5E7EB" } },
  };
}

export async function exportGlobalTableXLS(
  bases,
  allbase,
  clsConfig,
  filename = "bases_export.xlsx"
) {
  const dbMap = Object.fromEntries((allbase || []).map((db) => [db.id, db.basename]));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "AdvertiserDetail";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Bases", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  const COLS = [
    { label: "Database", width: 22, align: "left"   },
    { label: "Classe",   width: 10, align: "center"  },
    { label: "Health",   width: 10, align: "center"  },
    { label: "Sends",    width: 14, align: "right"   },
    { label: "Openers",  width: 14, align: "right"   },
    { label: "Open %",   width: 12, align: "right"   },
    { label: "Clickers", width: 14, align: "right"   },
    { label: "CTR %",    width: 12, align: "right"   },
    { label: "Unsubs",   width: 14, align: "right"   },
    { label: "Unsub %",  width: 12, align: "right"   },
    { label: "CA",       width: 14, align: "right"   },
    { label: "eCPM",     width: 14, align: "right"   },
  ];

  COLS.forEach((col, i) => { sheet.getColumn(i + 1).width = col.width; });

  // Header row - written cell by cell (no sheet.columns key/header to avoid offset)
  const headerRow = sheet.getRow(1);
  headerRow.height = 28;
  COLS.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.label;
    styleCell(cell, { fgColor: COLOR.header_fg, bgColor: COLOR.header_bg, bold: true, align: col.align });
  });

  // Data rows
  (bases || []).forEach((base, rowIdx) => {
    const rowBg  = rowIdx % 2 === 1 ? COLOR.row_alt : "FFFFFF";
    const health = getHealthScore(base);

    // Use clsConfig exactly like the UI does: clsConfig[v] || clsConfig.C
    // This is the single source of truth — same object passed from AdvertiserDetail
    const cls    = clsConfig[base.classification] || clsConfig.C;
    const clsFg  = cls.color.replace("#", "");
    const clsBg  = cls.bg.replace("#", "");
    // cls.label holds "A", "B", "C" or "D" — the value displayed in the UI
    const clsLabel = cls.label;

    const row = sheet.addRow([]);
    row.height = 22;

    // C1: Database
    row.getCell(1).value = dbMap[base.database_id] || ("DB #" + base.database_id);
    styleCell(row.getCell(1), { fgColor: COLOR.black, bgColor: rowBg, bold: true, align: "left" });

    // C2: Classe — label and colors come from clsConfig, same as UI
    row.getCell(2).value = clsLabel;
    styleCell(row.getCell(2), { fgColor: clsFg, bgColor: clsBg, bold: true, align: "center" });

    // C3: Health
    row.getCell(3).value = health;
    const healthColor = health >= 70 ? "16A34A" : health >= 40 ? "D97706" : "EF4444";
    styleCell(row.getCell(3), { fgColor: healthColor, bgColor: rowBg, bold: true, align: "center" });

    // C4: Sends
    row.getCell(4).value = base.sends ?? null;
    styleCell(row.getCell(4), { fgColor: COLOR.black, bgColor: rowBg, align: "right", numFmt: "#,##0" });

    // C5: Openers
    row.getCell(5).value = base.openers ?? null;
    styleCell(row.getCell(5), { fgColor: COLOR.black, bgColor: rowBg, align: "right", numFmt: "#,##0" });

    // C6: Open % — green (tokens.success)
    row.getCell(6).value = base.taux_openers != null ? base.taux_openers / 100 : null;
    styleCell(row.getCell(6), { fgColor: COLOR.success, bgColor: rowBg, bold: true, align: "right", numFmt: "0.00%" });

    // C7: Clickers
    row.getCell(7).value = base.clickers ?? null;
    styleCell(row.getCell(7), { fgColor: COLOR.black, bgColor: rowBg, align: "right", numFmt: "#,##0" });

    // C8: CTR % — orange (tokens.warning)
    row.getCell(8).value = base.taux_clickers != null ? base.taux_clickers / 100 : null;
    styleCell(row.getCell(8), { fgColor: COLOR.warning, bgColor: rowBg, bold: true, align: "right", numFmt: "0.00%" });

    // C9: Unsubs
    row.getCell(9).value = base.unsubs ?? null;
    styleCell(row.getCell(9), { fgColor: COLOR.black, bgColor: rowBg, align: "right", numFmt: "#,##0" });

    // C10: Unsub % — red (tokens.danger)
    row.getCell(10).value = base.taux_unsubs != null ? base.taux_unsubs / 100 : null;
    styleCell(row.getCell(10), { fgColor: COLOR.danger, bgColor: rowBg, bold: true, align: "right", numFmt: "0.00%" });

    // C11: CA
    row.getCell(11).value = base.ca ?? null;
    styleCell(row.getCell(11), { fgColor: COLOR.black, bgColor: rowBg, align: "right", numFmt: '#,##0.00' });

    // C12: eCPM
    row.getCell(12).value = base.ecpm ?? null;
    styleCell(row.getCell(12), { fgColor: COLOR.black, bgColor: rowBg, align: "right", numFmt: '#,##0.00' });
  });

  // Totals row
  const lastData = (bases || []).length + 1;
  const totalRow = sheet.addRow([]);
  totalRow.height = 24;

  totalRow.getCell(1).value = "Total (" + (bases || []).length + " bases)";
  styleCell(totalRow.getCell(1), { fgColor: COLOR.header_fg, bgColor: COLOR.header_bg, bold: true });
  [2, 3,12].forEach((c) => styleCell(totalRow.getCell(c), { bgColor: COLOR.header_bg }));

  [[4, "#,##0"], [5, "#,##0"], [7, "#,##0"], [9, "#,##0"]].forEach(([c, fmt]) => {
    const letter = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "SUM(" + letter + "2:" + letter + lastData + ")" };
    styleCell(totalRow.getCell(c), { fgColor: COLOR.header_fg, bgColor: COLOR.header_bg, bold: true, align: "right", numFmt: fmt });
  });

  [[6, COLOR.success], [8, COLOR.warning], [10, COLOR.danger]].forEach(([c, color]) => {
    const letter = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "AVERAGE(" + letter + "2:" + letter + lastData + ")" };
    styleCell(totalRow.getCell(c), { fgColor: color, bgColor: COLOR.header_bg, bold: true, align: "right", numFmt: "0.00%" });
  });

  [[11]].forEach(([c]) => {
    const letter = sheet.getColumn(c).letter;
    totalRow.getCell(c).value = { formula: "SUM(" + letter + "2:" + letter + lastData + ")" };
    styleCell(totalRow.getCell(c), { fgColor: COLOR.header_fg, bgColor: COLOR.header_bg, bold: true, align: "right", numFmt: '#,##0.00' });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    filename
  );
}


