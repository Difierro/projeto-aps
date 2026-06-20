from sqlalchemy.orm import Session
from models import User, Client, Appointment
from auth import hash_password, verify_password, create_access_token
from datetime import timedelta, datetime

def create_user(db: Session, nome: str, email: str, senha: str, tipo_usuario: str = "colaborador", funcao: str = None):
    hashed = hash_password(senha)
    user = User(nome=nome, email=email, senha_hash=hashed, tipo_usuario=tipo_usuario, funcao=funcao)
    db.add(user); db.commit(); db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, senha: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(senha, user.senha_hash):
        return None
    return user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_client(db: Session, nome: str, telefone: str = None, preferencias: str = None):
    c = Client(nome=nome, telefone=telefone, preferencias=preferencias)
    db.add(c); db.commit(); db.refresh(c)
    return c

def get_client(db: Session, client_id: int):
    return db.query(Client).filter(Client.id == client_id).first()

def search_clients(db: Session, q: str = None, skip=0, limit=100):
    query = db.query(Client)
    if q:
        q_like = f"%{q}%"
        query = query.filter(Client.nome.ilike(q_like))
    return query.offset(skip).limit(limit).all()

def is_conflict(db: Session, profissional_id: int, start: datetime, duracao_minutos: int, exclude_appointment_id: int = None):
    end = start + timedelta(minutes=duracao_minutos)
    q = db.query(Appointment).filter(
        Appointment.profissional_id == profissional_id,
        Appointment.status != "cancelado"
    )
    if exclude_appointment_id:
        q = q.filter(Appointment.id != exclude_appointment_id)
    for ap in q.all():
        ap_start = ap.data_hora
        ap_end = ap_start + timedelta(minutes=ap.duracao_minutos or 60)
        if (start < ap_end and end > ap_start):
            return True
    return False

def create_appointment(db: Session, cliente_id: int, profissional_id: int, data_hora: datetime, duracao_minutos: int = 60, tipo_servico: str = None, observacoes: str = None):
    if data_hora.hour < 8 or data_hora.hour > 20:
        raise ValueError("Horário inválido. Atendimento apenas 08:00 - 20:00.")

    if is_conflict(db, profissional_id, data_hora, duracao_minutos):
        raise ValueError("Este profissional já possui um agendamento neste horário.")

    if data_hora < datetime.now():
        raise ValueError("Não é possível agendar no passado.")

    ap = Appointment(cliente_id=cliente_id, profissional_id=profissional_id, data_hora=data_hora,
                     duracao_minutos=duracao_minutos, tipo_servico=tipo_servico, observacoes=observacoes)
    db.add(ap); db.commit(); db.refresh(ap)
    return ap

def get_appointment(db: Session, ap_id: int):
    return db.query(Appointment).filter(Appointment.id == ap_id).first()

def get_appointments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Appointment).order_by(Appointment.data_hora.desc()).offset(skip).limit(limit).all()

def cancel_appointment(db: Session, ap: Appointment):
    ap.status = "cancelado"
    db.commit(); db.refresh(ap)
    return ap

def reschedule_appointment(db: Session, ap: Appointment, nova_data_hora, novo_profissional_id = None):
    profissional_id = novo_profissional_id or ap.profissional_id
    
    if nova_data_hora.hour < 8 or nova_data_hora.hour > 20:
        raise ValueError("Horário inválido (08h-20h).")

    if is_conflict(db, profissional_id, nova_data_hora, ap.duracao_minutos, exclude_appointment_id=ap.id):
        raise ValueError("Conflito de horário para o reagendamento.")
    
    if nova_data_hora < datetime.now():
        raise ValueError("Não é possível reagendar para o passado.")
        
    ap.data_hora = nova_data_hora
    ap.profissional_id = profissional_id
    db.commit(); db.refresh(ap)
    return ap

def finalize_appointment(db: Session, ap: Appointment, valor: float, tipo_pagamento: str):
    if ap.data_hora > datetime.now():
        raise ValueError("Não é possível finalizar um atendimento que ainda vai acontecer.")
    
    ap.valor = valor
    ap.tipo_pagamento = tipo_pagamento
    ap.status = "finalizado"
    db.commit(); db.refresh(ap)
    return ap

def get_financial_report(db: Session, start_date, end_date):
    q = db.query(Appointment).filter(Appointment.status == "finalizado", Appointment.data_hora >= start_date, Appointment.data_hora <= end_date)
    total = sum([a.valor or 0 for a in q.all()])
    detalhes = [{
        "id": a.id, "data_hora": a.data_hora, "profissional_id": a.profissional_id,
        "cliente_id": a.cliente_id, "valor": a.valor, "tipo_pagamento": a.tipo_pagamento
    } for a in q.all()]
    return {"total": total, "detalhes": detalhes}

def get_client_history(db: Session, client_id: int, start_date: datetime = None, end_date: datetime = None):
    q = db.query(Appointment).filter(Appointment.cliente_id == client_id, Appointment.status == 'finalizado')
    if start_date:
        q = q.filter(Appointment.data_hora >= start_date)
    if end_date:
        q = q.filter(Appointment.data_hora <= end_date)
    return q.order_by(Appointment.data_hora.desc()).all()
