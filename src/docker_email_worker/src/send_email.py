import mysql.connector
import smtplib
import time
from datetime import datetime

wait_time = 10

sender_address = "calendarapp97@gmail.com" # Replace this with your Gmail address

receiver_address = None # Replace this with any valid email address

account_password = "calendarapp1" # Replace this with your Gmail account password

subject = "Reminder about your meeting!"

body = "Hello from Calendar App!\n\nThis is a reminder that your meeting is 24 hours away.\nWith regards,\n\tCalendar App Team"

# Endpoint for the SMTP Gmail server (Don't change this!)
smtp_server = smtplib.SMTP_SSL("smtp.gmail.com", 465)

# Login with your Gmail account using SMTP
smtp_server.login(sender_address, account_password)

# Let's combine the subject and the body onto a single message
message = f"Subject: {subject}\n\n{body}"

# Establish the connection to the DB
config = {
    'user' : 'root',
    'password' : '',
    'host' : 'host.docker.internal',
    'database' : 'calendar'
}

SQL_connection = mysql.connector.connect(**config)
SQL_cursor = SQL_connection.cursor()

# Loop infinitely 
while (True):
    
    # First, check the table for any entries that have less than 24 hours until it is time and have not been sent an email 
    select_query = "SELECT * FROM RegisteredForTime rft, FreeTimeSlot fts, User u WHERE rft.time_slot_id = fts.id AND u.id = rft.signup_id AND rft.last_email_sent IS NULL AND fts.start_time < DATE_SUB(NOW(), INTERVAL -24 HOUR)"

    SQL_cursor.execute(select_query, ())

    # Next, get the email from the user table
    email_list = SQL_cursor.fetchall()
    receiver_address = email_list[0][12]
    rft_id = email_list[0][0]

    print()
    print(f"The email is: {receiver_address}")
    print(f"The ID of the registered for entry is {rft_id}")

    # Finally, send the email and update the table
    # We'll be sending this message in the above format (Subject:...\n\nBody)
    smtp_server.sendmail(sender_address, receiver_address, message)
    print()
    print("Email sent!")

    update_query = "UPDATE RegisteredForTime rft SET rft.last_email_sent = %s WHERE rft.id = %s"

    SQL_cursor.execute(update_query, (str(datetime.now()),str(rft_id)))
    SQL_connection.commit()

    print()
    print(f"Waiting for {wait_time} seconds and checking again")
    print()
    time.sleep(wait_time)