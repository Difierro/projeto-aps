from fastapi import FastAPI, Depends, HTTPException, status
from database import init_db
from deps import get_db, get_current_user, require_gerente
from sqlalchemy.orm import Session
import crud, schemas, models
from auth import create_access_token
from fastapi.middleware.cors import CORSMiddleware
import datetime

app = FastAPI(title="API - Salão")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/auth/login", response_model=schemas.Token)
def login(payload: schemas.Login, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, payload.email, payload.senha)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user_name": user.nome,
        "user_role": user.tipo_usuario
    }

@app.post("/users", response_model=schemas.UserOut, status_code=201)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db), gerente = Depends(require_gerente)):
    if db.query(models.User).filter_by(email=user_in.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    try:
        user = crud.create_user(db, user_in.nome, user_in.email, user_in.senha, user_in.tipo_usuario, user_in.funcao)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users", response_model=list[schemas.UserOut])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return crud.get_users(db, skip, limit)

@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db), gerente = Depends(require_gerente)):
    user = db.query(models.User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(404, "Usuário não encontrado")
    user.ativo = False
    db.commit()
    return None

@app.post("/clients", response_model=schemas.ClientOut, status_code=201)
def create_client(client_in: schemas.ClientCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    try:
        client = crud.create_client(db, client_in.nome, client_in.telefone, client_in.preferencias)
        return client
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/clients", response_model=list[schemas.ClientOut])
def list_clients(q: str | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return crud.search_clients(db, q, skip, limit)

@app.get("/clients/{client_id}", response_model=schemas.ClientOut)
def get_client(client_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    c = crud.get_client(db, client_id)
    if not c: raise HTTPException(404, "Cliente não encontrado")
    return c

@app.get("/clients/{client_id}/history", response_model=list[schemas.AppointmentOut])
def get_client_history(client_id: int, start: datetime.date = None, end: datetime.date = None, db: Session = Depends(get_db), user = Depends(get_current_user)):
    start_dt = datetime.datetime.combine(start, datetime.time.min) if start else None
    end_dt = datetime.datetime.combine(end, datetime.time.max) if end else None
    return crud.get_client_history(db, client_id, start_dt, end_dt)

@app.get("/appointments", response_model=list[schemas.AppointmentOut])
def list_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return crud.get_appointments(db, skip, limit)

@app.post("/appointments", response_model=schemas.AppointmentOut, status_code=201)
def create_appointment(ap_in: schemas.AppointmentCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    try:
        ap = crud.create_appointment(db, ap_in.cliente_id, ap_in.profissional_id, ap_in.data_hora, ap_in.duracao_minutos, ap_in.tipo_servico, ap_in.observacoes)
        return ap
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/appointments/{ap_id}", response_model=schemas.AppointmentOut)
def get_appointment(ap_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    ap = crud.get_appointment(db, ap_id)
    if not ap: raise HTTPException(404, "Agendamento não encontrado")
    return ap

@app.post("/appointments/{ap_id}/cancel", response_model=schemas.AppointmentOut)
def cancel_appointment(ap_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    ap = crud.get_appointment(db, ap_id)
    if not ap: raise HTTPException(404, "Agendamento não encontrado")
    ap = crud.cancel_appointment(db, ap)
    return ap

@app.post("/appointments/{ap_id}/reschedule", response_model=schemas.AppointmentOut)
def reschedule_appointment(ap_id: int, payload: schemas.ReschedulePayload, db: Session = Depends(get_db), user = Depends(get_current_user)):
    ap = crud.get_appointment(db, ap_id)
    if not ap: raise HTTPException(404, "Agendamento não encontrado")
    novo_prof = payload.novo_profissional_id or ap.profissional_id
    try:
        novo = crud.reschedule_appointment(db, ap, payload.nova_data_hora, novo_prof)
        return novo
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/appointments/{ap_id}/finalize", response_model=schemas.AppointmentOut)
def finalize_appointment(ap_id: int, payload: schemas.FinalizePayload, db: Session = Depends(get_db), user = Depends(get_current_user)):
    ap = crud.get_appointment(db, ap_id)
    if not ap: raise HTTPException(404, "Agendamento não encontrado")
    try:
        ap = crud.finalize_appointment(db, ap, payload.valor, payload.tipo_pagamento)
        return ap
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/reports/financial")
def financial_report(start: datetime.date, end: datetime.date, db: Session = Depends(get_db), gerente = Depends(require_gerente)):
    start_dt = datetime.datetime.combine(start, datetime.time.min)
    end_dt = datetime.datetime.combine(end, datetime.time.max)
    return crud.get_financial_report(db, start_dt, end_dt)
