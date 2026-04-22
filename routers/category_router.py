from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import schemas
from database import get_db
from services import category_service
from middlewares.api_key_auth import verify_api_key
from middlewares.jwt_bearer import JWTBearer

auth_jwt = JWTBearer()

router = APIRouter(
    prefix="/categories",
    tags=["Duy Amis: Categorías"]
)

@router.get("/", response_model=List[schemas.Category], dependencies=[Depends(verify_api_key)])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return category_service.get_categories(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Category, dependencies=[Depends(auth_jwt)])
def create_category(
    id: int = Form(...),
    name: str = Form(...),
    sombras: Optional[str] = Form(None),
    ingredientes: Optional[str] = Form(None),
    venta: Optional[str] = Form(None),
    envasado: Optional[str] = Form(None),
    nutri_porcion: Optional[str] = Form(None),
    nutri_valor_energetico_gr: Optional[str] = Form(None),
    nutri_valor_energetico_pct: Optional[str] = Form(None),
    nutri_carbohidratos_gr: Optional[str] = Form(None),
    nutri_carbohidratos_pct: Optional[str] = Form(None),
    nutri_azucares_totales_gr: Optional[str] = Form(None),
    nutri_azucares_totales_pct: Optional[str] = Form(None),
    nutri_azucares_anadidos_gr: Optional[str] = Form(None),
    nutri_azucares_anadidos_pct: Optional[str] = Form(None),
    nutri_proteinas_gr: Optional[str] = Form(None),
    nutri_proteinas_pct: Optional[str] = Form(None),
    nutri_grasas_totales_gr: Optional[str] = Form(None),
    nutri_grasas_totales_pct: Optional[str] = Form(None),
    nutri_grasas_saturadas_gr: Optional[str] = Form(None),
    nutri_grasas_saturadas_pct: Optional[str] = Form(None),
    nutri_grasas_trans_gr: Optional[str] = Form(None),
    nutri_grasas_trans_pct: Optional[str] = Form(None),
    nutri_fibra_alimentaria_gr: Optional[str] = Form(None),
    nutri_fibra_alimentaria_pct: Optional[str] = Form(None),
    nutri_sodio_gr: Optional[str] = Form(None),
    nutri_sodio_pct: Optional[str] = Form(None),
    nutri_calcio_gr: Optional[str] = Form(None),
    nutri_calcio_pct: Optional[str] = Form(None),
    nutri_valores_diarios: Optional[str] = Form(None),
    color_fondo_vaquitas: Optional[str] = Form(None),
    color_vaquitas: Optional[str] = Form(None),
    color_letras_logo: Optional[str] = Form(None),
    color_firma: Optional[str] = Form(None),
    color_detalles: Optional[str] = Form(None),
    color_fondo_letras: Optional[str] = Form(None),
    color_queso: Optional[str] = Form(None),
    color_texto1: Optional[str] = Form(None),
    color_nombreypeso: Optional[str] = Form(None),
    color_donemilio: Optional[str] = Form(None),
    color_fondologo: Optional[str] = Form(None),
    color_fondocantprod: Optional[str] = Form(None),
    color_cantprod: Optional[str] = Form(None),
    logo_file: Optional[UploadFile] = File(None),
    color_vaquitas_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    category_data = {
        "id": id,
        "name": name,
        "sombras": sombras,
        "ingredientes": ingredientes,
        "venta": venta,
        "envasado": envasado,
        "nutri_porcion": nutri_porcion,
        "nutri_valor_energetico_gr": nutri_valor_energetico_gr,
        "nutri_valor_energetico_pct": nutri_valor_energetico_pct,
        "nutri_carbohidratos_gr": nutri_carbohidratos_gr,
        "nutri_carbohidratos_pct": nutri_carbohidratos_pct,
        "nutri_azucares_totales_gr": nutri_azucares_totales_gr,
        "nutri_azucares_totales_pct": nutri_azucares_totales_pct,
        "nutri_azucares_anadidos_gr": nutri_azucares_anadidos_gr,
        "nutri_azucares_anadidos_pct": nutri_azucares_anadidos_pct,
        "nutri_proteinas_gr": nutri_proteinas_gr,
        "nutri_proteinas_pct": nutri_proteinas_pct,
        "nutri_grasas_totales_gr": nutri_grasas_totales_gr,
        "nutri_grasas_totales_pct": nutri_grasas_totales_pct,
        "nutri_grasas_saturadas_gr": nutri_grasas_saturadas_gr,
        "nutri_grasas_saturadas_pct": nutri_grasas_saturadas_pct,
        "nutri_grasas_trans_gr": nutri_grasas_trans_gr,
        "nutri_grasas_trans_pct": nutri_grasas_trans_pct,
        "nutri_fibra_alimentaria_gr": nutri_fibra_alimentaria_gr,
        "nutri_fibra_alimentaria_pct": nutri_fibra_alimentaria_pct,
        "nutri_sodio_gr": nutri_sodio_gr,
        "nutri_sodio_pct": nutri_sodio_pct,
        "nutri_calcio_gr": nutri_calcio_gr,
        "nutri_calcio_pct": nutri_calcio_pct,
        "nutri_valores_diarios": nutri_valores_diarios,
        "color_fondo_vaquitas": color_fondo_vaquitas,
        "color_vaquitas": color_vaquitas,
        "color_letras_logo": color_letras_logo,
        "color_firma": color_firma,
        "color_detalles": color_detalles,
        "color_fondo_letras": color_fondo_letras,
        "color_queso": color_queso,
        "color_texto1": color_texto1,
        "color_nombreypeso": color_nombreypeso,
        "color_donemilio": color_donemilio,
        "color_fondologo": color_fondologo,
        "color_fondocantprod": color_fondocantprod,
        "color_cantprod": color_cantprod,
    }
    return category_service.create_category(
        db, 
        category_data=category_data, 
        logo_file=logo_file, 
        color_vaquitas_file=color_vaquitas_file
    )

@router.get("/{category_id}", response_model=schemas.Category, dependencies=[Depends(verify_api_key)])
def read_category(category_id: int, db: Session = Depends(get_db)):
    db_category = category_service.get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.put("/{category_id}", response_model=schemas.Category, dependencies=[Depends(auth_jwt)])
def update_category(
    category_id: int,
    name: Optional[str] = Form(None),
    sombras: Optional[str] = Form(None),
    ingredientes: Optional[str] = Form(None),
    venta: Optional[str] = Form(None),
    envasado: Optional[str] = Form(None),
    nutri_porcion: Optional[str] = Form(None),
    nutri_valor_energetico_gr: Optional[str] = Form(None),
    nutri_valor_energetico_pct: Optional[str] = Form(None),
    nutri_carbohidratos_gr: Optional[str] = Form(None),
    nutri_carbohidratos_pct: Optional[str] = Form(None),
    nutri_azucares_totales_gr: Optional[str] = Form(None),
    nutri_azucares_totales_pct: Optional[str] = Form(None),
    nutri_azucares_anadidos_gr: Optional[str] = Form(None),
    nutri_azucares_anadidos_pct: Optional[str] = Form(None),
    nutri_proteinas_gr: Optional[str] = Form(None),
    nutri_proteinas_pct: Optional[str] = Form(None),
    nutri_grasas_totales_gr: Optional[str] = Form(None),
    nutri_grasas_totales_pct: Optional[str] = Form(None),
    nutri_grasas_saturadas_gr: Optional[str] = Form(None),
    nutri_grasas_saturadas_pct: Optional[str] = Form(None),
    nutri_grasas_trans_gr: Optional[str] = Form(None),
    nutri_grasas_trans_pct: Optional[str] = Form(None),
    nutri_fibra_alimentaria_gr: Optional[str] = Form(None),
    nutri_fibra_alimentaria_pct: Optional[str] = Form(None),
    nutri_sodio_gr: Optional[str] = Form(None),
    nutri_sodio_pct: Optional[str] = Form(None),
    nutri_calcio_gr: Optional[str] = Form(None),
    nutri_calcio_pct: Optional[str] = Form(None),
    nutri_valores_diarios: Optional[str] = Form(None),
    color_fondo_vaquitas: Optional[str] = Form(None),
    color_letras_logo: Optional[str] = Form(None),
    color_firma: Optional[str] = Form(None),
    color_detalles: Optional[str] = Form(None),
    color_fondo_letras: Optional[str] = Form(None),
    color_queso: Optional[str] = Form(None),
    color_texto1: Optional[str] = Form(None),
    color_nombreypeso: Optional[str] = Form(None),
    color_donemilio: Optional[str] = Form(None),
    color_fondologo: Optional[str] = Form(None),
    color_fondocantprod: Optional[str] = Form(None),
    color_cantprod: Optional[str] = Form(None),
    logo: Optional[str] = Form(None),
    color_vaquitas: Optional[str] = Form(None),
    logo_file: Optional[UploadFile] = File(None),
    color_vaquitas_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    category_data = {
        "name": name, "sombras": sombras, "ingredientes": ingredientes,
        "venta": venta, "envasado": envasado, "nutri_porcion": nutri_porcion,
        "nutri_valor_energetico_gr": nutri_valor_energetico_gr, "nutri_valor_energetico_pct": nutri_valor_energetico_pct,
        "nutri_carbohidratos_gr": nutri_carbohidratos_gr, "nutri_carbohidratos_pct": nutri_carbohidratos_pct,
        "nutri_azucares_totales_gr": nutri_azucares_totales_gr, "nutri_azucares_totales_pct": nutri_azucares_totales_pct,
        "nutri_azucares_anadidos_gr": nutri_azucares_anadidos_gr, "nutri_azucares_anadidos_pct": nutri_azucares_anadidos_pct,
        "nutri_proteinas_gr": nutri_proteinas_gr, "nutri_proteinas_pct": nutri_proteinas_pct,
        "nutri_grasas_totales_gr": nutri_grasas_totales_gr, "nutri_grasas_totales_pct": nutri_grasas_totales_pct,
        "nutri_grasas_saturadas_gr": nutri_grasas_saturadas_gr, "nutri_grasas_saturadas_pct": nutri_grasas_saturadas_pct,
        "nutri_grasas_trans_gr": nutri_grasas_trans_gr, "nutri_grasas_trans_pct": nutri_grasas_trans_pct,
        "nutri_fibra_alimentaria_gr": nutri_fibra_alimentaria_gr, "nutri_fibra_alimentaria_pct": nutri_fibra_alimentaria_pct,
        "nutri_sodio_gr": nutri_sodio_gr, "nutri_sodio_pct": nutri_sodio_pct,
        "nutri_calcio_gr": nutri_calcio_gr, "nutri_calcio_pct": nutri_calcio_pct,
        "nutri_valores_diarios": nutri_valores_diarios, "color_fondo_vaquitas": color_fondo_vaquitas,
        "color_letras_logo": color_letras_logo, "color_firma": color_firma,
        "color_detalles": color_detalles, "color_fondo_letras": color_fondo_letras,
        "color_queso": color_queso, "color_texto1": color_texto1,
        "color_nombreypeso": color_nombreypeso, "color_donemilio": color_donemilio,
        "color_fondologo": color_fondologo, "color_fondocantprod": color_fondocantprod,
        "color_cantprod": color_cantprod, "logo": logo, "color_vaquitas": color_vaquitas
    }
    
    db_category = category_service.update_category(
        db, category_id=category_id, category_data=category_data,
        logo_file=logo_file, color_vaquitas_file=color_vaquitas_file
    )
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.delete("/{category_id}", dependencies=[Depends(auth_jwt)])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    success = category_service.delete_category(db, category_id=category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}
