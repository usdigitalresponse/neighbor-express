import fs from 'fs';

function populateCmsCacheFromJson(data) {
  fs.writeFile('../../.cache/cache.json', data, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
}

export default populateCmsCacheFromJson;