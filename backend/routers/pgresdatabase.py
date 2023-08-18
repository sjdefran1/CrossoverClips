import os
import psycopg2

# psy_cursor = None
# psyconn = None


def create_connections() -> None:
    """Makes connection w/ postgres db, declares psy_cursor and psyconn globally"""
    global psy_cursor
    global psyconn
    print("\tCONNECTING TO DATABASE")
    psyconn = psycopg2.connect(
        host=os.getenv("NEONHOST"),
        port=os.getenv("NEONPORT"),
        user=os.getenv("USER"),
        database=os.getenv("DATABASE"),
        password=os.getenv("PASSWORD"),
    )
    psy_cursor = psyconn.cursor()
    print("\tFINISHED")
    return


def ping_db() -> None:
    """Checks if connection to db has closed, resets connection if it has"""
    try:
        print("\nPinging Databse")
        psy_cursor.execute("SELECT 1")
    except psycopg2.OperationalError:
        print("Connection was closed")
        create_connections()  # reset connection
    except psycopg2.InterfaceError:
        print("Cursor was closed")
        create_connections()
    return
