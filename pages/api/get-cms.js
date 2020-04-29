/*
* This is the *only* server-side file for neighbor express.
*/
const AirtablePlus = require('airtable-plus');

const inst = new AirtablePlus({
  baseId: process.env.AIRTABLE_BASE_ID,
  apiKey: process.env.AIRTABLE_API_KEY,
  tableName: 'CMS-page-builder',
});


export async function getCms(airtableInst) {
  const records = await airtableInst.read({
    maxRecords: 60, sort: [{
      field: 'key', direction: 'asc'
    }]
  });

  return {
    records: records.map((record) => {
      const fields = record.fields;
      return {
        ...fields,
        picture: fields.picture || [],
      };
    }),
  };
}

// This takes the data from our CMS airtable
// And sends it off to the frontend
export default async (req, res) => {
  res.send(await getCms(inst));
};