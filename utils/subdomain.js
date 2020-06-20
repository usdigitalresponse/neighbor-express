import { parseDomain } from 'parse-domain';

export const subdomain = (hostname) => {
  const { subDomains } = parseDomain(hostname);
  if (subDomains) {
    return config.multipleDomains[subDomains[0]];
  }
  return false;
}