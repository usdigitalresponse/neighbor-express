const AirtablePlus = require('airtable-plus');

async function getCms(baseId, apiKey) {
  const inst = new AirtablePlus({
    baseID: baseId,
    apiKey: apiKey,
    tableName: 'CMS-page-builder',
  });

  const records = await inst.read({
    sort: [{
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

module.exports.getCms = getCms;
