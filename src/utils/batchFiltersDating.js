import { get_advertisers_detail } from "../api/advertiser";


export const buildDateMapping = async (advertisers) => {

  const mapping = {};

  // Taille batch
  const BATCH_SIZE = 20;

  for (let i = 0; i < advertisers.length; i += BATCH_SIZE) {

    const batch = advertisers.slice(i, i + BATCH_SIZE);

    // Exécuter 10 requêtes en parallèle
    const batchResults = await Promise.allSettled(
      batch.map((adv) =>
        get_advertisers_detail(adv.advertiser_id)
      )
    );

    batchResults.forEach((result) => {

      if (result.status !== "fulfilled") return;

      const detail = result.value;

      if (!detail?.advertiser_id) return;

      const advertiserId = detail.advertiser_id;

      mapping[advertiserId] = [];

      if (detail.bases && Array.isArray(detail.bases)) {

        detail.bases.forEach((base) => {

          if (base.brands && Array.isArray(base.brands)) {

            base.brands.forEach((brand) => {

              if (
                brand.date_schedule &&
                Array.isArray(brand.date_schedule)
              ) {

                brand.date_schedule.forEach((date) => {

                  if (
                    !mapping[advertiserId].includes(date)
                  ) {
                    mapping[advertiserId].push(date);
                  }

                });

              }

            });

          }

        });

      }

    });

    console.log(
      `Batch ${i / BATCH_SIZE + 1} terminé`
    );
  }

  return mapping;
};