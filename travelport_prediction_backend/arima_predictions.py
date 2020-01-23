import statsmodels.api as sm
#from sklearn.metrics import mean_squared_error
#from math import sqrt

from util import *


def arima_bookings_prediction(travel_agency, prediction_period):
    # bookings_df = pd.read_csv(data_csv, names = ['Date', 'Nr_Of_Bookings'])
    # bookings_df = filterFile(data_csv, 'Agency', travel_agency, 'Date', 'Nr_Of_Bookings')

    bookings_df = getAgencyBookingData('Agency', travel_agency, 'Date',
                                       'Nr_Of_Bookings')
    bookings_df = changeDates(bookings_df, 'Date', 'Nr_Of_Bookings')

    bookings_df['Date'] = pd.to_datetime(bookings_df['Date'])
    date_indexed_bookings_df = bookings_df.set_index('Date')
    ts = date_indexed_bookings_df['Nr_Of_Bookings']
    ts = ts[1:-1]  # first and last week may not be complete


    train = ts[:-prediction_period]
    test = ts[-prediction_period:]

    mod = sm.tsa.statespace.SARIMAX(train, trend='n', order=(0, 1, 2),
                                    seasonal_order=(0, 1, 0, 52))
    results = mod.fit(disp=0)
    predictions = results.forecast(prediction_period)
    predictions.index = predictions.index.strftime('%Y-%m-%d')
    predictions = predictions.reset_index()
    predictions.columns = ['week', 'bookings']

    #print(np.sqrt(mean_squared_error(test, predictions)))

    json_list = []
    for index, row in predictions.iterrows():
        json_obj = {
            'bookings': row['bookings'],
            'week': row['week']
        }
        json_list += [json_obj]

    return json_list

def arima_bookings_model(travel_agency):
    # bookings_df = pd.read_csv(data_csv, names = ['Date', 'Nr_Of_Bookings'])
    # bookings_df = filterFile(data_csv, 'Agency', travel_agency, 'Date', 'Nr_Of_Bookings')

    bookings_df = getAgencyBookingData('Agency', travel_agency, 'Date',
                                       'Nr_Of_Bookings')
    bookings_df = changeDates(bookings_df, 'Date', 'Nr_Of_Bookings')

    bookings_df['Date'] = pd.to_datetime(bookings_df['Date'])
    date_indexed_bookings_df = bookings_df.set_index('Date')
    ts = date_indexed_bookings_df['Nr_Of_Bookings']
    ts = ts[0:-1]  # first and last week may not be complete


    mod = sm.tsa.statespace.SARIMAX(ts, trend='n', order=(0, 1, 2),
                                    seasonal_order=(0, 1, 0, 52))
    results = mod.fit(disp=0)
    predictions = results.predict(1, len(ts) + 52)
    predictions.index = predictions.index.strftime('%Y-%m-%d')
    predictions = predictions.reset_index()
    predictions.columns = ['week', 'bookings']

    #print(np.sqrt(mean_squared_error(test, predictions)))

    json_list = []
    for index, row in predictions.iterrows():
        json_obj = {
            'bookings': row['bookings'],
            'week': row['week']
        }
        json_list += [json_obj]

    return json_list


def arima_destination_prediction(destination, prediction_period):
    bookings_df = getDestinationBookingData('Destination', destination, 'Date',
                                       'Nr_Of_Bookings')
    bookings_df = changeDates(bookings_df, 'Date', 'Nr_Of_Bookings')

    bookings_df['Date'] = pd.to_datetime(bookings_df['Date'])
    date_indexed_bookings_df = bookings_df.set_index('Date')
    ts = date_indexed_bookings_df['Nr_Of_Bookings']
    ts = ts[1:-1]  # first and last week may not be complete


    train = ts[:-prediction_period]
    test = ts[-prediction_period:]

    mod = sm.tsa.statespace.SARIMAX(train, trend='n', order=(0, 1, 2),
                                    seasonal_order=(0, 1, 0, 52))
    results = mod.fit(disp=0)
    predictions = results.forecast(prediction_period)
    predictions.index = predictions.index.strftime('%Y-%m-%d')
    predictions = predictions.reset_index()
    predictions.columns = ['week', 'bookings']

    json_list = []
    for index, row in predictions.iterrows():
        json_obj = {
            'bookings': row['bookings'],
            'week': row['week']
        }
        json_list += [json_obj]

    return json_list

def arima_destination_model(destination):
    # bookings_df = pd.read_csv(data_csv, names = ['Date', 'Nr_Of_Bookings'])
    # bookings_df = filterFile(data_csv, 'Agency', travel_agency, 'Date', 'Nr_Of_Bookings')

    bookings_df = getDestinationBookingData('Destination', destination, 'Date',
                                       'Nr_Of_Bookings')
    bookings_df = changeDates(bookings_df, 'Date', 'Nr_Of_Bookings')

    bookings_df['Date'] = pd.to_datetime(bookings_df['Date'])
    date_indexed_bookings_df = bookings_df.set_index('Date')
    ts = date_indexed_bookings_df['Nr_Of_Bookings']
    ts = ts[0:-1]  # first and last week may not be complete


    mod = sm.tsa.statespace.SARIMAX(ts, trend='n', order=(0, 1, 2),
                                    seasonal_order=(0, 1, 0, 52))
    results = mod.fit(disp=0)
    predictions = results.predict(1, len(ts) + 52)
    predictions.index = predictions.index.strftime('%Y-%m-%d')
    predictions = predictions.reset_index()
    predictions.columns = ['week', 'bookings']

    json_list = []
    for index, row in predictions.iterrows():
        json_obj = {
            'bookings': row['bookings'],
            'week': row['week']
        }
        json_list += [json_obj]

    return json_list
