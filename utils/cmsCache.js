const fs = require('fs');

function populateCmsCacheFromJson(data) {
  const fileOutput = `module.exports = ${JSON.stringify(data, null, 4)}`;

  fs.writeFile("./cms-cache.js", fileOutput, (err) => {
    if (err) {
      console.error(err);
      return;
    };
    console.log("Cache file populated");
  });
}

module.exports = populateCmsCacheFromJson;