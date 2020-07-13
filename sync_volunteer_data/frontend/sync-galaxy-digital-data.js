// Script used to convert Volunteer data from the
// (Galaxy Digital)[http://api2.galaxydigital.com/volunteer/docs/] APIs
// into the AirTable schemas
import { useRecords, useBase } from "@airtable/blocks/ui";
import { globalConfig } from "@airtable/blocks";

const DESTINATION_TABLE = "Volunteers";
const AIRTABLE_MAX = 10;
const GALAXY_DIGITAL_MAX = 50;

async function getGalaxyDigitalVolunteerData(limit, offset) {
  const GALAXY_DIGITAL_API_KEY = globalConfig.get("GALAXY_DIGITAL_API_KEY");
  const url = new URL("volunteer/user/list/", "https://api2.galaxydigital.com");
  const params = url.searchParams;
  params.set("key", GALAXY_DIGITAL_API_KEY);
  params.set("limit", limit);
  params.set("offset", offset);

  const response = await fetch(url, { method: "GET" })
    .then((resp) => resp.json())
    .catch(console.error);
  return response;
}

function convertGalaxyDigitalToAirtableSchema(galaxyDigitalVolunteer) {
  return {
    Name: `${galaxyDigitalVolunteer.firstName?.trim()} ${galaxyDigitalVolunteer.lastName?.trim()}`,
    Email: galaxyDigitalVolunteer.email?.trim(),
    Phone:
      galaxyDigitalVolunteer.mobile?.trim() ||
      galaxyDigitalVolunteer.phone?.trim(),
    Address: galaxyDigitalVolunteer.address
      ? `${galaxyDigitalVolunteer.address?.trim()} ${galaxyDigitalVolunteer.address2?.trim()} ${galaxyDigitalVolunteer.city?.trim()}, ${galaxyDigitalVolunteer.state?.trim()} ${galaxyDigitalVolunteer.postal?.trim()}`
      : null,
    "Submitted date": galaxyDigitalVolunteer.dateAdded,
    "Reference ID": galaxyDigitalVolunteer.id,
  };
}

// SyncVolunteerData queries for all records in Galaxy Digital's API,
// and creates or updates their records in AirTable
//    - returns successful count, error
export function SyncVolunteerData({}) {
  const messagesTable = useBase().getTable(DESTINATION_TABLE);
  const records = useRecords(messagesTable);
  let existingRecords, successfulCount, syncError;

  records.forEach(function (record) {
    existingRecords[record.get("Reference ID")] = record.getId();
  });

  async function syncGalaxyDigitalData(airtableTable, existingRecords) {
    let count = 0;
    let totalCount = 0;

    let createBatch = [];
    let updateBatch = [];
    let galaxyDigitalData = await getGalaxyDigitalVolunteerData(
      GALAXY_DIGITAL_MAX,
      count
    );
    if (!galaxyDigitalData) {
      return [0, new Error("Unable to connect to Galaxy Digital API")];
    }

    while (count <= galaxyDigitalData.rows) {
      galaxyDigitalData?.data?.forEach((volunteer) => {
        if (existingRecords[volunteer.id]) {
          updateBatch.push({
            id: existingRecords[volunteer.id],
            fields: convertGalaxyDigitalToAirtableSchema(volunteer),
          });

          if (updateBatch.length === AIRTABLE_MAX) {
            totalCount += updateBatch.length;
            airtableTable.updateRecordsAsync(updateBatch);
            updateBatch = [];
          }
        } else {
          createBatch.push({
            fields: convertGalaxyDigitalToAirtableSchema(volunteer),
          });

          if (createBatch.length === AIRTABLE_MAX) {
            totalCount += createBatch.length;
            airtableTable.createRecordAsync(createBatch);
            createBatch = [];
          }
        }
      });

      count += GALAXY_DIGITAL_MAX;
      galaxyDigitalData = await getGalaxyDigitalVolunteerData(
        GALAXY_DIGITAL_MAX,
        count
      );
      if (!galaxyDigitalData) {
        return [
          totalCount,
          new Error("Unable to connect to Galaxy Digital API"),
        ];
      }
    }

    if (createBatch.length > 0) {
      totalCount += createBatch.length;
      airtableTable.createRecordAsync(createBatch);
    }
    if (updateBatch.length > 0) {
      totalCount += updateBatch.length;
      airtableTable.updateRecordsAsync(updateBatch);
    }

    console.log(`Total records: ${totalCount}`);
    return [totalCount, null];
  }

  syncGalaxyDigitalData(messagesTable, existingRecords).then(
    (totalCount, e) => {
      successfulCount = totalCount;
      syncError = e;
    }
  );
  return successfulCount, syncError;
}
