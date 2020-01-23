-- Load the midt data
Dates = LOAD '/data/dates.csv' USING PigStorage(',') AS (dates:chararray);

Source = LOAD '/data/midt_IATA' USING PigStorage('|') AS
(
  VendorCode:chararray,
  IATACode:chararray,
  TrueOriginAirport:chararray,
  TrueDestinationAirport:chararray,
  TrueAirline:chararray,
  TrueBookingClass:chararray,
  TruePassengerCount:chararray,
  PNRNumber:chararray,
  SegmentDepartureDate:chararray,
  SegmentOriginAirport:chararray,
  SegmentDepartureTime:chararray,
  SegmentArrivalDate:chararray,
  SegmentDestinationAirport:chararray,
  SegmentArrivalTime:chararray,
  SegmentAirline:chararray,
  SegmentFlightNumber:chararray,
  SegmentClass:chararray,
  SegmentPassengerCount:chararray,
  SegmentDateFlag:chararray,
  TrueSequenceNumber:chararray,
  TrueCode:chararray,
  SegmentGMTDateTime:chararray,
  TrueTransAirlines:chararray,
  TrueTransClass:chararray,
  TrueSegmentCount:chararray,
  SegmentSequence:chararray,
  SegmentTransClass:chararray,
  TrueDominantAirline:chararray,
  TrueDominantOwnerAirline:chararray,
  TrueDominantClass:chararray,
  TrueOperatingAirline:chararray,
  TrueAffiliatedAirline:chararray,
  TrueOwnerAirline:chararray,
  TrueOperASAirline:chararray,
  Point_of_OriginAirportPNR:chararray,
  TrueOriginDOTCountry:chararray,
  TrueOriginISOCountry:chararray,
  TrueDestinationDOTCountry:chararray,
  TrueDestinationISOCountry:chararray,
  TrueDepartureDate:chararray,
  TrueDepartureDayofWeek:chararray,
  TrueDepartureTime:chararray,
  SegmentBookingDate:chararray,
  SegmentMileage:chararray,
  SegmentOriginISOCountry:chararray,
  SegmentDestinationISOCountry:chararray,
  SegmentOriginDOTCountry:chararray,
  SegmentDestinationDOTCountry:chararray,
  SegmentOriginContinent:chararray,
  SegmentDestinationContinent:chararray,
  SegmentOperatingAirline:chararray,
  SegmentOperatingFlight:chararray,
  SegmentAffiliatedAirline:chararray,
  SegmentAffiliatedFlight:chararray,
  SegmentDayofWeek:chararray,
  SegmentOwnerAirline:chararray,
  SegmentAircraftType:chararray,
  Filler:chararray,
  SegmentAgencyFlag:chararray,
  TripAgencyPOSISOCtryCode:chararray,
  PNROriginalBookingDate:chararray,
  TrueOriginCityCode:chararray,
  TrueDestinationCityCode:chararray,
  TrueGMTDepartureDate:chararray,
  TrueGMTDepartureTime:chararray,
  TrueGMTArrivalDate:chararray,
  TrueGMTArrivalTime:chararray,
  TrueElapsedTime:chararray,
  TrueCumulativeMileage:chararray,
  TrueStops:chararray,
  TrueArrivalDate:chararray,
  TrueArrivalTime:chararray,
  TrueOriginContinentCode:chararray,
  TrueDestinationContinentCode:chararray,
  TrueArrivalDOWLocal:chararray,
  TrueNon_StopMileage:chararray,
  TrueInterlineIndicator:chararray,
  TrueDomIntlIndicator:chararray,
  TrueDominantOperatingAirline:chararray,
  TrueDominantAircraftType:chararray,
  TrueDominantEquipmentCode:chararray,
  TrueDominantClassTranslation:chararray,
  SegmentPreliminaryStatusCode:chararray,
  SegmentFinalStatusCode:chararray,
  SegmentOriginCityCode:chararray,
  SegmentDestinationCityCode:chararray,
  SegmentStops:chararray,
  SegmentGMTArrivalDate:chararray,
  SegmentGMTArrivalTime:chararray,
  SegmentElapsedTime:chararray,
  SegmentEquipmentCode:chararray,
  SegmentArrivalDOW:chararray,
  SegmentBookingTransactionTime:chararray,
  SegmentID:chararray,
  SegmentOperASAirline:chararray,
  TrueDominantOperASAirline:chararray,
  TrueAssignedBookingClass:chararray,
  SegmentAgencyPOSISOCtryCode:chararray,
  PNRFirstDateofTravel:chararray
);

%default DEST_ISO 'GB'
%default DATE_MIN '2015-01-01'
%default DATE_MAX '2015-12-31'

-- For now, TrueDestinationISOCountry is being treated as a single cluster.
-- TODO: specify country, dates in the past do not need computing
select_source =
  FILTER Source
  BY (TrueDestinationISOCountry == '$DEST_ISO')
    AND ('$DATE_MIN' <= PNROriginalBookingDate)
    AND (PNROriginalBookingDate <= '$DATE_MAX');

-- Populate all counts with 0
select_dates =
  FILTER Dates
  BY ('$DATE_MIN' <= dates)
    AND (dates <= '$DATE_MAX');
select_agencies =
  FOREACH select_source
  GENERATE IATACode AS AgentToken,
    0 AS Bookings;
distinct_agencies =
  DISTINCT select_agencies;

zero_trips =
  CROSS select_dates, distinct_agencies;

-- >= 1 counts
proj_source =
  FOREACH select_source
  GENERATE IATACode,
    PNROriginalBookingDate;
trips =
  GROUP proj_source
  BY (PNROriginalBookingDate, IATACode);
daily_counts =
  FOREACH trips
  GENERATE FLATTEN(group) AS (dates, AgentToken),
    COUNT(proj_source.IATACode) AS Bookings;

-- Merge counts
all_counts =
  UNION daily_counts, zero_trips;
all_trips =
  GROUP all_counts
  BY (dates, AgentToken);
all_daily_count =
  FOREACH all_trips
  GENERATE FLATTEN(group) AS (dates, AgentToken),
    SUM(all_counts.Bookings) AS Bookings;

STORE all_daily_count INTO '/data/competitor' USING PigStorage(',');
