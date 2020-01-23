from __future__ import print_function
import matplotlib

matplotlib.use('Agg')
import pandas as pd
import numpy as np
import sys
from util import *
from fbprophet import Prophet

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

def predict_agency(travel_agency, isReducedData, prediction_period):
    """
    Creates a predictive graph for bookings per week for a travel agency
    """
    # Filter the data to get only the rows for given agent
    dataframe = getAgencyBookingData('agent', travel_agency, 'ds', 'y')
    dataframe = changeDates(dataframe, 'ds', 'y')

    forecast = prophet_core(dataframe, isReducedData, prediction_period)

    # Save the graphs locally for comparision
    # model.plot(forecast).savefig('IATAforecast.png');
    # model.plot_components(forecast).savefig('IATAforecast_components.png');

    return forecast


def predict_destination(destination, isReducedData, prediction_period):
    """
    Creates a predictive graph for bookings per week to a given destination
    """
    # Filter the data to get only the rows for given destination
    dataframe = getDestinationBookingData('destination', destination, 'ds', 'y')
    dataframe = changeDates(dataframe, 'ds', 'y')

    forecast = prophet_core(dataframe, isReducedData, prediction_period)

    # Save the graphs locally for comparision
    # model.plot(forecast).savefig('DESTforecast.png');
    # model.plot_components(forecast).savefig('DESTforecast_components.png');

    return forecast


def predict_competition(myBookings, rivalBookings, dates):
    """
    Creates a predictive graphs for bookings per week to a given destination
    """

    initial_length = len(myBookings)

    # for i, _ in enumerate(dates):
    #     eprint("My : " + str(myBookings[i]))
    #     eprint("Rival : " + str(rivalBookings[i]))
    #     eprint("Date : " + str(dates[i]))
    #     eprint("\n")

    # Convert the 2 lists into a dataframe
    myDataframe = pd.DataFrame({'ds': dates, 'y': myBookings})

    myForecast = prophet_core(myDataframe, False, 52)
    # Convert the prediction column into a list
    myPredictions = myForecast['yhat'].tolist()

    # Convert the 2 lists  into a dataframe
    rivalDataframe = pd.DataFrame({'ds': dates, 'y': rivalBookings})

    rivalForecast = prophet_core(rivalDataframe, False, 52)
    # Convert the prediction column into a list
    rivalPredictions = rivalForecast['yhat'].tolist()

    # Convert the dates for prediction column into a list
    predictionDates = rivalForecast['ds'].tolist()

    for i, _ in enumerate(predictionDates):
        predictionDates[i] = predictionDates[i].strftime("%Y-%m-%d")


    # for i, _ in enumerate(predictionDates):
    #     eprint("My : " + str(myPredictions[i]))
    #     eprint("Rival : " + str(rivalPredictions[i]))
    #     eprint("Date : " + str(predictionDates[i]))
    #     eprint("\n")

    return myPredictions[initial_length:], rivalPredictions[initial_length:], predictionDates[initial_length:]


def prophet_core(dataframe, isReduced, prediction_period):
    # How may weeks into the future we want the predictions for
    period_val = 52

    # Checks if we only want to predict against the real data for comparision
    if (isReduced):
        # Slices dataframe going into model
        dataframe = dataframe[:len(dataframe.index) - prediction_period]

        # Reduces number of values predicted going so that we only predict for
        #  dates we have values for
        period_val = prediction_period

    # Turn off the features to detect variations within a week
    model = Prophet(weekly_seasonality=False)

    # Fit the model with the given dataframe
    model.fit(dataframe)

    future = model.make_future_dataframe(periods = period_val, freq = 'W')

    forecast = model.predict(future)

    return forecast

