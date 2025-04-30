from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
from typing import List
from uuid import uuid4
import firebase_admin
from firebase_admin import firestore
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Initialize Firebase Admin
firebase_admin.initialize_app()
db = firestore.client()

# Create FastAPI app
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://brahmaaimock.web.app"],  # Your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Customer(BaseModel):
    name: str
    email: EmailStr

class Product(BaseModel):
    name: str
    price: float = Field(..., gt=0, description="Price must be greater than 0")

class OrderCreate(BaseModel):
    customer_id: str
    product_ids: List[str]

class Order(BaseModel):
    id: str
    customer: dict
    products: List[dict]
    total_cost: float

# Routes

# Create Customer
@app.post("/customers/")
def create_customer(customer: Customer):
    customer_ref = db.collection('customers').document()
    customer_ref.set(customer.dict())
    return {"id": customer_ref.id, "message": "Customer created successfully"}

# Create Product
@app.post("/products/")
def create_product(product: Product):
    product_ref = db.collection('products').document()
    product_ref.set(product.dict())
    return {"id": product_ref.id, "message": "Product created successfully"}

# Create Order (No timestamp!)
@app.post("/orders/")
def create_order(order_data: OrderCreate):
    # Check customer
    customer_ref = db.collection('customers').document(order_data.customer_id)
    customer = customer_ref.get()
    if not customer.exists:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Check products
    if not order_data.product_ids:
        raise HTTPException(status_code=400, detail="Product list cannot be empty")

    products = []
    total = 0.0
    for pid in order_data.product_ids:
        product_ref = db.collection('products').document(pid)
        product = product_ref.get()
        if not product.exists:
            raise HTTPException(status_code=404, detail=f"Product with ID {pid} not found")
        product_data = product.to_dict()
        products.append(product_data)
        total += product_data['price']

    # Create order
    order_id = str(uuid4())
    order_data_full = {
        "customer_id": order_data.customer_id,
        "product_ids": order_data.product_ids,
        "total_cost": total,
    }
    db.collection('orders').document(order_id).set(order_data_full)

    return {"id": order_id, "message": "Order created successfully"}

# Get Single Order
@app.get("/orders/{order_id}", response_model=Order)
def get_order(order_id: str):
    order_ref = db.collection('orders').document(order_id)
    order = order_ref.get()
    if not order.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order_data = order.to_dict()

    # Fetch customer
    customer = db.collection('customers').document(order_data["customer_id"]).get().to_dict()

    # Fetch products
    products = []
    for pid in order_data["product_ids"]:
        product = db.collection('products').document(pid).get()
        if product.exists:
            products.append(product.to_dict())

    return Order(
        id=order_id,
        customer=customer,
        products=products,
        total_cost=order_data["total_cost"]
    )

# List all Customers
@app.get("/customers/")
def list_customers():
    customers = db.collection('customers').stream()
    return [{**cust.to_dict(), "id": cust.id} for cust in customers]

# List all Products
@app.get("/products/")
def list_products():
    products = db.collection('products').stream()
    return [{**prod.to_dict(), "id": prod.id} for prod in products]

# List all Orders
@app.get("/orders/")
def list_orders():
    orders = db.collection('orders').stream()
    return [{**ord.to_dict(), "id": ord.id} for ord in orders]

# (Optional) Run server locally
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
