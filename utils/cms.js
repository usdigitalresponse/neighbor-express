const mmd = require('micromarkdown');

export const getCmsRecordFromKey = (key, state) => {
  const { records, language } = state;

  records.map(record => {
    // We're going to make a helper for the picture column
    record.image = record.picture[0]?.url;
    // And we're going to choose which language we need
    // And default to english if this string isn't translated
    const body = record[`body_${language}`] || record[`body_en`];
    record.body = mmd.parse(body);
    // And we need to do this for title too, not having a title_en is technical debt
    const title = record[`title_${language}`] || record[`title`];
    record.title = title;
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