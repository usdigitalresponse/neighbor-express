// Script used to convert Volunteer data from the
// (Galaxy Digital)[http://api2.galaxydigital.com/volunteer/docs/] APIs
// into the AirTable schemas
//
// Run by calling:
//    `node sync-galaxy-digital-data.js <AIRTABLE_API_KEY> <AIRTABLE_BASE_ID> <GALAXY_DIGITAL_API_KEY>

var Airtable = require("airtable");
const fetch = require("node-fetch");

const apiKeys = process.argv.slice(2);

const AIRTABLE_API_KEY = apiKeys[0];
const AIRTABLE_BASE_ID = apiKeys[1];
const GALAXY_DIGITAL_API_KEY = apiKeys[2];

const DESTINATION_TABLE = "Volunteer Engagement";
const AIRTABLE_MAX = 10;
const GALAXY_DIGITAL_MAX = 50;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function getGalaxyDigitalVolunteerData(limit, offset) {
  let error;
  const url = new URL("volunteer/user/list/", "https://api2.galaxydigital.com");
  const params = url.searchParams;
  params.set("key", GALAXY_DIGITAL_API_KEY);
  params.set("limit", limit);
  params.set("offset", offset);

  const response = await fetch(url, { method: "GET" })
    .then((resp) => resp.json())
    .catch((e) => (error = e));
  return [response, error];
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

// pullAirtableVolunteers pulls all data from the destination table
// to determine if a record needs to be created or updated
function pullAirtableVolunteers() {
  const existingRecords = {};

  base(DESTINATION_TABLE)
    .select({
      view: "Main View",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record) {
          existingRecords[record.get("Reference ID")] = record.getId();
        });

        fetchNextPage();
      },
      function done(err) {
        if (err) {
          return null, err;
        }
      }
    );

  return [existingRecords, null];
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

// syncVolunteerData queries for all records in Galaxy Digital's API,
// and creates or updates their records in AirTable
//    - returns successful count, error
async function syncVolunteerData() {
  const [existingRecords, airtableErr] = pullAirtableVolunteers();
  if (airtableErr) {
    return [0, airtableErr];
  }

  let count = 0;
  let totalCount = 0;

  let createBatch = [];
  let updateBatch = [];
  let [galaxyDigitalData, err] = await getGalaxyDigitalVolunteerData(
    GALAXY_DIGITAL_MAX,
    count
  );
  if (err) {
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
          err = updateAirtableRecord(updateBatch);
          if (err) {
            return [totalCount, err];
          }

          updateBatch = [];
        }
      } else {
        createBatch.push({
          fields: convertGalaxyDigitalToAirtableSchema(volunteer),
        });

        if (createBatch.length === AIRTABLE_MAX) {
          totalCount += createBatch.length;
          err = createAirtableRecord(createBatch);
          if (err) {
            return [totalCount, err];
          }
          createBatch = [];
        }
      }
    });

    count += GALAXY_DIGITAL_MAX;
    [galaxyDigitalData, err] = await getGalaxyDigitalVolunteerData(
      GALAXY_DIGITAL_MAX,
      count
    );
    if (err) {
      return [totalCount, err];
    }
  }

  if (createBatch.length > 0) {
    totalCount += createBatch.length;
    err = createAirtableRecord(createBatch);
    if (err) {
      return [totalCount, err];
    }
  }
  if (updateBatch.length > 0) {
    totalCount += updateBatch.length;
    err = updateAirtableRecord(updateBatch);
    if (err) {
      return [totalCount, err];
    }
  }

  console.log(`Total records: ${totalCount}`);
  return totalCount, null;
}

syncVolunteerData();
