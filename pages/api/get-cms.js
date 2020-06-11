/*
* This is the *only* server-side file for neighbor express.
*/
const airtable = require('../../utils/airtable.js');
const populateCmsCacheFromJson = require('../../utils/cmsCache.js');

// This takes the data from our CMS airtable
// And sends it off to the frontend
export default async (req, res) => {
  const data = await airtable.getCms(process.env.AIRTABLE_BASE_ID, process.env.AIRTABLE_API_KEY);
  populateCmsCacheFromJson(data);
  res.send(data);
};