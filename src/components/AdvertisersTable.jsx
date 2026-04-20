import React from "react";

const fmtN = (n) =>
  n >= 1000000 ? (n / 1000000).toFixed(1) + "M" :
  n >= 1000 ? (n / 1000).toFixed(0) + "k" : n;

const AdvertisersTable = ({ data }) => {
  const maxSends = Math.max(...data.map((a) => a.globales.sends), 1);

  return (
    <div className="table-card">
      <div className="table-head">
        <span className="table-title">Performance</span>
        <span>{data.length} résultats</span>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Annonceur</th>
            <th>Envois</th>
            <th>Ouverture</th>
            <th>Clic</th>
            <th>Désabo</th>
          </tr>
        </thead>

        <tbody>
          {data.map((a) => {
            const g = a.globales;
            const pct = (g.sends / maxSends) * 100;

            return (
              <tr key={a.advrtiser_id}>
                <td>{a.advertiser_name}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    {fmtN(g.sends)}
                    <div className="bar">
                      <div
                        className="bar-fill"
                        style={{ width: `${pct}%`, background: "#3b82f6" }}
                      />
                    </div>
                  </div>
                </td>
                <td>{g.taux_openers || 0}%</td>
                <td>{g.taux_clickers || 0}%</td>
                <td>{g.taux_unsubs || 0}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdvertisersTable;