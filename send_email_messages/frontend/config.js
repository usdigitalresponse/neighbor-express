import {base} from '@airtable/blocks';

export async function getConfigOfType(type) {
  const allConfig = (await base.getTable("Email Configuration").selectRecordsAsync()).records;
  return allConfig.filter(c => c.getCellValue("type").name === type)
}

export async function getGlobalValueFromKey(key) {
  const globalConfig = await getConfigOfType("global");
  return globalConfig.find(k => k.name === key).getCellValue("value");
}

export async function getSendgridConfig() {
  const globalConfig = await getConfigOfType("global");

  function globalValueFromKey(key) {
    return globalConfig.find(k => k.name === key).getCellValue("value");
  }

  return {
    SENDGRID_PROXY_TOKEN: globalValueFromKey("SENDGRID_PROXY_TOKEN"),
    REPLY_TO: {
      name: globalValueFromKey("reply_to_name"),
      email: globalValueFromKey("reply_to_email")
    },
    EMAIL_TYPES: await getEmailTypes()
  }
}

export async function getEmailTypes() {
  const emailTypesConfig = await getConfigOfType("email-template");

  const EMAIL_TYPES = {};
  for (const emailType of emailTypesConfig) {
    EMAIL_TYPES[emailType.name] = {
      "sendgrid_template": emailType.getCellValue("sendgrid_template"),
      "audience": emailType.getCellValue("audience").name,
      "stages": emailType.getCellValue("stages").map((s) => {return s.name}),
    }
  }
  return EMAIL_TYPES;
}