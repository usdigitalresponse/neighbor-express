const AirtablePlus = require('airtable-plus');
var fs = require("fs");

async function populateCmsCache (baseId, apiKey) {
	const inst = new AirtablePlus({
	  'baseID': baseId,
	  'apiKey': apiKey,
	  'tableName': 'CMS-page-builder',
	});
	const records = await inst.read({
		'maxRecords': 60, 
		'sort': [{
	  	'field': 'key', 
	  	'direction': 'asc'
		}]
	}).catch((e) => console.log(e));

	const cacheResults = {
		'records': records.map((record) => {
		  const fields = record.fields;
		  return {
		    ...fields,
		    'picture': fields.picture || [],
		  };
		}),
	};

	fs.writeFile("./cms-cache.json", JSON.stringify(cacheResults, null, 4), (err) => {
	  if (err) {
	    console.error(err);
	    return;
	  };
	  console.log("Cache file populated");
	});
}

module.exports = populateCmsCache;

var myArgs = process.argv.slice(2);
populateCmsCache(myArgs[0], myArgs[1]);