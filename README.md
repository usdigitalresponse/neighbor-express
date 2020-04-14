# Neighbor Express
[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/usdigitalresponse/neighbor-express)

The Neighbor Express platform has two parts:

* **A public-facing website** (code in this repo) to share information about the program, and collect signups from volunteers and people who need assistance
* **A back office data management platform** implemented in Airtable which collects form responses and helps you manage volunteers and requests for help

For more background on the product:

* [Product Overview doc](https://docs.google.com/document/d/14coib0p7LP3Twk1alY17d7uwVq1cxAEtijeUonnJnqY/edit#) including screenshots, best practices, FAQ
* [5 minute video tour](https://www.loom.com/share/dabb2f47de454b8c86992db4fabae228)

## Deploy a fork

In just a few minutes you can deploy a Neighbor Express site for your city.

This site is a static site with a small dynamic component to load CMS data, so you can deploy it on any static hosting provider that allows for maintaining a secret API key. We recommend hosting on [Zeit](https://zeit.co/). The rest of these instructions assume a Zeit deployment.

#### Prerequisites

Create accounts on [Airtable](https://airtable.com), [Zeit](https://zeit.co/), and [Github](https://github.com).

#### Create an Airtable backend

Open the [Neighbor Express Airtable Template](https://airtable.com/shrUWmppqhdNK9Ij9), and click “Copy Base” in the top right.

This Airtable will serve as your CMS for the site content, and store your form submissions.

#### Deploy a Zeit fork

Click the button below to start a Zeit import. It will fork the Neighbor Express Github repo for you and deploy the fork to Zeit.

[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/usdigitalresponse/neighbor-express)

* First, find the [Airtable API Key](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-) and [Base ID](https://community.airtable.com/t/what-is-the-app-id-where-do-i-find-it/2984) for your Airtable copy, and pass them into the first Zeit import screen.
* Grant Github permissions if needed, to allow Zeit to fork the repo on your behalf.
* Next it’s time to configure the project. This is pretty simple because it’s already a static site with no compilation needed.
  * Leave the “root directory” field blank.
  * Leave the build command and development command fields blank. Set the output directory to public.
* That’s it! Now you have your own deployment of the Neighbor Express website. You can click the production deployment link in Zeit to see the live site.

#### Change site content

To edit content on the Public Facing Website through the CMS, [follow these visual instructions](https://whimsical.com/LE8KPDkxRb1gB9GzuX8Qz2#7YNFXnKbYjZZjCn41Cg3J) to edit the website content in Airtable.

You can edit most text, pictures, and button names on the website pages. Forms are fully editable as well: add, remove, or edit any question. Changes made in Airtable update immediately.

If you’d like to make further changes beyond what’s available in the Airtable CMS you can also just directly edit the site code in your fork of this repo, if you’re comfortable with HTML/CSS. (see instructions below for developing locally)

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
