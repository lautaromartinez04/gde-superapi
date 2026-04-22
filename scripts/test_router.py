import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import SessionLocal
from services import category_service
import schemas

def test_router_logic():
    db = SessionLocal()
    try:
        print("Fetching categories via service...")
        categories = category_service.get_categories(db, skip=0, limit=100)
        print(f"Categories found: {len(categories)}")
        
        print("Validating against schemas.Category list...")
        # Simulating FastAPI response_model validation
        from pydantic import TypeAdapter
        from typing import List
        
        adapter = TypeAdapter(List[schemas.Category])
        try:
            adapter.validate_python(categories)
            print("List validation successful!")
        except Exception as e:
            print(f"List validation failed: {e}")
            
    except Exception as e:
        print(f"Router logic failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_router_logic()
