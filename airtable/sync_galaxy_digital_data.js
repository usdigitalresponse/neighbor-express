// Script used to convert Volunteer data from the 
// (Galaxy Digital)[http://api2.galaxydigital.com/volunteer/docs/] APIs
// into the AirTable schemas
import { globalConfig } from '../sync_data/frontend/node_modules/@airtable/blocks';
import { Airtable } from '@airtable';

const AIRTABLE_API_KEY = globalConfig.get("AIRTABLE_API");
const AIRTABLE_BASE_ID = globalConfig.get("AIRTABLE_BASE");
const GALAXY_DIGITAL_API_KEY= globalConfig.get("GALAXY_DIGITAL_API_KEY");

const DESTINATION_TABLE = 'Volunteer Engagement';
const AIRTABLE_MAX = 10;
const GALAXY_DIGITAL_MAX = 50;

const base = new Airtable({apiKey: AIRTABLE_API_KEY}).base(AIRTABLE_BASE_ID);

async function getGalaxyDigitalVolunteerData(limit, offset) {
  const url = new URL("volunteer/user/list/", "https://api2.galaxydigital.com")
  const params = url.searchParams;
  params.set('key', GALAXY_DIGITAL_API_KEY);
  params.set('limit', limit);
  params.set('offset', offset);

  // TODO report errors
  const response = await fetch(url, {method: 'GET'}).then(resp => resp.json()).catch(console.error);
  return response;
}

function convertGalaxyDigitalToAirtableSchema(galaxyDigitalVolunteer) {
  return {
    "Name": `${galaxyDigitalVolunteer.firstName?.trim()} ${galaxyDigitalVolunteer.lastName?.trim()}`,
    "Email": galaxyDigitalVolunteer.email?.trim(),
    "Phone": galaxyDigitalVolunteer.mobile?.trim() || galaxyDigitalVolunteer.phone?.trim(),
    "Address": galaxyDigitalVolunteer.address ? `${galaxyDigitalVolunteer.address?.trim()} ${galaxyDigitalVolunteer.address2?.trim()} ${galaxyDigitalVolunteer.city?.trim()}, ${galaxyDigitalVolunteer.state?.trim()} ${galaxyDigitalVolunteer.postal?.trim()}` : null,
    "Submitted date": galaxyDigitalVolunteer.dateAdded,
    "Reference ID": galaxyDigitalVolunteer.id,
  };
}

// pullAirtableVolunteers pulls all data from the destination table 
// to determine if a record needs to be created or updated
function pullAirtableVolunteers() {
  const existingRecords = {};

  base(DESTINATION_TABLE).select({
    view: "Main View"
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function (record) {
      existingRecords[record.get('Reference ID')] = record.getId();
    });

    fetchNextPage();

  }, function done(err) {
    if (err) { console.error(err); return; }
  });

  return existingRecords;
}

function createAirtableRecord(batch) {
  base(DESTINATION_TABLE).create(batch, function (err, records) {
    if (err) {
      console.error(err);
      return;
    }
  });
}

function updateAirtableRecord(batch) {
  base(DESTINATION_TABLE).update(batch, function (err, records) {
    if (err) {
      console.error(err);
      return;
    }
  });
}

// syncVolunteerData queries for all records in Galaxy Digital's API,
// and creates or updates their records in AirTable
export async function syncVolunteerData() {
  const existingRecords = pullAirtableVolunteers();
  let count = 0;
  let totalCount = 0;

  let createBatch = [];
  let updateBatch = [];
  let galaxyDigitalData = await getGalaxyDigitalVolunteerData(GALAXY_DIGITAL_MAX, count);
  while (count <= galaxyDigitalData.rows) {
    // TODO Error handling
    galaxyDigitalData?.data?.forEach(volunteer => {
      if (existingRecords[volunteer.id]) {
        updateBatch.push({"id": existingRecords[volunteer.id], "fields": convertGalaxyDigitalToAirtableSchema(volunteer)});

        if (updateBatch.length === AIRTABLE_MAX) {
          totalCount += updateBatch.length;
          updateAirtableRecord(updateBatch);
          updateBatch = [];
        }
      } else {
        createBatch.push({"fields": convertGalaxyDigitalToAirtableSchema(volunteer)});

        if (createBatch.length === AIRTABLE_MAX) {
          totalCount += createBatch.length;
          createAirtableRecord(createBatch);
          createBatch = [];
        }
      }
    });

    count += GALAXY_DIGITAL_MAX;
    galaxyDigitalData = await getGalaxyDigitalVolunteerData(GALAXY_DIGITAL_MAX, count);
  }

  if (createBatch.length > 0) {
    totalCount += createBatch.length;
    createAirtableRecord(createBatch);
  }
  if (updateBatch.length > 0) {
    totalCount += updateBatch.length;
    updateAirtableRecord(updateBatch);
  }

  console.log(`Total records: ${totalCount}`);
}
