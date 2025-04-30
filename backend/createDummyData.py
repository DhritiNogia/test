from firebase import db

# Function to create dummy customers
def create_dummy_customers():
    customers_ref = db.collection('customers')
    
    customers = [
        {"id": "user1", "name": "John Doe", "email": "john.doe@example.com"},
        {"id": "user2", "name": "Jane Smith", "email": "jane.smith@example.com"},
        {"id": "user3", "name": "Alex Johnson", "email": "alex.johnson@example.com"}
    ]
    
    for customer in customers:
        customers_ref.document(customer['id']).set({
            "name": customer["name"],
            "email": customer["email"]
        })
        print(f"Created customer with ID: {customer['id']}")

# Function to create dummy products
def create_dummy_products():
    products_ref = db.collection('products')

    # Dummy products data
    products = [
        {"id": "prod1", "name": "Product 1", "price": 50},
        {"id": "prod2", "name": "Product 2", "price": 150},
        {"id": "prod3", "name": "Product 3", "price": 20}
    ]

    for product in products:
        doc_ref = products_ref.document(product['id'])
        doc_ref.set(product)
        print(f"Created product with ID: {product['id']}")

def create_dummy_orders():
    orders_ref = db.collection('orders')
    
    # Assuming the customer and product IDs from the previous steps
    customer_ids = ["user1", "user2", "user3"]
    product_ids = [["prod1", "prod2"], ["prod3"], ["prod2", "prod3"]]
    total_costs = [200, 20, 170]

    for i in range(3):
        order_id = f"order{i+1}"  # Creates order1, order2, order3
        order_data = {
            "customer_id": customer_ids[i],
            "product_ids": product_ids[i],
            "total_cost": total_costs[i]
        }
        doc_ref, _ = orders_ref.add(order_data)
      
        print(f"Created order with ID: {doc_ref.id}")


# Run the functions to create the dummy data
create_dummy_customers()
create_dummy_products()
create_dummy_orders()
