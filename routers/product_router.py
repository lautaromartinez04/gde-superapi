from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import schemas
from database import get_db
from services import product_service
from middlewares.api_key_auth import verify_api_key
from middlewares.jwt_bearer import JWTBearer

auth_jwt = JWTBearer()

router = APIRouter(
    prefix="/products",
    tags=["Duy Amis: Productos"]
)

@router.get("/", response_model=List[schemas.Product], dependencies=[Depends(verify_api_key)])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return product_service.get_products(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Product, dependencies=[Depends(auth_jwt)])
def create_product(
    category_id: int = Form(...),
    name: str = Form(...),
    original_id: Optional[int] = Form(None),
    quantity: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    width: Optional[str] = Form(None),
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
    image_file: Optional[UploadFile] = File(None),
    color_vaquitas_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    product_data = {
        "category_id": category_id,
        "name": name,
        "original_id": original_id,
        "quantity": quantity,
        "description": description,
        "width": width,
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
    return product_service.create_product(
        db, 
        product_data=product_data, 
        logo_file=logo_file, 
        image_file=image_file, 
        color_vaquitas_file=color_vaquitas_file
    )

@router.get("/category/{category_id}", response_model=List[schemas.Product], dependencies=[Depends(verify_api_key)])
def read_products_by_category(category_id: int, db: Session = Depends(get_db)):
    return product_service.get_products_by_category(db, category_id=category_id)

@router.get("/{product_id}", response_model=schemas.Product, dependencies=[Depends(verify_api_key)])
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = product_service.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/{product_id}", response_model=schemas.Product, dependencies=[Depends(auth_jwt)])
def update_product(
    product_id: int,
    category_id: Optional[int] = Form(None),
    original_id: Optional[int] = Form(None),
    name: Optional[str] = Form(None),
    quantity: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    width: Optional[str] = Form(None),
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
    image: Optional[str] = Form(None),
    color_vaquitas: Optional[str] = Form(None),
    logo_file: Optional[UploadFile] = File(None),
    image_file: Optional[UploadFile] = File(None),
    color_vaquitas_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    product_data = {
        "category_id": category_id, "original_id": original_id, "name": name,
        "quantity": quantity, "description": description, "width": width,
        "ingredientes": ingredientes, "venta": venta, "envasado": envasado,
        "nutri_porcion": nutri_porcion, "nutri_valor_energetico_gr": nutri_valor_energetico_gr,
        "nutri_valor_energetico_pct": nutri_valor_energetico_pct, "nutri_carbohidratos_gr": nutri_carbohidratos_gr,
        "nutri_carbohidratos_pct": nutri_carbohidratos_pct, "nutri_azucares_totales_gr": nutri_azucares_totales_gr,
        "nutri_azucares_totales_pct": nutri_azucares_totales_pct, "nutri_azucares_anadidos_gr": nutri_azucares_anadidos_gr,
        "nutri_azucares_anadidos_pct": nutri_azucares_anadidos_pct, "nutri_proteinas_gr": nutri_proteinas_gr,
        "nutri_proteinas_pct": nutri_proteinas_pct, "nutri_grasas_totales_gr": nutri_grasas_totales_gr,
        "nutri_grasas_totales_pct": nutri_grasas_totales_pct, "nutri_grasas_saturadas_gr": nutri_grasas_saturadas_gr,
        "nutri_grasas_saturadas_pct": nutri_grasas_saturadas_pct, "nutri_grasas_trans_gr": nutri_grasas_trans_gr,
        "nutri_grasas_trans_pct": nutri_grasas_trans_pct, "nutri_fibra_alimentaria_gr": nutri_fibra_alimentaria_gr,
        "nutri_fibra_alimentaria_pct": nutri_fibra_alimentaria_pct, "nutri_sodio_gr": nutri_sodio_gr,
        "nutri_sodio_pct": nutri_sodio_pct, "nutri_calcio_gr": nutri_calcio_gr,
        "nutri_calcio_pct": nutri_calcio_pct, "nutri_valores_diarios": nutri_valores_diarios,
        "color_fondo_vaquitas": color_fondo_vaquitas, "color_letras_logo": color_letras_logo,
        "color_firma": color_firma, "color_detalles": color_detalles,
        "color_fondo_letras": color_fondo_letras, "color_queso": color_queso,
        "color_texto1": color_texto1, "color_nombreypeso": color_nombreypeso,
        "color_donemilio": color_donemilio, "color_fondologo": color_fondologo,
        "color_fondocantprod": color_fondocantprod, "color_cantprod": color_cantprod,
        "logo": logo, "image": image, "color_vaquitas": color_vaquitas
    }
    
    db_product = product_service.update_product(
        db, product_id=product_id, product_data=product_data,
        logo_file=logo_file, image_file=image_file, color_vaquitas_file=color_vaquitas_file
    )
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}", dependencies=[Depends(auth_jwt)])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    success = product_service.delete_product(db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}
