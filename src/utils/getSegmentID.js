export const getSegmentID = (data) => {
    data?.brands?.forEach((brand) => {
    if (brand.segment_id != null) {
        console.log(brand.segment_id);
    }
    });
};