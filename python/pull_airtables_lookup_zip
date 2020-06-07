import pandas as pd
import airtable as a
import os
import geocoder
import googlemaps
from datetime import datetime
import time


#Changing drive to where control file/parameters file is held
os.chdir(r'C:\\')

parameters = pd.read_excel('Parameters.xlsx')


#In file I have my base id, API identifier, and API identifier for google maps API

base = str(parameters['Base'].loc[0])

api = str(parameters['API'].loc[0])

google = str(parameters['GoogleGeocode'].loc[0])



#Starting a timer to see how long program takes
From = time.time()




def air(table):


    #Connecting to Airtable API with base key, api key, and table name specified when function called
    airtable = a.Airtable(base_key=base,api_key=api, table_name=table)



    print('Pulling Airtable Data')


    #Could pull all records in this table
    # records = airtable.get_all()


    #Otherwise, specific view
    records = airtable.get_all(view = 'Address CleanUp')



    #Make table from dictionary/records - Doing this to export tables
    df = pd.DataFrame.from_records((r['fields'] for r in records))


    #Create list of fields to drop for clean up

    dropping_list = []


    print('Cleaning Up DataFrame')


    #Removing some columns I don't need
    for columns in df.columns:
        columns2 = str(columns)
        if columns2.find('don\'t use') > -1 or columns2.find('do not touch') > -1 or columns2.find('old') > -1 or columns2.find('older') > -1:
            dropping_list.append(columns2)




    #Cleaning up columns. Dropping columns from list and name clean up to sort later

    df.drop(dropping_list,inplace=True,axis=1)

    df.columns = df.columns.str.replace('"', '')
    df.columns = df.columns.str.replace('(', '')
    df.columns = df.columns.str.replace(')', '')
    df.columns = df.columns.str.replace('#', 'Number ')



    #Preparing address information to lookup against google maps api

    #Getting rid of NaN or Na since it was causing issues with
    df['Delivery Address'] = df['Delivery Address'].fillna('')

    df['Delivery City'] = df['Delivery City'].fillna('')


    df['Delivery State'] = df['Delivery State'].fillna('')

    df['Delivery Zip Code'] = df['Delivery Zip Code'].fillna('')



    #Combining address info to see what we have
    df['given_address'] = df['Delivery Address'] + ' ' + df['Delivery City'] + ' ' + df['Delivery State'] + ' ' + df['Delivery Zip Code']

    df['given_address'] = df['given_address'].astype(str)

    df['given_address'] = df['given_address'].str.strip()


    #Creating new columns for the address information I pulled from gmaps


    df['Found Full Address'] = ''

    df['Found Street Address'] = ''

    df['Found City'] = ''


    df['Found State'] = ''

    df['Found Zip'] = ''

    df['Found County'] = ''


    #Initiating connection to google maps api. key=google is my client id/personal id for connecting to api

    gmaps = googlemaps.Client(key=google)



    row = 0

    print('Searching Google Map API')


    #looking up address with the information I have to find in order to standardize address information
    for values in df['given_address']:
        values = str(values)
        values = values.strip()
        try:
            #google maps lookup
            geocode_result = gmaps.geocode(values)
        except:
            pass

        try:
            #Formatted address is the address in a consistent format and then I split it to pull out pieces of info
            formatted_address = geocode_result[0]["formatted_address"]

            county_address = geocode_result[0]['address_components'][3]['long_name']

            formatted_address2 = str(formatted_address).split(',')

            street_address = str(formatted_address2[0]).strip()
            city_address = str(formatted_address2[1]).strip()

            state_address2 = (formatted_address2[2]).split(' ')
            state_address = str(state_address2[1])
            zip_address = str(state_address2[2])

        except:
            pass



        try:

            #Update the column at that specific cell with the address information

            df.at[row,'Found Full Address'] = formatted_address
            df.at[row,'Found Street Address'] = street_address
            df.at[row,'Found City'] = city_address
            df.at[row,'Found State'] = state_address
            df.at[row,'Found Zip'] = zip_address
            df.at[row,'Found County'] = county_address

        except:
            pass

        row +=1


    #Sort column names alphabetically
    df = df.reindex(sorted(df.columns), axis=1)


    #Sort by Agency Name
    try:

        df = df.sort_values(by='AgencyName')

    except:
        pass



    return df


#Calling function here in loop in case I want to pull multiple tables at once.
for tables in parameters['Tables']:
    x = air(tables)
    export = x.to_csv(str(tables) + '.csv',index=False)


To = time.time()

laptime = round(To - From,2)
minutes = round(laptime/60,1)
strminutes = str(minutes)


print('Finished')
print('I rock...that only took me ' + strminutes + ' minutes!')
