from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime

# Model for creating a customer
class CustomerCreate(BaseModel):
    name: str
    email: EmailStr

# Model for creating a product
class ProductCreate(BaseModel):
    name: str
    price: float

# Model for creating an order
class OrderCreate(BaseModel):
    customer_id: str  
    product_ids: List[str]  

# Model for the order response (after fetching data)
class OrderResponse(BaseModel):
    id: str 
    customer_id: str  
    products: List[ProductCreate]
    total_cost: float
    created_at: datetime  

    class Config:
        orm_mode = True
