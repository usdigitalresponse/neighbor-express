export const getCmsRecordFromKey = (key, records) => {
  // We need to make the picture field into something more useful
  // to the front end
  records.map(record => {
    record.image = record.picture[0]?.url;
    return record;
  });

  const record = records.filter(record => record.key === key)[0];

  // If we don't find a record, lets return a blank object so the application
  // doesn't fail, and log this out to the user so they can check their airtable
  // spreadsheet
  if (!record) {
    console.error(`❗ Missing ${key} value in CMS`);
    return {};
  }

  if (!record.key) {
    console.error(`The CMS was set up incorrectly and is missing a "key" column. Check that the column name is not "Name"!`);
  }

  return record;
}