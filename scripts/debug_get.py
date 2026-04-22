import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import SessionLocal
import models
import schemas

def test_fetch():
    db = SessionLocal()
    try:
        categories = db.query(models.Category).all()
        print(f"Total Categories: {len(categories)}")
        for category in categories:
            try:
                schemas.Category.from_orm(category)
            except Exception as e:
                print(f"Serialization failed for Category ID {category.id}: {e}")
        
        products = db.query(models.Product).all()
        print(f"Total Products: {len(products)}")
        for product in products:
            try:
                schemas.Product.from_orm(product)
            except Exception as e:
                print(f"Serialization failed for Product ID {product.id}, Name {product.name}: {e}")
                # Print fields to see which one is problematic
                # for field in schemas.Product.__fields__:
                #    print(f"{field}: {getattr(product, field)}")
            
    except Exception as e:
        print(f"Database query failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_fetch()
