export const getCmsRecordFromKey = (key, records) => {
  return records.filter(record => record.key === key)[0];
}