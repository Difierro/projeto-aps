from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import datetime
import re

class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    tipo_usuario: Optional[str] = "colaborador"
    funcao: Optional[str] = None

    @field_validator('nome')
    @classmethod
    def val_nome(cls, v):
        if len(v) > 50: raise ValueError('Nome muito longo (máx 50)')
        return v

    @field_validator('senha')
    @classmethod
    def val_senha(cls, v):
        if len(v) < 6 or len(v) > 12: raise ValueError('A senha deve ter entre 6 e 12 caracteres')
        return v

    @field_validator('funcao')
    @classmethod
    def val_funcao(cls, v):
        if v and len(v) > 40: raise ValueError('Função muito longa (máx 40)')
        return v

class UserOut(BaseModel):
    id: int
    nome: str
    email: EmailStr
    tipo_usuario: str
    funcao: Optional[str] = None
    ativo: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str
    user_role: str

class Login(BaseModel):
    email: EmailStr
    senha: str

class ClientCreate(BaseModel):
    nome: str
    telefone: Optional[str] = None
    preferencias: Optional[str] = None

    @field_validator('nome')
    @classmethod
    def val_nome(cls, v):
        if len(v) > 100: raise ValueError('Nome muito longo')
        return v

    @field_validator('preferencias')
    @classmethod
    def val_pref(cls, v):
        if v and len(v) > 50: raise ValueError('Preferências muito longas (máx 50)')
        return v

    @field_validator('telefone')
    @classmethod
    def val_tel(cls, v):
        if v and not re.match(r'^\(\d{2}\) \d{5}-\d{4}$', v):
            raise ValueError('Formato obrigatório: (XX) XXXXX-XXXX')
        return v

class ClientOut(BaseModel):
    id: int
    nome: str
    telefone: Optional[str]
    preferencias: Optional[str]
    data_cadastro: datetime.datetime
    class Config:
        from_attributes = True

class AppointmentCreate(BaseModel):
    cliente_id: int
    profissional_id: int
    data_hora: datetime.datetime
    duracao_minutos: Optional[int] = 60
    tipo_servico: Optional[str] = None
    observacoes: Optional[str] = None

    @field_validator('tipo_servico')
    @classmethod
    def val_serv(cls, v):
        if v and len(v) > 30: raise ValueError('Serviço muito longo (máx 30)')
        return v

    @field_validator('observacoes')
    @classmethod
    def val_obs(cls, v):
        if v and len(v) > 500: raise ValueError('Observação muito longa')
        return v

class AppointmentOut(BaseModel):
    id: int
    cliente_id: int
    profissional_id: int
    data_hora: datetime.datetime
    duracao_minutos: int
    tipo_servico: Optional[str]
    status: str
    valor: Optional[float]
    tipo_pagamento: Optional[str]
    observacoes: Optional[str]
    class Config:
        from_attributes = True

class ReschedulePayload(BaseModel):
    nova_data_hora: datetime.datetime
    novo_profissional_id: Optional[int] = None

class FinalizePayload(BaseModel):
    valor: float
    tipo_pagamento: str
