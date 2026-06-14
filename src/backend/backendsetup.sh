#!/bin/bash
set -e

sudo apt update && apt upgrade -y && \
sudo apt install -y python3 python3-pip python3-venv git

cd SistemaSalaoDeBeleza/backend/app

echo "criando e ativando venv"
python3 -m venv venv

source venv/bin/activate

echo "instalando requirements"
pip install -r ../requirements.txt

echo "execução da API"
uvicorn main:app --reload