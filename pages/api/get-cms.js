/*
* This is the *only* server-side file for neighbor express.
*/
const airtable = require('../../utils/airtable.js');

// This takes the data from our CMS airtable
// And sends it off to the frontend
export default async (req, res) => {
  res.send(await airtable.getCms(process.env.AIRTABLE_BASE_ID, process.env.AIRTABLE_API_KEY));
};