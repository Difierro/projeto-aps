from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    tipo_usuario = Column(String, default="colaborador")
    funcao = Column(String, nullable=True)
    ativo = Column(Boolean, default=True)
    atendimentos = relationship("Appointment", back_populates="profissional")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    telefone = Column(String, nullable=True)
    preferencias = Column(Text, nullable=True)
    data_cadastro = Column(DateTime, default=datetime.datetime.utcnow)
    agendamentos = relationship("Appointment", back_populates="cliente")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clients.id"))
    profissional_id = Column(Integer, ForeignKey("users.id"))
    data_hora = Column(DateTime, nullable=False, index=True)
    duracao_minutos = Column(Integer, default=60)
    tipo_servico = Column(String, nullable=True)
    status = Column(String, default="agendado")
    valor = Column(Float, nullable=True)
    tipo_pagamento = Column(String, nullable=True)
    observacoes = Column(Text, nullable=True)
    
    cliente = relationship("Client", back_populates="agendamentos")
    profissional = relationship("User", back_populates="atendimentos")
