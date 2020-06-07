import pandas as pd
import airtable as a
import os

#Changing drive to where control file/parameters file is held
os.chdir(r'C:\\')


#In file I have my base id, API identifier, and API identifier for google maps API


parameters = pd.read_excel('Parameters.xlsx')

base = str(parameters['Base'].loc[0])

api = str(parameters['API'].loc[0])



def air(table):


    #Connecting to Airtable API with base key, api key, and table name specified when function called

    airtable = a.Airtable(base_key=base,api_key=api, table_name=table)


    #Could pull all records in this table

    records = airtable.get_all()


    #Otherwise, specific view

    # records = airtable.get_all(view = 'All submissions')


    #Make table from dictionary/records - Doing this to export tables

    df = pd.DataFrame.from_records((r['fields'] for r in records))


    #Create list of fields to drop for clean up


    dropping_list = []


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
