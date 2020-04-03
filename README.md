# Neighborhood Express
[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/usdigitalresponse/neighbor-express)

## Developing Locally
1. Clone this repo
2. Install the Zeit Now CLI globally `npm i -g now`. If you don’t have an existing ZEIT account it will take you through steps to create your account and link the repo. 
3. `now dev` will start the development server, pointing to the API correctly
4. If prompted, add the "AIRTABLE_API_KEY" (find at https://airtable.com/account)
5. If prompted, add the "AIRTABLE_BASE_ID" (find at https://airtable.com/api)
6. If prompted, add Secrets to local .env.example and then rename file to .env
7. Run npm install
8. Make any changes you'd like to public/index.html and open a pull request
9. Merging into master will automatically deploy to https://neighbor.now.sh
