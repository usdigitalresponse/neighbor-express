# Neighbor Express
[![Deploy with Vercel Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/usdigitalresponse/neighbor-express)

The Neighbor Express platform has two parts:

* **A public-facing website** (code in this repo) to share information about the program, and collect signups from volunteers and people who need assistance
* **A back office data management platform** implemented in Airtable which collects form responses and helps you manage volunteers and requests for help

For more background on the product:

* [Product Overview doc](https://docs.google.com/document/d/14coib0p7LP3Twk1alY17d7uwVq1cxAEtijeUonnJnqY/edit#) including screenshots, best practices, FAQ
* [5 minute video tour](https://www.loom.com/share/dabb2f47de454b8c86992db4fabae228)

## Deploy a fork for your city

If you'd like to bring Neighbor Express to your city, you can deploy a fork of our system in a few minutes, using the instructions below.

This site is a static site with a small dynamic component to load CMS data, so you can deploy it on any static hosting provider that allows for maintaining a secret API key. We recommend hosting on [Vercel (formerly Zeit)](https://zeit.co/). The rest of these instructions assume a Vercel deployment.

**Important note before starting**: Neighbor Express is not fully automated, nor is it our goal to make it 100% automated. Even after you set up a working website, you will still need people
to manually monitor the form submissions coming into the Airtable, match volunteers
with requests, and help facilitate communication between volunteers and requests,
and generally make sure your program is a success.
This can be a lot of work depending on the number of requests that come in.
Before setting up a site, you should read our [Product Overview doc](https://docs.google.com/document/d/14coib0p7LP3Twk1alY17d7uwVq1cxAEtijeUonnJnqY/edit#) which includes
best practices for managing a Neighbor Express program.
We're happy to help you plan a successful program; reach out at the [Neighbor Express website](https://neighborexpress.org/bring-to-my-city).

#### Prerequisites

Create accounts on [Airtable](https://airtable.com), [Vercel](https://zeit.co/), and [Github](https://github.com).

#### Create an Airtable backend

Open the [Neighbor Express Airtable Template](https://airtable.com/shrUWmppqhdNK9Ij9), and click “Copy Base” in the top right.

This Airtable will serve as your CMS for the site content, and also store your form submissions.

#### Deploy a Vercel fork

Click the button below to start a Zeit import. It will fork the Neighbor Express Github repo for you and deploy the fork to Vercel.

[![Deploy with Vercel Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/usdigitalresponse/neighbor-express)

* First, find the [Airtable API Key](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-) and [Base ID](https://community.airtable.com/t/what-is-the-app-id-where-do-i-find-it/2984) for your Airtable copy, and pass them into the first Vercel import screen.
* Grant Github permissions if needed, to allow Vercel to fork the repo on your behalf.
* Next it’s time to configure the project. This is pretty simple because it’s already a static site with no compilation needed.
  * Leave the “root directory” field blank.
  * When Vercel auto-detects Next.js, don't change any of the settings for build command / output directory / development command, just leave them blank.
  * Press Deploy

Now you have your own deployment of the Neighbor Express website. You can click the production deployment link in Vercel to see the live site.

You're almost there! The next step is to use the Airtable CMS to customize the website for your city.

#### Change site content

First, there's one field you need to change first in the CMS. The `request_form`
and `volunteer_form` rows specify which form will be displayed on the site.
By default, those IDs point to the form on the template Airtable,
but you need to update them to point to the forms on your cloned Airtable:

* select the Deliveries tab
* choose the Delivery Request Form view
* click "Share form"
* Copy the ID that comes after "https://airtable.com/". It should look something like this: `shrC4sgbVlo1LvH65`
* Paste it into the CMS, on the `request_form` row, in the `body` column
* Repeat those steps for the Volunteer Signup form

You can also edit all the other content on the site. Here are some [visual instructions](https://whimsical.com/LE8KPDkxRb1gB9GzuX8Qz2#7YNFXnKbYjZZjCn41Cg3J) for doing that.

You can edit most text, pictures, and button names on the website pages. Forms are fully editable as well: add, remove, or edit any question. Changes made in Airtable update immediately.

If you’d like to make further changes beyond what’s available in the Airtable CMS you can also just directly edit the site code in your fork of this repo, if you’re comfortable with HTML/CSS.

#### Custom domain

You can use [Vercel's intructions](https://zeit.co/docs/v2/custom-domains) to add a custom domain for your site.

## Managing form submissions in Airtable

The forms in the site are built with Airtable Forms, and data submits directly to the Deliveries and Volunteers tabs.

If you don’t have any data collected yet, you can delete all the test data in the template tables to start from scratch.

If you already have your own data, you have two options:

* use the [CSV Import Block](https://support.airtable.com/hc/en-us/articles/115013249187-CSV-import-block) to import your data
* [create a new Table from your existing spreadsheet](https://support.airtable.com/hc/en-us/articles/203313915-Creating-a-new-table-in-an-existing-base-via-CSV-spreadsheet-import)

**Add more views**: Now, you can use the built-in views to manage data, or create/modify your own views as needed. See Airtable’s [Guide to Views](https://support.airtable.com/hc/en-us/articles/202624989-Guide-to-views) for more background.

**Collect new data**: The Deliveries and Volunteers tables each contain an Airtable Form you can use to collect new data into the table. The Airtable form shows up on the public website, so you can just directly edit in Airtable and the new form shows up on the site.

Watch the [5 minute video tour](https://www.loom.com/share/dabb2f47de454b8c86992db4fabae228) for more information on how to use the Airtable side of things.

### Advanced Airtable features

Setting up the advanced features (maps, SMS, vehicle routing) requires a little more technical work and may cost money. These instructions are still a work in progress, but here are some quick notes.

All of the advanced features require using Airtable Blocks, a paid feature which allows for connecting APIs to the Airtable database.

* Maps: set up the built-in Map block. You’ll need to create an account for the Google Maps API. Once you’ve set up the Map block, you can view a map of any table and color it by any single-select field. You can use this to view Volunteers or Deliveries on a map to help with matching people.
* SMS: set up the built-in SMS block. You’ll need to create an account for the Twilio API. You can then send batch mail-merge-style SMS to any View.

# Managed sites

You can fork this repository and set up your own Neighbor Express instance using the instructions above -- you don't need this section. This section is for Neighbor Express eng, about how to set up a new Neighbor Express site that *we* are managing through our own Vercel and Airtable accounts. (such as for Paterson, Walnut Creek, our landing page, etc.)

## Adding a new city

* Add a new Vercel project to this [page](https://vercel.com/dashboard/neighborexpress/projects) using the [Now CLI](https://vercel.com/docs/now-cli?query=cli#commands/overview/project-linking). The name should be a short descriptive name like "paterson" or "cms"
* In cloudflare, create a new subdomain for your new page. Copy the configuration from our other sites.
* In Vercel, add the subdomain.neighborexpress.org domain to the project you created [instructions](https://vercel.com/docs/v2/custom-domains)
* To make sure your new site is updated when we make improvements or bugfixes to the code, add it in 3 places:
    * [Deploy Script](https://github.com/usdigitalresponse/neighbor-express/blob/master/scripts/update-all.js) Add your project name to the `cities` list. This way the script auto-deploys to your city
    * [Git Hook](https://github.com/usdigitalresponse/neighbor-express/blob/master/.github/workflows/update-now.yaml) Add an environment variable with the Airtable Base ID of the base that will power your site. Imitate the examples there.
    * [Github Secrets](https://github.com/usdigitalresponse/neighbor-express/settings/secrets) Add the airtable base ID as a github secret so the git hook can access it

Now, when you merge that PR to master with the latest code, the site will update, and stay updated with all future changes.

# MIT License

Neighbor Express is released under an [MIT License](https://github.com/usdigitalresponse/neighbor-express/blob/master/LICENSE).
