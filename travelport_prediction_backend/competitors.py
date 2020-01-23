import prophet_prediction as pp
import datetime as dt

_competitor_date_format = "%Y-%m-%d"

def get_competitors(you_id, filename):
    """ Returns a dictionary of:
            agencies : [
                {agency: 'You',
                bookings: [you_id's bookings]
                },
                {agency: 'Other',
                bookings: [sum of other agencies' bookings]
                },
                {agency: 'Forecast'
                bookings: [predicted bookings for you_id]
                }
            ]
            dates : [dates the bookings occurred]

        For easy front-end display.
    """
    _you_label = 'You'
    _others_label = 'Others'

    dates = []
    agency_stats = { _you_label : [], _others_label : [] }
    last_date = None
    last_agency_stats = { _you_label : 0, _others_label : 0 }

    def to_latest_monday(date):
        day = dt.datetime.strptime(date, _competitor_date_format)
        date_monday = day - dt.timedelta(days=day.weekday())
        return date_monday.strftime(_competitor_date_format)

    def append_date_data():
        """ Adds the last set of bookings to the overall set """
        dates.append(date)
        for aid, b in last_agency_stats.items():
            agency_stats[aid].append(last_agency_stats[aid])
            last_agency_stats[aid] = 0

    with open(filename, "r") as input_file:
	# {[{agency:id, [bookings:bookNo]}], [bookDate:date]}
        # Line-by-line processing of agency bookings
        for line in input_file:
            entry = line[:-1].split(',')
            assert (len(entry) == 3), "Invalid entry"

            date = to_latest_monday(entry[0])
            agency_label = _you_label if entry[1] == you_id else _others_label
            booking_count = entry[2]

            last_agency_stats[agency_label] += int(booking_count)

            if last_date and date != last_date:
                append_date_data()
            last_date = date
        # Flush last read data (check if any data was read)
        if input_file:
            append_date_data()

    # Predict future bookings
    p_you_stats, p_others_stats, p_dates = \
    pp.predict_competition(agency_stats[_you_label], agency_stats[_others_label], dates)

    # Combine predicted bookings with current bookings
    agency_stats[_you_label] = agency_stats[_you_label] + p_you_stats
    agency_stats[_others_label] = agency_stats[_others_label] + p_others_stats
    dates = dates + p_dates

    # Cap negative predictions to 0
    for aid, b in agency_stats.items():
        agency_stats[aid] = [max(0, x) for x in b]

    # Convert int bookings to strings
    for aid, b in agency_stats.items():
        agency_stats[aid] = [str(x) for x in b]

    agency_objs = []
    for agency, counts in agency_stats.items():
        agency_objs.append({ "agency": agency, "bookings": counts })
    obj = { "agencies": agency_objs, "dates": dates }

    return obj
