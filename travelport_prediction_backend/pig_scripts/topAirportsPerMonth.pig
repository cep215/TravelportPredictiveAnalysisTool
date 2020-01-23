-- Load the midt data
Source = LOAD '/data/midt_IATA' USING PigStorage('|') AS
(
  VendorCode:chararray,
  IATAToken:chararray,
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

FilterData =
  FILTER Source
  BY TrueDestinationISOCountry != 'GB';
ReducedData =
  FOREACH FilterData
  GENERATE TrueDestinationAirport,
    ToDate(TrueArrivalDate, 'yyyy-MM-dd') AS Date:DateTime;
ReducedMonthData =
  FOREACH ReducedData
  GENERATE TrueDestinationAirport,
    GetMonth(Date) AS Month;
GroupedTravelData =
  GROUP ReducedMonthData
  BY (TrueDestinationAirport, Month);
CountedAirports =
  FOREACH GroupedTravelData
  GENERATE group,
    COUNT(ReducedMonthData) AS counts;
RegroupedAirports =
  GROUP CountedAirports
  BY group.Month;
GroupedAirports =
  FOREACH RegroupedAirports {
	   Sorted = ORDER CountedAirports
              BY counts DESC;
	   Top = LIMIT Sorted 5;
	GENERATE group,
    flatten(Top);
};
PopularAirports =
  ORDER GroupedAirports
  BY group, counts DESC;
FinalOutput =
  FOREACH PopularAirports
  GENERATE Top::group.Month,
    Top::group.TrueDestinationAirport,
    Top::counts;

STORE FinalOutput INTO '/data/popularCities' USING PigStorage(',');
