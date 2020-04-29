const exec = require('@actions/exec');

// What cities do we serve?
const cities = ['concord', 'walnutcreek', 'paterson', 'demo1', 'demo2', 'demo3', 'landing-page'];

console.log("💻 Starting deployment process... ");
cities.forEach(city => {
  console.log(`🚀 Starting deploy process for ${city}`);
  // Lets get our baseid
  const baseId = process.env[`AIRTABLE_BASE_ID_${city.toUpperCase()}`]
  // We are going to throw away our .now folder between deploys
  exec.exec('rm -rf .now');
  // And we're going to send it out to the correct vercel location
  exec.exec(`now --env AIRTABLE_BASE_ID=${baseId} --name ${city} --confirm --scope neighborexpress --token ${process.env.ZEIT_TOKEN} --prod`);
  console.log(`Sending updated code to Vercel... 🚆`);
  console.log(`🎉 Wrapped up deploy for ${city}`);
})