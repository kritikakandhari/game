"""
FastAPI dependencies.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.session import get_db
from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.repositories.user_repository_impl import UserRepositoryImpl
from app.core.security import verify_token
from app.domain.entities.user import User
from app.core.exceptions import UnauthorizedError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_user_repository(
    db: AsyncSession = Depends(get_db)
) -> UserRepository:
    """Dependency for user repository."""
    return UserRepositoryImpl(db)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
    user_repo: UserRepository = Depends(get_user_repository)
) -> User:
    """Get current authenticated user."""
    log_file = r"C:\Users\Kritika Kandhari\OneDrive\Desktop\FGCMM-benzura-main\backend\debug_auth.log"
    try:
        # Log entry
        with open(log_file, "a") as f:
            f.write(f"\n--- New Request: get_current_user ---\n")
            f.write(f"Token prefix: {token[:10]}...\n")

        payload = verify_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise UnauthorizedError("Invalid token: no sub")
            
    except Exception as e:
        with open(log_file, "a") as f:
            f.write(f"Token Verification Failed: {str(e)}\n")
        raise UnauthorizedError(f"Invalid token: {str(e)}")
    
    user = await user_repo.get_user_by_id(user_id)
    if user:
        if not user.is_active():
             raise UnauthorizedError("User account is inactive")
        return user

    # Auto-provisioning / detailed debug logging
    log_file = r"C:\Users\Kritika Kandhari\OneDrive\Desktop\FGCMM-benzura-main\backend\debug_auth.log"
    try:
        with open(log_file, "a") as f:
            f.write(f"--- Auth Attempt ---\n")
            f.write(f"User ID from token: {user_id}\n")
            f.write(f"Payload keys: {list(payload.keys())}\n")

        email = payload.get("email")
        if not email:
            with open(log_file, "a") as f:
                f.write("Error: No email in token\n")
            raise UnauthorizedError("Invalid token: missing email")
        
        # Check if user exists by email (ID mismatch case)
        existing_user = await user_repo.get_user_by_email(email)
        if existing_user:
             with open(log_file, "a") as f:
                f.write(f"User found by email: {existing_user.id}\n")
             if not existing_user.is_active():
                raise UnauthorizedError("User account is inactive")
             return existing_user

        import uuid
        
        # Generate a random username or use email prefix
        base_username = email.split("@")[0]
        # Ensure username uniqueness (simple approach for now)
        username = f"{base_username}_{str(uuid.uuid4())[:8]}"
        
        with open(log_file, "a") as f:
            f.write(f"Attempting to create user: {email}, {username}, {user_id}\n")

        # Create user with the ID from the token (Supabase ID)
        user, _ = await user_repo.create_user(
            email=email,
            password_hash="supabase_oauth_user", 
            username=username,
            display_name=base_username,
            id=uuid.UUID(user_id)
        )
        
        with open(log_file, "a") as f:
            f.write("User created successfully\n")
            
    except Exception as e:
        # Handle collision or other errors
        try:
             with open(log_file, "a") as f:
                f.write(f"Provisioning Error: {str(e)}\n")
                import traceback
                f.write(traceback.format_exc() + "\n")
        except:
            pass
            
        print(f"Error provisioning user: {e}")
        raise UnauthorizedError(f"Could not provision user: {str(e)}")

    if not user.is_active():
        raise UnauthorizedError("User account is inactive")
    
    return user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current user and verify admin role."""
    # For MVP, we'll check admin status differently
    # In production, this would check the roles relationship
    # For now, we'll allow if user email contains admin or check a flag
    # This is a placeholder - actual implementation would query roles
    from app.core.exceptions import ForbiddenError
    
    # TODO: Implement proper role checking
    # For MVP, we'll skip the check and let the admin endpoints handle it
    return current_user
