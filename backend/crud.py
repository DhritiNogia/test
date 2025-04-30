from .firebase import db
import backend.schema as schema
from fastapi import HTTPException
from firebase_admin import firestore

def create_customer(customer: schema.CustomerCreate):
    customers_ref = db.collection('customers')
    doc = customers_ref.add(customer.model_dump())  
    return {"id": doc.id, **customer.model_dump()}

def create_product(product: schema.ProductCreate):
    products_ref = db.collection('products')
    doc = products_ref.document()
    doc.set(product.model_dump())
    return {"id": doc.id, **product.model_dump()}

def create_order(order: schema.OrderCreate):
    # Verify customer exists
    customer_ref = db.collection('customers').document(order.customer_id)
    if not customer_ref.get().exists:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Verify products exist
    valid_product_ids = []
    total_cost = 0
    for pid in order.product_ids:
        prod_ref = db.collection('products').document(pid)
        prod = prod_ref.get()
        if not prod.exists:
            raise HTTPException(status_code=404, detail=f"Product ID {pid} not found")
        valid_product_ids.append(pid)
        total_cost += prod.to_dict()['price']

    orders_ref = db.collection('orders')
    doc = orders_ref.document()
    order_data = {
        "customer_id": order.customer_id,
        "product_ids": valid_product_ids,
        "total_cost": total_cost,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    doc.set(order_data)
    return {"id": doc.id, **order_data}

def get_order(order_id: str):
    order_ref = db.collection('orders').document(order_id)
    order = order_ref.get()
    if not order.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order_data = order.to_dict()
    # Fetch product details
    products = []
    for pid in order_data['product_ids']:
        prod_ref = db.collection('products').document(pid)
        prod = prod_ref.get()
        if prod.exists:
            products.append(prod.to_dict())

    return {
        "id": order_id,
        "customer_id": order_data['customer_id'],
        "products": products,
        "total_cost": order_data['total_cost'],
        "created_at": order_data['created_at']
    }
