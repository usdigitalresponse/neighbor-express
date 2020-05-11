This subfolder of neighbor express is a Custom Block project, for creating a custom block to appear in airtable. It's like a scripting block... but better!

# Developer setup

In order to develop on this block locally, you'll need to be a part of the Airtable custom blocks beta. Fill out this form: https://airtable.com/shrEvq5IlQqYxWkaS They sent me an email approving my request with about 1 day turnaround time.

Here are the docs! https://airtable.com/developers/blocks/guides/getting-started Since you're not starting from scratch with this project, you don't need to do block init. Here are the steps you do need to do:

`npm install -g @airtable/blocks-cli` 
this installs the blocks cli

`cd send_email_messages`
`block run`
this runs the block at localhost:9000

On any airtable base that already has the block installed, click the arrow by the block name and then "Edit Block". Paste in https://localhost:9000 in the box. Congrats this block is now running your local code.

# Releasing

For now, we run 
`block release`
and 
`block release --remote cityname` 
manually whenever we want to update a city. Coming soon, these will be run automatically on merge to master.

Block release basically takes your current code, packages it up, and sends it to airtable's servers. Now everyone interacting with the block (not just your local machine) sees the new code.

# Setting up a new city
Airtable has instructions for this: https://airtable.com/developers/blocks/guides/run-in-multiple-bases

Creating a new remote generates a json file in the /.block folder -- check that in.

After releasing the block to the new city remember to go fill in their settings
