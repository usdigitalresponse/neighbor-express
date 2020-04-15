export const getCmsRecordFromKey = (key, records) => {
  records.map(record => {
    // We want to parse the images 
    record.image = record.picture[0]?.url;
    return record;
  });
  return records.filter(record => record.key === key)[0];
}