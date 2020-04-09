const Airtable = require("airtable");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);
const tableName = "Names";
const viewName = "";

export default (req, res) => {
  console.log("HI??", req.body);
  const created = base(tableName).create(
    [
      {
        fields: {
          firstName: req.body.firstName,
          lastName: req.body.lastName
        }
      }
    ],
    function (err, records) {
      if (err) {
        console.error('error', err);
        return;
      }
      console.log('submitted', records);
      records.forEach(function (record) {
        console.log(record.getId());
      });
    }
  );
  console.log(created);

  res.send("success", created);
};