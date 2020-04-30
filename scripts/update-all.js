const exec = require('@actions/exec');
const populateCmsCache = require('./populate-cms-cache.js');

// What cities do we serve?
//const cities = ['concord', 'walnutcreek', 'paterson', 'demo1', 'demo2', 'demo3', 'landing-page'];
const cities = ['demo2', 'demo3'];

cities.forEach(city => {
  // Lets get our baseid
  const baseId = process.env[`AIRTABLE_BASE_ID_${city.toUpperCase()}`]
  populateCmsCache(baseId, process.env['AIRTABLE_API_KEY']);
  // We are going to throw away our .now folder between deploys
  exec.exec('rm -rf .now');
  // And we're going to send it out to the correct vercel location
  exec.exec(`now --env AIRTABLE_BASE_ID=${baseId} --name ${city} --confirm --scope neighborexpress --token ${process.env.ZEIT_TOKEN}`); // ADD PROD BACK!!
})