import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  type LegendItem,
  type ChartEvent,
  type ChartOptions
} from 'chart.js';

import { useMemo, useRef, useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DonutsGraphProps {
  data: number[];
  labels: string[];
  className?: string;
  totalNL?: number;
  totalNLOuvert?: number;
  isRegionMode?: boolean;
  isTownMode?: boolean;
}

const DonutsGraph: React.FC<DonutsGraphProps> = ({
  data,
  labels,
  className,
  totalNL,
  totalNLOuvert,
  isRegionMode = false,
  isTownMode = false
}) => {
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  // Mémoïser les labels tronqués
  const truncatedLabels = useMemo(
    () =>
      labels.map((label) =>
        label.length > 8 ? label.slice(0, 6) + "…" : label
      ),
    [labels]
  );

  // Mémoïser les données du chart
  const chartData = useMemo(
    () => ({
      labels: truncatedLabels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(139, 69, 19, 0.2)',
            'rgba(47, 79, 79, 0.2)',
            'rgba(128, 0, 0, 0.2)',
            'rgba(85, 107, 47, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(139, 69, 19, 0.2)',
            'rgba(47, 79, 79, 0.2)',
            'rgba(128, 0, 0, 0.2)',
            'rgba(85, 107, 47, 0.2)',
          ],
          borderWidth: 1,
        },
      ],
    }),
    [data, truncatedLabels]
  );

  // Mémoïser les options
  const options: ChartOptions<'doughnut'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,

      animation: {
        duration: 300,
      },

      plugins: {
        legend: {
          position: 'bottom' as const,

          labels: {
            font: {
              size: 9,
            },

            padding: 5,
            boxWidth: 12,
          },

          onHover: function (
            this,
            event: ChartEvent,
            legendItem: LegendItem,
            legend
          ) {
            const chart = legend.chart as ChartJS<'doughnut'>;

            if (legendItem.index !== undefined) {
              chart.setActiveElements([
                {
                  datasetIndex: 0,
                  index: legendItem.index,
                },
              ]);

              chart.tooltip?.setActiveElements(
                [
                  {
                    datasetIndex: 0,
                    index: legendItem.index,
                  },
                ],
                {
                  x: event.x ?? 0,
                  y: event.y ?? 0,
                }
              );

              chart.update('none');
            }
          },

          onLeave: function (
            this,
            event: ChartEvent,
            legendItem: LegendItem,
            legend
          ) {
            const chart = legend.chart as ChartJS<'doughnut'>;

            chart.setActiveElements([]);

            chart.tooltip?.setActiveElements([], {
              x: 0,
              y: 0,
            });

            chart.update('none');
          },
        },

        title: {
          display: true,

          text:
            totalNL && totalNLOuvert
              ? [
                  `📨 NL envoyés : ${totalNL.toLocaleString('fr-FR')}`,
                  `📬 NL ouverts : ${totalNLOuvert.toLocaleString('fr-FR')}`,
                  `📭 Non ouverts : ${(totalNL - totalNLOuvert).toLocaleString('fr-FR')}`,
                ]
              : `Clics ${
                  isTownMode
                    ? 'par ville'
                    : isRegionMode
                    ? 'par région'
                    : 'par département'
                }`,

          font: {
            size: 11,
            weight: 'bold' as const,
          },

          padding: {
            top: 5,
            bottom: 8,
          },

          position: 'top' as const,
          align: 'start' as const,
        },

        tooltip: {
          position: 'average' as const,

          callbacks: {
            label: function (context: any) {
              const originalLabel = labels[context.dataIndex];

              const value = context.parsed;

              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );

              const percentage =
                total > 0
                  ? ((value / total) * 100).toFixed(1)
                  : "0";

              return [
                originalLabel,
                `${value} clic${value > 1 ? "s" : ""}`,
                `(${percentage}%)`,
              ];
            },
          },
        },
      },
    }),
    [labels, totalNL, totalNLOuvert, isRegionMode, isTownMode, data]
  );

  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      className={`w-100 h-100 d-flex align-items-center justify-content-center ${className || ""}`}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: '200px',
        }}
      >
        <Chart
          ref={chartRef}
          type="doughnut"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default DonutsGraph;