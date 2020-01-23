from azure.storage.blob import BlockBlobService
from flask import jsonify
import requests, csv
import pandas as pd
import sys
import datetime as dt
# tempporary solution to avoid pushing important azure login info
# loginDetail.py should be a file specifying STORE_ACCOUNT, STORE_ACCOUNT_KEY,
# CLUSTER_USER and CLUSTER_PASS and should never be pushed
from loginDetail import *

block_blob_service = BlockBlobService(account_name=STORE_ACCOUNT,
                                      account_key=STORE_ACCOUNT_KEY)


# -- FILE RETREIVAL
def countfile(filename):
    """
    Counts the number of files in the container with the prefix filename.
    """
    generator = block_blob_service.list_blobs('travelimperial', filename)
    count = 0
    for blob in generator:
        count += 1
        print(blob.name)
    return count


def getfile(filename, output):
    """
    Attempts to load a file from the storage container with the appropriate
    name.
    Returns the number of files found with this prefix.
    """
    count = countfile(filename)
    if (count == 1):
        # only attempts to get file if one file is found
        # could still fail as we technically count prefix, not exact matches
        block_blob_service.get_blob_to_path('travelimperial',
                                            filename, output)
    elif (count > 1):
        print('Cannot decide between ' + str(count) + ' different files for ' +
              filename)
    else:
        print(filename + ' not found')
    return count


def changeDates(df, day_col_name, count_col_name):
    """
    Changes the dates for each entry to be the first date of the week and then
    calls change count
    """

    # sort df by date
    df.sort_values(by=[day_col_name], inplace=True)

    # iterate through df
    for i, row in df.iterrows():
        # get date of current row
        date = dt.datetime.strptime(row[day_col_name], "%Y-%m-%d")
        pd_date = pd.to_datetime(date)
        # get day of week (0-6)
        day_of_week = pd_date.dayofweek

        # subtract day of week to get to the first day in that week
        new_day = date - dt.timedelta(days=day_of_week)

        # row[day_col_name] = pd.to_datetime(new_day)

        # update entry in df accordingly
        df.loc[df[day_col_name] == row[day_col_name], day_col_name] = new_day.strftime("%Y-%m-%d")

    # get a list of zero count dates to be inserted
    df.sort_values(by=[day_col_name], inplace=True)
    data_frames = changeCounts(df, day_col_name, count_col_name)

    # print(df)
    if (len(data_frames) > 0):
        # concatenate with zero dates
        data = pd.concat([data_frames, df])

        # reindex
        data.reset_index(drop=True, inplace=True)

        # resort
        data.sort_values(by=[day_col_name], inplace=True)
        return data
    else:
        return df


def changeCounts(df, day_col_name, count_col_name):
    """
    Returns a dataframe containing weeks with 0 entries which should be added
    to the data
    Assumes df is sorted
    """
    # set curr_day to first entry in df
    curr_day = dt.datetime.strptime(df[day_col_name].iloc[0], "%Y-%m-%d")

    # initialise empty list
    data_frames = []

    # iterate over df
    for i, row in df.iterrows():
        # set date to be datetime field for current entry in df
        date = dt.datetime.strptime(row[day_col_name], "%Y-%m-%d")

        # if the date is <= to curr_day, update curr_day and continues as this
        # date will already be represented in the dataset
        if date <= (curr_day + dt.timedelta(days=7)):
            curr_day = date
        else:
            # otherwise add curr_date with count zero to the set of points to
            # be added, and add on a week to curr_date, continue until we catch
            # up to the value of date
            print(str(date) + ' comp ' + str(curr_day + dt.timedelta(days=7)))
            while date > (curr_day + dt.timedelta(days=7)):
                date_str = (curr_day + dt.timedelta(days=7)).strftime("%Y-%m-%d")
                data_frames.append(pd.DataFrame([[date_str, 0]],
                                                columns=[day_col_name,
                                                         count_col_name]))
                curr_day = curr_day + dt.timedelta(days=7)
            curr_day = date

    if (len(data_frames) > 0):
        data = pd.concat(data_frames)
        return data
    else:
        return data_frames


def filterFile(source_file, filter_on, filter_value, label1, label2):
    """
    Reads the provided csv file and filters the rows based on the value
    provided by filter_value.
    Since this helper function is mainly used by ARIMA and Prophet predictions,
    the labels are the column headings required by respective APIs.
    Returns the dataframe containing the bookings made by the given filter_on attribute.
    """
    header = [filter_on, label1, label2]
    df = pd.read_csv(source_file, names=header)
    agent_bookings = df.query(filter_on + ' == "' + filter_value + '"')
    return agent_bookings[[label1, label2]]


def getAgencyBookingData(filter_on, travel_agency, label1, label2):
    """
    Combines all the files related to travel_agency to produce a single
    dataframe.
    Returns a dataframe containing bookings made by travel_agency
    """
    df_list = []
    for i in range(0, countfile('data/pig_data/ARIMADataIATA/part')):
        result_file = 'data/pig_data/ARIMADataIATA/part-v001-o000-r-0000' + str(i)
        output_file = 'agent_data' + str(i) + '.csv'
        getfile(result_file, output_file)
        dataframe = filterFile(output_file, filter_on, travel_agency, label1, label2)
        df_list.append(dataframe)
    return pd.concat(df_list)


def getDestinationBookingData(filter_on, destination, label1, label2):
    """
    Combines all the files related to destination to produce a single dataframe.
    Returns a dataframe containing bookings made to a given destination
    """
    df_list = []
    for i in range(0, countfile('data/pig_data/destinationData/part')):
        result_file = 'data/pig_data/destinationData/part-v001-o000-r-0000' + str(i)
        output_file = 'destination_data' + str(i) + '.csv'
        getfile(result_file, output_file)
        dataframe = filterFile(output_file, filter_on, destination, label1, label2)
        df_list.append(dataframe)
    return pd.concat(df_list)


def csv_to_dict(filename, key_arr):
    """
    Reads a csv and returns it's contents as a json style dictionary.
    Can be used to read files loaded from the storage space.
    Assumes comma delimiter and single quote quotechar
    Takes a filename (should be csv) and array of key values for the returned
    dictionary.
    """

    # TODO replace with csv.DictReader

    return_data = {}
    with open(filename, 'r') as data_csv:
        reader = csv.reader(data_csv, delimiter=',', quotechar='\'')

        element_array = []
        for row in reader:
            # if the array of keys isn't the same length as the number of
            # attributes, then fail
            if (len(row) != len(key_arr)):
                print('key_arr is not correct length for csv file ' + filename)
                return jsonify(return_data)

            # build one element per row
            element = {}
            for i in range(0, len(row)):
                # for each element we have a key value pair for each attribute
                element[key_arr[i]] = row[i]

            # add element to the list
            element_array.append(element)

        # add the array of elements to the return data
        return_data['values'] = element_array

    return return_data


# -- REQUESTS
def can_connect_to_cluster():
    """
    Checks that connection to cluster can be established.
    """
    url = 'https://travelimperial.azurehdinsight.net/templeton/v1/status'
    resp = requests.get(url, auth=(CLUSTER_USER, CLUSTER_PASS))
    print(resp.status_code)
    return (resp.status_code == 200)


def run_pig(filename):
    """
    Runs pig file on cluster using WebHCat (previously templeton) REST api.
    """
    url = 'https://travelimperial.azurehdinsight.net/templeton/v1/pig?user.name=sshuser'
    payload = {'file': filename, 'user': {'name': 'admin'}}
    resp = requests.post(url, auth=(CLUSTER_USER, CLUSTER_PASS),
                         data=payload)
    print(resp.text)
