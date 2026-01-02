from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from requests.exceptions import RequestException
import base64
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración Green API
ID_INSTANCE = os.getenv("ID_INSTANCE", "7105451115")
API_TOKEN = os.getenv("API_TOKEN", "fa2e670b70be427eba9fef6aca111afb4cbcfd442b4a4238b5")
BASE_URL = f"https://api.greenapi.com/waInstance{ID_INSTANCE}"

def check_instance_status():
    """Verifica el estado de la instancia de WhatsApp"""
    try:
        response = requests.get(
            f"{BASE_URL}/getStateInstance/{API_TOKEN}",
            timeout=5  # Reducido a 5 segundos para verificación rápida
        )
        response.raise_for_status()
        data = response.json()
        
        if data.get("stateInstance") != "authorized":
            return False, "WhatsApp no está autorizado. Por favor, escanee el código QR en Green API."
        if data.get("statusInstance") != "online":
            return False, "WhatsApp no está en línea. Por favor, verifique su conexión."
        
        return True, "Conectado"
    except requests.Timeout:
        return False, "Tiempo de espera agotado al conectar con Green API. Por favor, inténtelo de nuevo."
    except requests.ConnectionError:
        return False, "Error de conexión con Green API. Verifique su conexión a internet."
    except RequestException as e:
        return False, f"Error de conexión con Green API: {str(e)}"

@app.get("/status")
async def get_status():
    """Endpoint para verificar el estado de la conexión"""
    try:
        is_connected, message = check_instance_status()
        return {"isConnected": is_connected, "message": message}
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail="Error al verificar el estado del servicio"
        )

@app.post("/send-message")
async def send_message(
    phone: str = Form(...),
    message: str = Form(...),
    file: Optional[UploadFile] = None
):
    """Envía un mensaje de WhatsApp con o sin archivo adjunto"""
    try:
        # Verificar estado
        is_connected, status_message = check_instance_status()
        if not is_connected:
            raise HTTPException(status_code=503, detail=status_message)

        if file:
            # Verificar tamaño del archivo (máximo 16MB para WhatsApp)
            file_content = await file.read()
            if len(file_content) > 16 * 1024 * 1024:
                raise HTTPException(
                    status_code=400,
                    detail="El archivo excede el tamaño máximo permitido (16MB)"
                )
            
            base64_file = base64.b64encode(file_content).decode()
            
            # Enviar mensaje con archivo
            response = requests.post(
                f"{BASE_URL}/sendFileByBase64/{API_TOKEN}",
                json={
                    "chatId": f"{phone}@c.us",
                    "body": base64_file,
                    "fileName": file.filename,
                    "caption": message
                },
                timeout=30
            )
        else:
            # Enviar mensaje de texto
            response = requests.post(
                f"{BASE_URL}/SendMessage/{API_TOKEN}",
                json={
                    "chatId": f"{phone}@c.us",
                    "message": message
                },
                timeout=30
            )
        
        response.raise_for_status()
        data = response.json()
        
        if "idMessage" not in data:
            raise HTTPException(
                status_code=400,
                detail="No se recibió confirmación del envío"
            )
            
        return {"success": True, "message": "Mensaje enviado correctamente"}
        
    except requests.Timeout:
        raise HTTPException(
            status_code=504,
            detail="Tiempo de espera agotado al enviar el mensaje. Por favor, inténtelo de nuevo."
        )
    except requests.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Error de conexión con Green API. Verifique su conexión a internet."
        )
    except RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al enviar mensaje: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error inesperado: {str(e)}"
        )