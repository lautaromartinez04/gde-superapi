import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.orm import Session
import models
import schemas
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
CONTACT_RECEIVER = os.getenv("CONTACT_RECEIVER", "info@donemiliosrl.com.ar")

def send_email(to_email: str, subject: str, body: str):
    if not SMTP_USER or not SMTP_PASSWORD:
        print("SMTP credentials not configured. Email not sent.")
        return False
    
    msg = MIMEMultipart()
    msg['From'] = SMTP_USER
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def create_contact_message(db: Session, message_data: dict):
    db_message = models.ContactMessage(**message_data)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Send Notification to Company
    company_subject = f"Nuevo contacto desde {db_message.service}: {db_message.name} {db_message.lastName or ''}"
    company_body = f"""
    Has recibido un nuevo mensaje de contacto.
    
    Nombre: {db_message.name} {db_message.lastName or ''}
    Email: {db_message.email}
    Teléfono: {db_message.phone or 'No proporcionado'}
    Servicio/Página: {db_message.service}
    
    Mensaje:
    {db_message.message}
    """
    send_email(CONTACT_RECEIVER, company_subject, company_body)
    
    # Send Confirmation to User
    user_subject = "Gracias por contactarnos - Grupo Don Emilio"
    user_body = f"""
    Hola {db_message.name},
    
    Muchas gracias por contactar con nosotros. Hemos recibido tu mensaje y nos pondremos en contacto pronto.
    
    Saludos,
    El equipo de Grupo Don Emilio.
    """
    send_email(db_message.email, user_subject, user_body)
    
    return db_message

def get_contact_messages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).offset(skip).limit(limit).all()

def update_contact_message(db: Session, message_id: int, update_data: dict):
    db_message = db.query(models.ContactMessage).filter(models.ContactMessage.id == message_id).first()
    if not db_message:
        return None
    
    for key, value in update_data.items():
        if value is not None:
            setattr(db_message, key, value)
            
    db.commit()
    db.refresh(db_message)
    return db_message

def delete_contact_message(db: Session, message_id: int):
    db_message = db.query(models.ContactMessage).filter(models.ContactMessage.id == message_id).first()
    if not db_message:
        return False
    
    db.delete(db_message)
    db.commit()
    return True
