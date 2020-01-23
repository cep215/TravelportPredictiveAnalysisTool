Terminal commands
    $ docker build -t travelport-prediction:latest .
    $ docker run -p 5000:5000 travelport-prediction:latest
Access on browser:
    localhost:5000/status

DATABASE
To import the data into a locally hosted mongodb database:
1) Set up and start mongodb database with default settings
2) Start web application
3) Export Data to CSV file named: "CSV POS_UK_FARE_DATA_SAMPLE_Sep01_2017.csv"
 and save in the folder of the application
4) Connect to db on localhost:5000/database

NOTE: This is a temporary method to get some data into a database so that we
can begin work
