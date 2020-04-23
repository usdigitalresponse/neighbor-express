const exec = require('@actions/exec');


// We are going to throw away our .now folder, and just do some direct deploys
exec.exec('rm -rf .now');
// Lets start with paterson
exec.exec('now --env AIRTABLE_BASE_ID=appZcB8F2bEaLboM0 --name keithtesting --confirm --scope neighborexpress --prod');