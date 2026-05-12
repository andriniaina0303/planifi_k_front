import { tokens } from "./Tokens";
import { TeamOutlined, HeartOutlined, GlobalOutlined } from "@ant-design/icons";

export const buildRecommendations = (data) => {
  const merged = {};

  data.bases.forEach((base) => {
    if (!base.dimensions) return;

    Object.entries(base.dimensions).forEach(([dimKey, dimData]) => {
      if (!merged[dimKey]) merged[dimKey] = {};

      Object.entries(dimData).forEach(([seg, vals]) => {
        if (!merged[dimKey][seg]) {
          merged[dimKey][seg] = {
            sends: 0,
            openers: 0,
            clickers: 0,
            unsubs: 0,
          };
        }

        merged[dimKey][seg].sends += vals.sends || 0;
        merged[dimKey][seg].openers += vals.openers || 0;
        merged[dimKey][seg].clickers += vals.clickers || 0;
        merged[dimKey][seg].unsubs += vals.unsubs || 0;
      });
    });
  });

  const dimLabels = {
    age_range: {
      label: "Tranche d'âge",
      icon: <TeamOutlined />,
      color: tokens.primary,
    },
    gender: {
      label: "Civilité / Genre",
      icon: <HeartOutlined />,
      color: tokens.pink,
    },
    isp: {
      label: "ISP / FAI",
      icon: <GlobalOutlined />,
      color: tokens.cyan,
    },
  };

  const results = [];

  Object.entries(merged).forEach(([dimKey, segments]) => {
    const meta = dimLabels[dimKey];

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

    results.push({
      dimKey,
      ...meta,
      bestCtr: [...entries].sort((a, b) => b.ctr - a.ctr)[0],
      bestOpen: [...entries].sort((a, b) => b.openRate - a.openRate)[0],
      bestUnsub: [...entries].sort(
        (a, b) => a.unsubRate - b.unsubRate
      )[0],
      worstCtr: [...entries].sort((a, b) => a.ctr - b.ctr)[0],
      biggestVol: [...entries].sort((a, b) => b.sends - a.sends)[0],
      totalSegments: entries.length,
    });
  });

  return results;
};