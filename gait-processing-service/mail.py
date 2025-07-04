import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# SMTP Config
smtp_server = "email-smtp.us-east-1.amazonaws.com"
smtp_port = 587
smtp_username = "AKIAU6VTTF4ATPKVYXAY"  # Looks like AKIA...
smtp_password = "BB8nrxPnxz70Tpi2Brz557Aq2N9Ofs2Wyqt/akEZxhf3"  # From the SES creds
from_email = "alert@rehabgait.com"    # Must be verified in SES
to_email = "yohansenanayake4321@gmail.com"

# Email content
subject = "✅ SES SMTP Test"
body = "This is a test email sent from a local Python script using AWS SES."

# Construct message
message = MIMEMultipart()
message["Subject"] = subject
message["From"] = from_email
message["To"] = to_email
message.attach(MIMEText(body, "plain"))

# Send email
try:
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(from_email, to_email, message.as_string())
        print("✅ Email sent successfully!")
except Exception as e:
    print(f"❌ Failed to send email: {e}")
