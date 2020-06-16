module.exports = {
  singleSource: false, // If you have *just one* airtable, use this mode
  domains: {
    "testing": process.env.AIRTABLE_BASE_ID_TESTING
  }
}

