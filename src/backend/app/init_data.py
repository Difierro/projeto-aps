from database import init_db, SessionLocal
from models import User
from auth import hash_password

try:
    print("Criando tabelas e banco de dados...")
    init_db()
    
    db = SessionLocal()
    email = "admin@test.com"
    if not db.query(User).filter_by(email=email).first():
        print(f"Criando usuário {email}...")
        senha = hash_password("123456")
        admin = User(nome="Admin", email=email, senha_hash=senha, tipo_usuario="gerente")
        db.add(admin)
        db.commit()
        print(">>> SUCESSO: Usuário admin@test.com criado! <<<")
    else:
        print(">>> Usuário Admin já existe. <<<")
except Exception as e:
    print(f"Erro ao inicializar: {e}")
