from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    category_id: int
    original_id: Optional[int] = None
    name: str
    logo: Optional[str] = None
    quantity: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    width: Optional[str] = None
    ingredientes: Optional[str] = None
    venta: Optional[str] = None
    envasado: Optional[str] = None
    nutri_porcion: Optional[str] = None
    nutri_valor_energetico_gr: Optional[str] = None
    nutri_valor_energetico_pct: Optional[str] = None
    nutri_carbohidratos_gr: Optional[str] = None
    nutri_carbohidratos_pct: Optional[str] = None
    nutri_azucares_totales_gr: Optional[str] = None
    nutri_azucares_totales_pct: Optional[str] = None
    nutri_azucares_anadidos_gr: Optional[str] = None
    nutri_azucares_anadidos_pct: Optional[str] = None
    nutri_proteinas_gr: Optional[str] = None
    nutri_proteinas_pct: Optional[str] = None
    nutri_grasas_totales_gr: Optional[str] = None
    nutri_grasas_totales_pct: Optional[str] = None
    nutri_grasas_saturadas_gr: Optional[str] = None
    nutri_grasas_saturadas_pct: Optional[str] = None
    nutri_grasas_trans_gr: Optional[str] = None
    nutri_grasas_trans_pct: Optional[str] = None
    nutri_fibra_alimentaria_gr: Optional[str] = None
    nutri_fibra_alimentaria_pct: Optional[str] = None
    nutri_sodio_gr: Optional[str] = None
    nutri_sodio_pct: Optional[str] = None
    nutri_calcio_gr: Optional[str] = None
    nutri_calcio_pct: Optional[str] = None
    nutri_valores_diarios: Optional[str] = None
    color_fondo_vaquitas: Optional[str] = None
    color_vaquitas: Optional[str] = None
    color_letras_logo: Optional[str] = None
    color_firma: Optional[str] = None
    color_detalles: Optional[str] = None
    color_fondo_letras: Optional[str] = None
    color_queso: Optional[str] = None
    color_texto1: Optional[str] = None
    color_nombreypeso: Optional[str] = None
    color_donemilio: Optional[str] = None
    color_fondologo: Optional[str] = None
    color_fondocantprod: Optional[str] = None
    color_cantprod: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    original_id: Optional[int] = None
    name: Optional[str] = None
    logo: Optional[str] = None
    quantity: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    width: Optional[str] = None
    ingredientes: Optional[str] = None
    venta: Optional[str] = None
    envasado: Optional[str] = None
    nutri_porcion: Optional[str] = None
    nutri_valor_energetico_gr: Optional[str] = None
    nutri_valor_energetico_pct: Optional[str] = None
    nutri_carbohidratos_gr: Optional[str] = None
    nutri_carbohidratos_pct: Optional[str] = None
    nutri_azucares_totales_gr: Optional[str] = None
    nutri_azucares_totales_pct: Optional[str] = None
    nutri_azucares_anadidos_gr: Optional[str] = None
    nutri_azucares_anadidos_pct: Optional[str] = None
    nutri_proteinas_gr: Optional[str] = None
    nutri_proteinas_pct: Optional[str] = None
    nutri_grasas_totales_gr: Optional[str] = None
    nutri_grasas_totales_pct: Optional[str] = None
    nutri_grasas_saturadas_gr: Optional[str] = None
    nutri_grasas_saturadas_pct: Optional[str] = None
    nutri_grasas_trans_gr: Optional[str] = None
    nutri_grasas_trans_pct: Optional[str] = None
    nutri_fibra_alimentaria_gr: Optional[str] = None
    nutri_fibra_alimentaria_pct: Optional[str] = None
    nutri_sodio_gr: Optional[str] = None
    nutri_sodio_pct: Optional[str] = None
    nutri_calcio_gr: Optional[str] = None
    nutri_calcio_pct: Optional[str] = None
    nutri_valores_diarios: Optional[str] = None
    color_fondo_vaquitas: Optional[str] = None
    color_vaquitas: Optional[str] = None
    color_letras_logo: Optional[str] = None
    color_firma: Optional[str] = None
    color_detalles: Optional[str] = None
    color_fondo_letras: Optional[str] = None
    color_queso: Optional[str] = None
    color_texto1: Optional[str] = None
    color_nombreypeso: Optional[str] = None
    color_donemilio: Optional[str] = None
    color_fondologo: Optional[str] = None
    color_fondocantprod: Optional[str] = None
    color_cantprod: Optional[str] = None

class Product(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
