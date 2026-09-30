import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

to_addr = sys.argv[1]
subject = sys.argv[2]
body = sys.argv[3]

msg = MIMEMultipart()
msg['From'] = 'bore.younous59@gmail.com'
msg['To'] = to_addr
msg['Subject'] = subject
msg.attach(MIMEText(body, 'plain'))

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('bore.younous59@gmail.com', 'jejocjljqepmettm')
    server.send_message(msg)
    server.quit()
    sys.exit(0)
except Exception as e:
    print(f"SMTP Error: {e}")
    sys.exit(1)
