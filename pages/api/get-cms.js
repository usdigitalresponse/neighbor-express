/*
* This is the *only* server-side file for neighbor express.
*/
const AirtablePlus = require('airtable-plus');

const inst = new AirtablePlus({
  baseId: process.env.AIRTABLE_BASE_ID,
  apiKey: process.env.AIRTABLE_API_KEY,
  tableName: 'CMS-page-builder',
});


// This takes the data from our CMS airtable
// And sends it off to the frontend
export default async (req, res) => {
  const records = await inst.read({ maxRecords: 30 });

  res.send({
    records: records.map((record) => {
      console.log(record);
      const fields = record.fields;
      return {
        ...fields,
        picture: fields.picture || [],
      };
    }),
  });
};