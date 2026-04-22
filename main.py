from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, RedirectResponse
import models
from database import engine
from routers import category_router, product_router, mharnes_router, contact_router, sellpoints_router, allies_router, donemilio_router
from fastapi.staticfiles import StaticFiles
import os
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

# Create schema and tables in SSMS if they don't exist
with engine.connect() as connection:
    connection.execute(text("IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'wda') BEGIN EXEC('CREATE SCHEMA wda') END"))
    connection.execute(text("IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'wmh') BEGIN EXEC('CREATE SCHEMA wmh') END"))
    connection.execute(text("IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'wde') BEGIN EXEC('CREATE SCHEMA wde') END"))
    connection.execute(text("IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'cvs') BEGIN EXEC('CREATE SCHEMA cvs') END"))
    connection.commit()

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="WebApi Grupo Don Emilio")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory to serve static files
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/api/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include Routers
app.include_router(category_router.router, prefix="/api/duyamis")
app.include_router(product_router.router, prefix="/api/duyamis")
app.include_router(mharnes_router.router, prefix="/api")
app.include_router(contact_router.router, prefix="/api")
app.include_router(sellpoints_router.router, prefix="/api")
app.include_router(allies_router.router, prefix="/api")
app.include_router(donemilio_router.router, prefix="/api")

# --- HELPER PARA SERVIR SPAs ---
def serve_spa_file(directory: str, full_path: str):
    # Normalizar el path para evitar problemas con barras en Windows
    safe_path = full_path.replace("/", os.sep).strip(os.sep)
    filepath = os.path.join(directory, safe_path)
    
    if os.path.isfile(filepath):
        return FileResponse(filepath)
    
    # Si no es un archivo, devolvemos el index.html (SPA fallback)
    return FileResponse(os.path.join(directory, "index.html"))

# --- REDIRECCIONES DE BASE ---
@app.get("/mharnes", include_in_schema=False)
async def redirect_mharnes():
    return RedirectResponse(url="/mharnes/")

@app.get("/donemilio", include_in_schema=False)
async def redirect_donemilio():
    return RedirectResponse(url="/donemilio/")

@app.get("/duyamis", include_in_schema=False)
async def redirect_duyamis():
    return RedirectResponse(url="/duyamis/")

# --- SERVIDO DE APPS (PRIORIDAD ALTA) ---

# 1. Mharnes
if os.path.exists("mharnes"):
    app.mount("/mharnes/assets", StaticFiles(directory="mharnes/assets"), name="mh-assets")
    @app.get("/mharnes/{full_path:path}", include_in_schema=False)
    async def mh_catch(full_path: str):
        return serve_spa_file("mharnes", full_path)

# 2. Don Emilio
if os.path.exists("donemilio"):
    app.mount("/donemilio/assets", StaticFiles(directory="donemilio/assets"), name="de-assets")
    @app.get("/donemilio/{full_path:path}", include_in_schema=False)
    async def de_catch(full_path: str):
        return serve_spa_file("donemilio", full_path)

# 3. Duy Amis
if os.path.exists("duyamis"):
    app.mount("/duyamis/assets", StaticFiles(directory="duyamis/assets"), name="da-assets")
    if os.path.exists("duyamis/images"):
        app.mount("/duyamis/images", StaticFiles(directory="duyamis/images"), name="da-images")
    @app.get("/duyamis/{full_path:path}", include_in_schema=False)
    async def da_catch(full_path: str):
        return serve_spa_file("duyamis", full_path)

# 4. HUB (ROOT) - Debe ir al final para que no robe rutas a las otras apps
if os.path.exists("grupo-don-emilio"):
    app.mount("/assets", StaticFiles(directory="grupo-don-emilio/assets"), name="hub-assets")
    
    @app.get("/", include_in_schema=False)
    async def serve_hub_root():
        return FileResponse("grupo-don-emilio/index.html")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_hub_spa(full_path: str):
        # Evitar capturar rutas reservadas
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
            
        return serve_spa_file("grupo-don-emilio", full_path)