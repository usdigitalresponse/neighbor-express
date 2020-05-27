const exec = require('@actions/exec');
const populateCmsCache = require('./populate-cms-cache.js');

// What cities do we serve?
const cities = ['demo3', 'concord', 'walnutcreek', 'paterson', 'sanramon', 'demo1', 'demo2', 'cms', 'landing-page'];

//https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

asyncForEach(cities, async (city) => {
  // Lets get our baseid
  const baseId = process.env[`AIRTABLE_BASE_ID_${city.toUpperCase()}`]
  // And we'll get whatever the CMS said at the time of deploy, for the cache
  await populateCmsCache(baseId, process.env['AIRTABLE_API_KEY'])
  // We are going to throw away our .now folder between deploys
  await exec.exec('rm -rf .now');
  // And we're going to send it out to the correct vercel location
  await exec.exec(`now --env AIRTABLE_BASE_ID=${baseId} --name ${city} --confirm --scope neighborexpress --token ${process.env.ZEIT_TOKEN} --prod`);
})