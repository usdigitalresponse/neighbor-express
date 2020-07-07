// Script used to convert Volunteer data from the 
// (Galaxy Digital)[http://api2.galaxydigital.com/volunteer/docs/] APIs
// into the AirTable schemas
import { globalConfig } from '@airtable/blocks';
import { Airtable } from '@airtable';

async function getGalaxyDigitalData(lastRun) {
  const api_key = globalConfig.get("GALAXY_DIGITAL_API_KEY");

  // TODO are there any custom fields they want pulled?
  const url = new URL("volunteer/user/list/", "https://api2.galaxydigital.com")
  const params = url.searchParams;
  params.set('key', api_key);

// TODO Dynamically pull last run date?
//   if (lastRun) { 
//       params.set('sinceDate', lastRun);
//   }

  const response = await fetch(url, {method: 'GET'});

  return response;
}

/*
 * Example message
 * {     
 *    "id":"613924"
      "status":"active"
      "referenceId":""
      "firstName":"Mario"
      "lastName":"Kibler"
      "middleName":""
      "email":"Mario.B.Kibler@example.com"
      "mobile":"1-415-555-7124"
      "phone":"360-555-7196"
      "company":"ACME"
      "gender":"Male"
      "birthdate":"1983-09-27"
      "address":"2350 Chardonnay Drive"
      "address2":""
      "city":"Beaverton"
      "state":"WA"
      "postal":"97006"
      "dateAdded":"2015-03-02T11:00:51-06:00"
      "dateUpdated":"2016-05-17T14:15:36-05:00"
      "dateLastLogin":""
      }
 * 
 */
function convertGalaxyDigitalToAirtableSchema(galaxyDigitalData) {
    return {
   
    };
}

function postToAirtable(batch) {
  const api_key = globalConfig.get("AIRTABLE_API");
  const airtable_base = globalConfig.get("AIRTABLE_BASE"); 
  var base = new Airtable({apiKey: api_key}).base(airtable_base);
  
  base('Table 1').create(batch, function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });
}

function syncVolunteerData() {
    const galaxyDigitalData = getGalaxyDigitalData();

    // TODO Error handling
    let batch = [];
    galaxyDigitalData?.data?.forEach(volunteer => {
        // TODO get schema
        batch.push({"fields": convertGalaxyDigitalToAirtableSchema(volunteer)});

        if (batch.length === 10) {
            postToAirtable(batch)
            batch = [];
        }
    });
} 