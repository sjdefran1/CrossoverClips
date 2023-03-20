from datetime import datetime

def fix_date_db(date: str) -> str:
    try:
        date_format = "%a, %d %b %Y %H:%M:%S %Z"
        parsed_date = datetime.strptime(date, date_format)
    except:
        date_format = "%Y-%m-%d"
        parsed_date = datetime.strptime(date, date_format)
    new_date = parsed_date.strftime("%Y-%m-%d")
    return new_date

def get_season_str(date_recieved: str) -> str:
    date_recieved = datetime.strptime(date_recieved, '%Y-%m-%d').date()
    # Define the year date ranges
    season_ranges = {
        '2014-15': (datetime(2014, 10, 28).date(), datetime(2015, 4, 15).date()),
        '2015-16': (datetime(2015, 10, 27).date(), datetime(2016, 4, 13).date()),
        '2016-17': (datetime(2016, 10, 25).date(), datetime(2017, 4, 12).date()),
        '2017-18': (datetime(2017, 10, 17).date(), datetime(2018, 4, 10).date()),
        '2018-19': (datetime(2018, 10, 16).date(), datetime(2019, 4, 10).date()),
        '2019-20': (datetime(2019, 10, 22).date(), datetime(2019, 12, 1).date()),
    }

    # Iterate over the years and return the matching season
    for year, (start_date, end_date) in season_ranges.items():
        #print(f"{start_date} <= {date_recieved} <= {end_date}")
        if start_date <= date_recieved <= end_date:
            return year

    # Return None if no matching year was found
    return ""