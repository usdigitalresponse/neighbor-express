/*
* This is the *only* server-side file for neighbor express.
*/
const AirtablePlus = require('airtable-plus');
const mmd = require('micromarkdown');

const inst = new AirtablePlus({
  baseId: process.env.AIRTABLE_BASE_ID,
  apiKey: process.env.AIRTABLE_API_KEY,
  tableName: 'CMS',
});


// This takes the data from our CMS airtable
// And sends it off to the frontend
export default async (req, res) => {
  const records = await inst.read({ maxRecords: 30 });
  res.send({
    records: records.map((record) => {
      const {
        key, title, enabled, body_en, body_es, picture, secondary_en, secondary_es, href,
      } = record.fields;
      return {
        key,
        enabled,
        title,
        body_en: mmd.parse(nl2br(body_en)),
        body_es: nl2br(body_es),
        picture: picture || [],
        secondary_en,
        secondary_es,
        href,
      };
    }),
  });
};

// This adds a <br /> tag where a \n is
function nl2br(str, replaceMode, isXhtml) {
  const breakTag = (isXhtml) ? '<br />' : '<br>';
  const replaceStr = (replaceMode) ? `$1${breakTag}` : `$1${breakTag}$2`;
  return (`${str}`).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
}
