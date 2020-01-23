import datetime as dt

import pandas as pd

start = dt.datetime.strptime("2000-01-01", "%Y-%m-%d")
end = dt.datetime.strptime("2000-01-10", "%Y-%m-%d")

df = pd.DataFrame({'year': [2016, 2017],
                   'month': [12, 1],
                   'day': [28, 1]})
df = pd.to_datetime(df[['year', 'month', 'day']])
# print (df)

day1 = df.iloc[1]

day2 = dt.datetime.strptime("2017-01-01", "%Y-%m-%d")

x = dt.datetime(2018, 01, 02)
d = x - dt.timedelta(days=3)
r = pd.to_datetime(d)
print r

x1 = dt.datetime(2018, 01, 03)
d1 = x1 - dt.timedelta(days=3)
r1 = pd.to_datetime(d1)
print r1
print r1 > r


def changeDates(df, day_col_name):
    data_frame.sort(df.day_col_name)

    for i, row in df.iterrows():
        date = row[day_col_name]
        day_of_week = date.dayofweek

        new_day = date - dt.timedelta(days=day_of_week)
        row[day_col_name] = pd.to_datetime(new_day)
        print df.iloc[i]

# changeDates(df)
