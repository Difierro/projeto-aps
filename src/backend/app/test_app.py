import requests
import pytest
from database import init_db, SessionLocal
from models import User
from auth import hash_password
import time

BASE_URL = "http://127.0.0.1:8000"

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Cria as tabelas automaticamente antes dos testes."""
    init_db()
    time.sleep(1)  # dá tempo da API subir
    yield

@pytest.fixture
def db():
    """Sessão de banco para testes locais (não via HTTP)."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_create_admin_user(db):
    """Cria um usuário admin no banco diretamente."""
    admin = db.query(User).filter_by(email="admin@test.com").first()
    if not admin:
        admin = User(
            nome="Admin Teste",
            email="admin@test.com",
            senha_hash=hash_password("123456"),
            tipo_usuario="gerente",
            ativo=True
        )
        db.add(admin)
        db.commit()

    assert admin.id is not None

def test_login():
    """Testa o login via API e recupera o token."""
    payload = {
        "email": "admin@test.com",
        "senha": "123456"
    }

    r = requests.post(f"{BASE_URL}/auth/login", json=payload)

    assert r.status_code == 200

    data = r.json()
    assert "access_token" in data

    global TOKEN
    TOKEN = data["access_token"]

def test_create_client():
    """Cria um cliente usando o token JWT."""
    headers = {"Authorization": f"Bearer {TOKEN}"}
    payload = {
        "nome": "Cliente Teste",
        "telefone": "99999-9999",
        "preferencias": "Corte masculino"
    }

    r = requests.post(f"{BASE_URL}/clients", json=payload, headers=headers)

    assert r.status_code == 201
    data = r.json()

    assert data["nome"] == "Cliente Teste"

    global CLIENT_ID
    CLIENT_ID = data["id"]

def test_create_appointment():
    """Cria um agendamento usando o token JWT."""
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    payload = {
        "cliente_id": CLIENT_ID,
        "profissional_id": 1,
        "data_hora": "2025-01-01T14:00:00",
        "duracao_minutos": 60,
        "tipo_servico": "Corte",
        "observacoes": "Teste de agendamento"
    }

    r = requests.post(f"{BASE_URL}/appointments", json=payload, headers=headers)

    assert r.status_code == 201

    data = r.json()
    assert data["cliente_id"] == CLIENT_ID
    assert data["tipo_servico"] == "Corte"
