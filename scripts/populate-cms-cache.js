var fs = require("fs");
const airtable = require('../utils/airtable.js');


async function populateCmsCache (baseId, apiKey) {
	const cacheResults = await airtable.getCms(baseId, apiKey).catch((err) => {
		console.log(err);
		return {"records": []};
	});

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