The Neighbor Express platform has two parts:

* **A public-facing website** (code in this repo) to share information about the program, and collect signups from volunteers and people who need assistance
* **A back office data management platform** implemented in Airtable which collects form responses and helps you manage volunteers and requests for help

For more background on the product:

* [Product Overview doc](https://docs.google.com/document/d/14coib0p7LP3Twk1alY17d7uwVq1cxAEtijeUonnJnqY/edit#) including screenshots, best practices, FAQ
* [5 minute video tour](https://www.loom.com/share/dabb2f47de454b8c86992db4fabae228)

## Deploy a fork

We recommend deploying this site through Zeit. It’s just a static site with a small dynamic component to load CMS data and submit form data, so you could also deploy it on other providers that allow for maintaining a secret API key.

To deploy through Zeit:

Open the [Neighbor Express Airtable Template](https://airtable.com/shrUWmppqhdNK9Ij9), and click “Copy Base” in the top right. This will prompt you to create an Airtable account if you don’t already have one.

Click the button below to start a Zeit import. It will fork the Neighbor Express Github repo for you and deploy the fork to Zeit.

[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/usdigitalresponse/neighbor-express)

* First, find the Airtable API Key and Base ID for your Airtable copy, and pass them into the first Zeit import screen.
* Grant Github permissions if needed, to allow Zeit to fork the repo on your behalf.
* Next it’s time to configure the project. This is pretty simple because it’s already a static site with no compilation needed.
  * Leave the “root directory” field blank.
  * Leave the build command and development command fields blank. Set the output directory to public.
* That’s it! Now you have your own deployment of the Neighbor Express website. You can click the production deployment link in Zeit to see the live site.

To edit content on the Public Facing Website through the CMS, [follow these visual instructions](https://whimsical.com/LE8KPDkxRb1gB9GzuX8Qz2#7YNFXnKbYjZZjCn41Cg3J) to edit the website content in Airtable.

You can edit most text, pictures, and button names on the website pages. Forms are fully editable as well: add, remove, or edit any question. Changes made in Airtable update immediately.

If you’d like to make further changes beyond what’s available in the Airtable CMS you can also just directly edit the site code in your fork of this repo, if you’re comfortable with HTML/CSS.

## Managing form submissions in Airtable

The Deliveries and Volunteers tabs in Airtable are there to help you manage the data that comes in from forms.

Import your data: If you don’t have any data collected yet, delete all the test data in the template Base to start from scratch.

If you already have your own data, you have two options:

* use the [CSV Import Block](https://support.airtable.com/hc/en-us/articles/115013249187-CSV-import-block) to import your data
* [create a new Table from your existing spreadsheet](https://support.airtable.com/hc/en-us/articles/203313915-Creating-a-new-table-in-an-existing-base-via-CSV-spreadsheet-import)

Add more views: Now, you can use the built-in views to manage data, or create/modify your own views as needed. See Airtable’s [Guide to Views](https://support.airtable.com/hc/en-us/articles/202624989-Guide-to-views) for more background.

Collect new data: The Deliveries and Volunteers tables each contain an Airtable Form you can use to collect new data into the table. The Airtable form shows up on the public website, so you can just directly edit in Airtable and the new form shows up on the site.

Watch the [5 minute video tour](https://www.loom.com/share/dabb2f47de454b8c86992db4fabae228) for more information on how to use the Airtable side of things.

## Developing Locally
1. Clone this repo
2. Install the Zeit Now CLI globally `npm i -g now`
3. `now dev` will start the development server, pointing to the API correctly
4. Make any changes you'd like to public/index.html and open a pull request
5. Merging into master will automatically deploy to https://neighbor.now.sh
