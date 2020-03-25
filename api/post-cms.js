const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);
const tableName = "Names";
const viewName = "";

export default (req, res) => {
  base(tableName).create(
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

  res.send("success");
};