// Fusionne deux listes de colonnes : en cas de dataIndex commun, la version
// de overrideCols (createBrandCols) gagne. Les colonnes propres à overrideCols
// sans dataIndex (ex: "Conv %") sont ajoutées à la fin.
// Les colonnes "fixed: left" propres à overrideCols sont ajoutées au début.
export const mergeColumns = (baseCols, overrideCols) => {
  const overrideMap = new Map();
  overrideCols.forEach((col) => {
    if (col.dataIndex !== undefined) overrideMap.set(col.dataIndex, col);
  });

  const merged = baseCols.map((col) =>
    col.dataIndex !== undefined && overrideMap.has(col.dataIndex)
      ? overrideMap.get(col.dataIndex)
      : col
  );

  const mergedKeys = new Set(
    merged.map((c) => c.dataIndex).filter((d) => d !== undefined)
  );

  const extras = overrideCols.filter(
    (c) => c.dataIndex === undefined || !mergedKeys.has(c.dataIndex)
  );

  const extrasLeft = extras.filter((c) => c.fixed === "left");
  const extrasRest = extras.filter((c) => c.fixed !== "left");
  return [...extrasLeft, ...merged, ...extrasRest];
  // return [ ...merged];
};


export const reorderColumns = (columns, orderedKeys) => {
  return [...columns].sort((a, b) => {
    const indexA = orderedKeys.indexOf(a.dataIndex);
    const indexB = orderedKeys.indexOf(b.dataIndex);

    // Si la colonne n'est pas dans la liste ordonnée, on la met à la fin
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
};