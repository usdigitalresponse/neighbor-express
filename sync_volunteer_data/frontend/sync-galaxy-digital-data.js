// Script used to convert Volunteer data from the
// (Galaxy Digital)[http://api2.galaxydigital.com/volunteer/docs/] APIs
// into the AirTable schemas
import { globalConfig } from "@airtable/blocks";

const AIRTABLE_MAX = 10;
const GALAXY_DIGITAL_MAX = 50;

async function getGalaxyDigitalVolunteerData(limit, offset) {
  const GALAXY_DIGITAL_API_KEY = globalConfig.get("GALAXY_DIGITAL_API_KEY");
  const url = new URL("volunteer/user/list/", "https://api2.galaxydigital.com");
  const params = url.searchParams;
  params.set("key", GALAXY_DIGITAL_API_KEY);
  params.set("limit", limit);
  params.set("offset", offset);

  const response = await fetch(url, { method: "GET", mode: "cors" });
  const data = await response.json();
  return data;
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
export async function SyncVolunteerData(messagesTable, records) {
  let existingRecordsById = [];
  let count = 0;
  let totalCount = 0;

  let createBatch = [];
  let updateBatch = [];
  records.forEach(function (record) {
    existingRecordsById[record.getCellValueAsString("Reference ID")] =
      record.id;
  });

  let galaxyDigitalData = await getGalaxyDigitalVolunteerData(
    GALAXY_DIGITAL_MAX,
    count
  );

  if (!galaxyDigitalData) {
    return {
      total: 0,
      err: new Error("Unable to connect to Galaxy Digital API"),
    };
  }

  while (count <= galaxyDigitalData.rows) {
    galaxyDigitalData?.data?.forEach((volunteer) => {
      if (existingRecordsById[volunteer.id]) {
        updateBatch.push({
          id: existingRecordsById[volunteer.id],
          fields: convertGalaxyDigitalToAirtableSchema(volunteer),
        });

        if (updateBatch.length === AIRTABLE_MAX) {
          totalCount += updateBatch.length;
          messagesTable.updateRecordsAsync(updateBatch);
          updateBatch = [];
        }
      } else {
        createBatch.push({
          fields: convertGalaxyDigitalToAirtableSchema(volunteer),
        });

        if (createBatch.length === AIRTABLE_MAX) {
          totalCount += createBatch.length;
          messagesTable.createRecordsAsync(createBatch);
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
      return {
        total: totalCount,
        err: new Error("Unable to connect to Galaxy Digital API"),
      };
    }
  }

  if (createBatch.length > 0) {
    totalCount += createBatch.length;
    messagesTable.createRecordsAsync(createBatch);
  }
  if (updateBatch.length > 0) {
    totalCount += updateBatch.length;
    messagesTable.updateRecordsAsync(updateBatch);
  }

  console.log(`Total records: ${totalCount}`);
  return {
    total: totalCount,
    err: null,
  };
}
