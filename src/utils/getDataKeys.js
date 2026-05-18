// ── Utility function pour déterminer les clés dynamiquement ──
export const getKeyMapping = (mappingData) => {
  if (!Array.isArray(mappingData) || mappingData.length === 0) {
    return { idKey: 'id', nameKey: 'name', singularKey: 'item', pluralKey: 'items' };
  }

  const firstItem = mappingData[0];
  const keys = Object.keys(firstItem);
  
  // Détecte les patterns
  const idKey = keys.find(k => k.endsWith('_id'));
  const nameKey = keys.find(k => k.endsWith('_name'));
  
  if (!idKey || !nameKey) {
    return { idKey: 'id', nameKey: 'name', singularKey: 'item', pluralKey: 'items' };
  }
    // Extrait le préfixe (advertiser, database, etc)
  const prefix = idKey.replace('_id', '');
  const singularKey = prefix; // "advertiser" ou "database"
  const pluralKey = prefix === 'database' ? 'databases' : `${prefix}s`; // "bases" ou "advertisers"
  
  return { idKey, nameKey, singularKey, pluralKey };
}