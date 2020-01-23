from flask import Flask
from flask_cors import CORS
from werkzeug.contrib.cache import SimpleCache

from arima_predictions import *
from competitors import *
from prophet_prediction import *

app = Flask(__name__)
CORS(app)
cache = SimpleCache()
app.config.from_object('config')


@app.route('/status')
def get_status():
    return jsonify({"status": "ok"})


@app.route('/run/popular')
def get_popular_dest():
    # runs pig job
    connect = can_connect_to_cluster()
    run_pig('topAirportsPerMonth.pig')

    return jsonify({"status": "ok", "connection": connect})


@app.route('/popular/<int:month>')
def get_popular(month):
    # downloads file from hdfs
    result_file = 'data/pig_data/popularCities/part-v005-o000-r-00000'
    count = getfile(result_file, 'popular_city.csv')

    pig_data = (csv_to_dict('popular_city.csv', ['month', 'airport', 'count']))
    month_data = [elem for elem in pig_data["values"] if int(elem["month"]) == \
                  month]

    return jsonify(month_data)


#
# Predictions based on agent's IATA
#

@app.route('/prediction/prophet/model/<string:travel_agency>')
def get_prophet_model(travel_agency):
    data_points = []
    prediction = predict_agency(travel_agency, False, 0)

    for i in range(1, len(prediction['ds'])):
        point = {
            'bookings': prediction['yhat'][i],
            'week': prediction['ds'][i].strftime("%y-%m-%d")
        }
        data_points.append(point)

    return jsonify(data_points)


@app.route('/prediction/prophet/<string:travel_agency>/<int:prediction_period>')
def get_prophet_agency_prediction(travel_agency, prediction_period):
    data_points = []
    prediction = predict_agency(travel_agency, True, prediction_period)

    for i in range(len(prediction['ds']) - prediction_period,
                   len(prediction['ds'])):
        point = {
            'bookings': prediction['yhat'][i],
            'week': prediction['ds'][i].strftime("%y-%m-%d")
        }
        data_points.append(point)

    return jsonify(data_points)


@app.route('/prediction/arima/model/<string:travel_agency>')
def get_arima_model(travel_agency):
    return jsonify(arima_bookings_model(travel_agency))


@app.route('/prediction/arima/<string:travel_agency>/<int:prediction_period>')
def get_travelagency_booking_prediction(travel_agency, prediction_period):
    # #predicts bookings for travel agencies
    # csv_name = 'prediction_part1.csv'
    # result_file = 'data/legacy/ARIMAData4/part-v001-o000-r-00000'
    # getfile(result_file, csv_name)

    # return jsonify(arima_bookings_prediction(travel_agency, prediction_period, csv_name))

    return jsonify(arima_bookings_prediction(travel_agency, prediction_period))


@app.route('/prediction/real/<string:travel_agency>')
def get_real_agency_booking_data(travel_agency):
    # returns the real booking data per week per agency

    # csv_name = 'booking_data.csv'
    # result_file = 'data/legacy/ARIMAData4/part-v001-o000-r-00000'
    # getfile(result_file, csv_name)

    # header = ['date', 'count']
    # dataframe = pd.read_csv('booking_data.csv', names=header)

    # dataframe = filterFile(csv_name, 'agent', travel_agency, 'date', 'count')
    dataframe = getAgencyBookingData('agent', travel_agency, 'date', 'count')
    dataframe = changeDates(dataframe, 'date', 'count')

    data_points = []

    for index, row in dataframe.iterrows():
        point = {
            'bookings': int(row['count']),
            'week': row['date']
        }
        data_points.append(point)

    return jsonify(data_points)


@app.route('/competitors/<string:agency>')
def get_agency_competitors(agency):
    csv_name = 'competitors.csv'
    result_file = 'data/pig_data/competitor/part-v005-o000-r-00000'
    getfile(result_file, csv_name)

    return jsonify(get_competitors(agency, csv_name))


#
# Predictions based on destination
#

@app.route('/prediction/prophet/model/destination/<string:destination>')
def get_prophet_model_destination(destination):
    data_points = []
    prediction = predict_destination(destination, False, 0)

    for i in range(1, len(prediction['ds'])):
        point = {
            'bookings': prediction['yhat'][i],
            'week': prediction['ds'][i].strftime("%y-%m-%d")
        }
        data_points.append(point)

    return jsonify(data_points)


@app.route('/prediction/real/destination/<string:destination>')
def get_real_destination_booking_data(destination):
    # returns the real booking data per week per destination

    dataframe = getDestinationBookingData('destination', destination, 'date',
                                          'count')
    dataframe = changeDates(dataframe, 'date', 'count')

    data_points = []

    for index, row in dataframe.iterrows():
        point = {
            'bookings': int(row['count']),
            'week': row['date']
        }
        data_points.append(point)

    return jsonify(data_points)


@app.route(
    '/prediction/prophet/destination/<string:destination>/<int:prediction_period>')
def get_prophet_destination_prediction(destination, prediction_period):
    data_points = []
    prediction = predict_destination(destination, True, prediction_period)

    for i in range(len(prediction['ds']) - prediction_period,
                   len(prediction['ds'])):
        point = {
            'bookings': prediction['yhat'][i],
            'week': prediction['ds'][i].strftime("%y-%m-%d")
        }
        data_points.append(point)

    return jsonify(data_points)


@app.route('/prediction/arima/model/destination/<string:destination>')
def get_arima_model_destination(destination):
    return jsonify(arima_destination_model(destination))


@app.route(
    '/prediction/arima/destination/<string:destination>/<int:prediction_period>')
def get_arima_destination_prediction(destination, prediction_period):
    return jsonify(arima_destination_prediction(destination, prediction_period))


if __name__ == '__main__':
    app.run(host='0.0.0.0',
            port=5000)
