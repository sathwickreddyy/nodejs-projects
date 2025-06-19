
# Requirements

- Users sends a requests with orderId and system should fetch the amount from the db and redirect to the payment gateway
- On Success, user should receive a success message then they can verify the payment
- On Failure, user should receive a failure message then they can try again

> For the sake of simplicity, not including authentication of users.

# DB Design

```
Orders {
    _id: string, // auto generated (create index on this field)
    userId: string,  (create index on this field) & foreign key
    productIds: [string], // create index on this field
    totalAmount: number, // to avoid recalculating this
    paymentId: string, // response from payment gateway (create index on this field)
    shippingAddress: string,
    billingAddress: string,
    status: string [Payment Pending, Order Placed, Order Shipped, Order Delivered, Failed]
}

Products {
    _id: string, // auto generated
    name: string,
    description: string,
    price: number,
    imageUrl: string,
    quantity: number,
    providerId: string (foreign key & create index on this field)
}

Users {
    _id: string, // auto generated
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    password: string,
    photoUrl: string
    skills: [string],
    location: string,
    gender: string,
    about: string
    cart: {
        products: Products, (pre-populate or pass the Id's')
    }
}

PaymentRequest {
    paymentId: string,
    gatewayTransactionId: string, // Different from paymentId
    orderId: string, (foreign key & create index on this field) 
    amount: number,
    currency: string, // USD, INR, EUR
    paymentMode: [string],
    status: string // success or failure or pending
}
```

# API Design

## Auth Router

1. POST /signup
```
{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    gender: string,
}
```
## Profile Router

1. GET /profile/view   /:userId (But Generally userId can be fetched from authentication token)
   - 200 - Success
   - 400 - Invalid request (userId doesn't exist)
   - 401 - Unauthorized (authentication failed)
   - 500 - Internal Server Error

2. PATCH /profile/edit   /:userId (But Generally userId can be fetched from authentication token)
3. PATCH /profile/password   /:userId (But Generally userId can be fetched from authentication token)

## Users Router

1. GET /users/:userId/orders
2. PATCH /users/cart/:requestType (of currentUser)
   - RequestType can be
        - add
        - remove
        - clear

## Orders Router

1. POST /orders
```
{
    userId: string,
    productIds: [string],
}
```
2. GET /orders/:orderId

## Payment Router

1. POST /payments
```
{
    orderId: string,
    amount: number,
    currency: string,
    returnUrl: string, // Success redirect URL
    cancelUrl: string, // Failure redirect URL
    webhookUrl: string, // For payment gateway callbacks
}
```
2. GET /payments/:paymentId/status
3. POST /payments/webhook // Webhook endpoint for payment gateway callbacks
```
{
    paymentId: string,
    status: string,
    gatewayTransactionId: string,
    signature: string // For webhook verification
}
```
4. POST /payments/:paymentId/cancel // Payment cancellation endpoint
5. POST /payments/:paymentId/retry // Payment retry endpoint
