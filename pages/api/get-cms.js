import airtable from '@/utils/airtable';
import populateCmsCacheFromJson from '@/utils/cmsCache';
import { parseDomain, ParseResultType } from 'parse-domain';
import config from '@/nex.config';

// This is our one API endpoint, at /api/get-cms
// it fetches our data from airtable, and provides it in a JSON format
// for our frontend

export default async (req, res) => {
  const cms = {
    base: process.env.AIRTABLE_BASE_ID,
    key: process.env.AIRTABLE_API_KEY
  }

  // This feature is built for neighborexpress, so we can have multiple sites on a domain with the code deployed once
  if (!config.singleSource) {
    const hostname = req.headers.host || 'neighborexpress.org';
    const { subDomains } = parseDomain(hostname);
    if (subDomains) {
      cms.base = config.domains[subDomains[0]]; // we're going to use the correct base
    }
  }

  const data = await airtable.getCms(cms.base, cms.key);
  res.send(data);
};