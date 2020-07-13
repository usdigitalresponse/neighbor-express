// Script used to convert Volunteer data from the
// (Galaxy Digital)[http://api2.galaxydigital.com/volunteer/docs/] APIs
// into the AirTable schemas
import { useRecords, useBase } from "@airtable/blocks/ui";
import { globalConfig } from "@airtable/blocks";

const AIRTABLE_API_KEY = globalConfig.get("AIRTABLE_API");
const AIRTABLE_BASE_ID = globalConfig.get("AIRTABLE_BASE");
const GALAXY_DIGITAL_API_KEY = globalConfig.get("GALAXY_DIGITAL_API_KEY");

const DESTINATION_TABLE = "Volunteers";
const AIRTABLE_MAX = 10;
const GALAXY_DIGITAL_MAX = 50;

async function getGalaxyDigitalVolunteerData(limit, offset) {
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

function createAirtableRecord(batch) {
  base(DESTINATION_TABLE).create(batch, function (err, records) {
    if (err) {
      return err;
    }
  });
}

function updateAirtableRecord(batch) {
  base(DESTINATION_TABLE).update(batch, function (err, records) {
    if (err) {
      return err;
    }
  });
}

// SyncVolunteerData queries for all records in Galaxy Digital's API,
// and creates or updates their records in AirTable
//    - returns successful count, error
export async function SyncVolunteerData() {
  const messagesTable = useBase().getTable("Volunteers");
  const records = useRecords(messagesTable);
  let existingRecords;

  records.forEach(function (record) {
    existingRecords[record.get("Reference ID")] = record.getId();
  });

  let count = 0;
  let totalCount = 0;

  let createBatch = [];
  let updateBatch = [];
  let galaxyDigitalData = await getGalaxyDigitalVolunteerData(
    GALAXY_DIGITAL_MAX,
    count
  );
  if (!galaxyDigitalData) {
    return [0, err];
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
          messagesTable.updateRecordsAsync(updateBatch);
          updateBatch = [];
        }
      } else {
        createBatch.push({
          fields: convertGalaxyDigitalToAirtableSchema(volunteer),
        });

        if (createBatch.length === AIRTABLE_MAX) {
          totalCount += createBatch.length;
          messagesTable.createRecordAsync(createBatch);
          createBatch = [];
        }
      }
    });

    count += GALAXY_DIGITAL_MAX;
    galaxyDigitalData = await getGalaxyDigitalVolunteerData(
      GALAXY_DIGITAL_MAX,
      count
    );
    if (!galaxyDigitalDatan) {
      return [totalCount, err];
    }
  }

  if (createBatch.length > 0) {
    totalCount += createBatch.length;
    messagesTable.createRecordAsync(createBatch);
  }
  if (updateBatch.length > 0) {
    totalCount += updateBatch.length;
    messagesTable.updateRecordsAsync(updateBatch);
  }

  console.log(`Total records: ${totalCount}`);
  return totalCount, null;
}
