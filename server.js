// server.js
// where your node app starts

// We're going to use the "Product Catalog and Orders" base template:
// https://airtable.com/templates/featured/expZvMLT9L6c4yeBX/product-catalog-and-orders
const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);
const tableName = "Pages";
const viewName = "";

const express = require("express");
const app = express();
app.use(express.urlencoded())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// Cache the records in case we get a lot of traffic.
// Otherwise, we'll hit Airtable's rate limit.
const cacheTimeoutMs = 5 * 1000; // Cache for 5 seconds.
let cachedResponse = null;
let cachedResponseDate = null;

app.get("/data", function (_, response) {
  if (cachedResponse && new Date() - cachedResponseDate < cacheTimeoutMs) {
    response.send(cachedResponse);
  } else {
    // Select the first 10 records from the view.
    base(tableName)
      .select({
        maxRecords: 10,
        view: viewName
      })
      .firstPage(function (error, records) {
        if (error) {
          response.send({ error: error });
        } else {
          cachedResponse = {
            records: records.map(record => {
              return {
                key: record.get("key"),
                title: record.get("title"),
                body: record.get("body"),
                picture: record.get("picture") || []
              };
            })
          };
          cachedResponseDate = new Date();

          response.send(cachedResponse);
        }
      });
  }
});

app.post("/submit", function (req, response) {
  console.log("submitting!");

  /*
  * Submitting it to our "Names" page in our airbase table
  * This would REALLY be validated, obviously
  */
  base("Names").create(
    [
      {
        fields: {
          title: req.body.title,
          first: req.body.firstName,
          middle: req.body.middleName,
          last: req.body.lastName,
        }
      }
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    }
  );

  response.send("success");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
