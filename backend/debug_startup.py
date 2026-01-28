
import sys
import os
from dotenv import load_dotenv

# Add current directory to path
sys.path.append(os.getcwd())

print("Loading .env...")
load_dotenv()

try:
    print("Attempting to import app.main...")
    from app.main import app
    print("Successfully imported app.main!")
except Exception as e:
    print(f"FAILED to import app.main: {e}")
    import traceback
    traceback.print_exc()

try:
    print("Checking database connection...")
    from app.core.config import settings
    print(f"Database URL: {settings.DATABASE_URL.split('@')[-1]}") # Hide password
except Exception as e:
    print(f"FAILED to check config: {e}")
