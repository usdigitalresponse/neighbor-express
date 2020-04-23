#!/bin/bash

# Remove the now folder, this allows us to tell it to use a different city
rm -rf .now
now --env AIRTABLE_BASE_ID=app31VI2AVaaByh4o --name keithtesting --confirm --scope neighborexpress --prod