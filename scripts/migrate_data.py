import json
import os
import sys

# Add parent directory to path to import database and models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine
import models

def migrate():
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "DuyAmis", "src", "data", "data.json")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    db = SessionLocal()
    try:
        for cat_data in data.get("Categories", []):
            # Map Category
            nutri = cat_data.get("informacion nutricional", [{}])[0]
            colors = cat_data.get("colors", [{}])[0]
            
            db_category = models.Category(
                id=cat_data.get("id"),
                name=cat_data.get("name"),
                # Images are skipped for now as per user request
                logo=None,
                sombras=cat_data.get("sombras"),
                ingredientes=cat_data.get("ingredientes"),
                venta=cat_data.get("venta"),
                envasado=cat_data.get("Envasado"),
                nutri_porcion=nutri.get("porción"),
                nutri_valor_energetico_gr=nutri.get("Valor Energético gr"),
                nutri_valor_energetico_pct=nutri.get("Valor Energético %"),
                nutri_carbohidratos_gr=nutri.get("Carbohidratos gr"),
                nutri_carbohidratos_pct=nutri.get("Carbohidratos %"),
                nutri_azucares_totales_gr=nutri.get("Azúcares Totales gr"),
                nutri_azucares_totales_pct=nutri.get("Azúcares Totales %"),
                nutri_azucares_anadidos_gr=nutri.get("Azúcares Añadidos gr"),
                nutri_azucares_anadidos_pct=nutri.get("Azúcares Añadidos %"),
                nutri_proteinas_gr=nutri.get("Proteínas gr"),
                nutri_proteinas_pct=nutri.get("Proteínas %"),
                nutri_grasas_totales_gr=nutri.get("Grasas Totales gr"),
                nutri_grasas_totales_pct=nutri.get("Grasas Totales %"),
                nutri_grasas_saturadas_gr=nutri.get("Grasas Saturadas gr"),
                nutri_grasas_saturadas_pct=nutri.get("Grasas Saturadas %"),
                nutri_grasas_trans_gr=nutri.get("Grasas Trans gr"),
                nutri_grasas_trans_pct=nutri.get("Grasas Trans %"),
                nutri_fibra_alimentaria_gr=nutri.get("Fibra Alimentaria gr"),
                nutri_fibra_alimentaria_pct=nutri.get("Fibra Alimentaria %"),
                nutri_sodio_gr=nutri.get("Sodio gr"),
                nutri_sodio_pct=nutri.get("Sodio %"),
                nutri_valores_diarios=nutri.get("valores diarios"),
                color_fondo_vaquitas=colors.get("FondoVaquitas"),
                color_vaquitas=None, # User will upload
                color_letras_logo=colors.get("LetrasLogo"),
                color_firma=colors.get("Firma"),
                color_detalles=colors.get("Detalles"),
                color_fondo_letras=colors.get("FondoLetras"),
                color_queso=colors.get("Queso"),
                color_texto1=colors.get("texto1"),
                color_nombreypeso=colors.get("nombreypeso"),
                color_donemilio=colors.get("donemilio"),
                color_fondologo=colors.get("fondologo"),
                color_fondocantprod=colors.get("fondocantprod"),
                color_cantprod=colors.get("cantprod")
            )
            
            # Use merge to handle existing IDs
            db.merge(db_category)
            db.flush() # Flush to ensure category exists before products

            # Map Products
            for prod_data in cat_data.get("products", []):
                prod_nutri = prod_data.get("informacion nutricional", [{}])[0]
                
                db_product = models.Product(
                    category_id=db_category.id,
                    original_id=prod_data.get("id"),
                    name=prod_data.get("name"),
                    quantity=prod_data.get("quantity"),
                    logo=None,
                    image=None,
                    description=prod_data.get("description"),
                    width=prod_data.get("width"),
                    ingredientes=prod_data.get("ingredientes"),
                    venta=prod_data.get("venta"),
                    envasado=prod_data.get("Envasado"),
                    nutri_porcion=prod_nutri.get("porción"),
                    nutri_valor_energetico_gr=prod_nutri.get("Valor Energético gr"),
                    nutri_valor_energetico_pct=prod_nutri.get("Valor Energético %"),
                    nutri_carbohidratos_gr=prod_nutri.get("Carbohidratos gr"),
                    nutri_carbohidratos_pct=prod_nutri.get("Carbohidratos %"),
                    nutri_azucares_totales_gr=prod_nutri.get("Azúcares Totales gr"),
                    nutri_azucares_totales_pct=prod_nutri.get("Azúcares Totales %"),
                    nutri_azucares_anadidos_gr=prod_nutri.get("Azúcares Añadidos gr"),
                    nutri_azucares_anadidos_pct=prod_nutri.get("Azúcares Añadidos %"),
                    nutri_proteinas_gr=prod_nutri.get("Proteínas gr"),
                    nutri_proteinas_pct=prod_nutri.get("Proteínas %"),
                    nutri_grasas_totales_gr=prod_nutri.get("Grasas Totales gr"),
                    nutri_grasas_totales_pct=prod_nutri.get("Grasas Totales %"),
                    nutri_grasas_saturadas_gr=prod_nutri.get("Grasas Saturadas gr"),
                    nutri_grasas_saturadas_pct=prod_nutri.get("Grasas Saturadas %"),
                    nutri_grasas_trans_gr=prod_nutri.get("Grasas Trans gr"),
                    nutri_grasas_trans_pct=prod_nutri.get("Grasas Trans %"),
                    nutri_fibra_alimentaria_gr=prod_nutri.get("Fibra Alimentaria gr"),
                    nutri_fibra_alimentaria_pct=prod_nutri.get("Fibra Alimentaria %"),
                    nutri_sodio_gr=prod_nutri.get("Sodio gr"),
                    nutri_sodio_pct=prod_nutri.get("Sodio %"),
                    nutri_calcio_gr=prod_nutri.get("Calcio gr"),
                    nutri_calcio_pct=prod_nutri.get("Calcio %"),
                    nutri_valores_diarios=prod_nutri.get("valores diarios"),
                    color_fondo_vaquitas=None,
                    color_vaquitas=None
                )
                db.add(db_product)
        
        db.commit()
        print("Migration completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during migration: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
