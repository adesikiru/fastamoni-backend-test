# Fastamoni Backend Coding Exercise

This project is a Node.js backend service built as part of the Fastamoni coding assessment.  
It exposes a RESTful API that allows users to register, authenticate, manage wallets, and make peer-to-peer donations.

The system is designed with fintech-grade considerations including atomic transactions, idempotency, and race-condition mitigation.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Nodemailer
- Artillery (Load Testing)

---

## 📌 Features

- User registration and login
- JWT-based authentication
- Wallet creation and balance management
- Secure transaction PIN
- Peer-to-peer donations
- Atomic and idempotent financial transactions
- Donation analytics (count, range, pagination)
- Thank-you email notification after 2+ donations
- Load testing with Artillery

---

## 🔐 Security Measures

- Password and PIN hashing (bcrypt)
- JWT authentication middleware
- Input validation
- MongoDB transactions for atomic operations
- Idempotency keys for financial actions
- Protection against race conditions

---

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Wallet
- `GET /api/wallet/me`
- `POST /api/funds/add`

### Transaction PIN
- `POST /api/pin/set`

### Donations
- `POST /api/donations`
- `GET /api/donations`
- `GET /api/donations/count`
- `GET /api/donations/range?from=&to=`
- `GET /api/donations/:id`

---

## 📄 Pagination

List endpoints support pagination using:

---

## 🧪 Load Testing

Load testing is implemented using Artillery.

Run:
```bash
npm run test:load


Deployment

The service is deployed on Render.

Base URL:


Setup Instructions:

git clone https://github.com/adesikiru/fastamoni-backend-test
cd fastamoni-backend-test
npm install
npm run dev
