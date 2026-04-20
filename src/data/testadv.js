const getAnalyse = (taux_clickers, taux_openers, taux_unsubs, openers, clickers) => {
  const cto = openers ? (clickers / openers) * 100 : 0;

  return {
    taux_clickers:
      taux_clickers > 3
        ? "🟢 Taux de clic satisfaisant"
        : taux_clickers > 1
        ? "🟡 Taux moyen"
        : "🔴 Taux faible",

    taux_cto:
      cto > 20
        ? "✅ Bon engagement"
        : "⚠️ Faible engagement (CTO)",

    taux_unsubs:
      taux_unsubs > 1
        ? "🚨 Taux de désabonnement très élevé"
        : "ℹ️ Taux normal",
  };
};

const testAdvertisers = Array.from({ length: 50 }, (_, i) => {
  const sends = Math.floor(Math.random() * 20000) + 5000;
  const openers = Math.floor(Math.random() * sends * 0.4);
  const clickers = Math.floor(Math.random() * openers * 0.3);
  const unsubs = Math.floor(Math.random() * sends * 0.02);

  const taux_openers = ((openers / sends) * 100).toFixed(2);
  const taux_clickers = ((clickers / sends) * 100).toFixed(2);
  const taux_unsubs = ((unsubs / sends) * 100).toFixed(2);

  return {
    advrtiser_id: 1000000000 + i,
    advertiser_name: `Advertiser_${i + 1}`,
    tags_id: Math.floor(Math.random() * 74) + 1,
    globales: {
      sends,
      openers,
      clickers,
      unsubs,
      taux_openers: parseFloat(taux_openers),
      taux_clickers: parseFloat(taux_clickers),
      taux_unsubs: parseFloat(taux_unsubs),
      ca: parseFloat((Math.random() * 4500 + 500).toFixed(2)),
      ecpm: parseFloat((Math.random() * 9.5 + 0.5).toFixed(2)),
      analyse: getAnalyse(
        parseFloat(taux_clickers),
        parseFloat(taux_openers),
        parseFloat(taux_unsubs),
        openers,
        clickers
      ),
    },
  };
});

export default testAdvertisers;