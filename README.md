# 🌿 Green Circle — Backend

This is the **backend** of the Green Circle sustainability platform. Built using **Node.js**, **Express.js**, and **Prisma**, it provides secure APIs for idea submission, voting, commenting, authentication, and payment integration.

## ⚙️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Payments:** ShurjoPay

## 📦 Features

- JWT-based login and session handling
- CRUD APIs for ideas, votes, comments
- Role-based access (member/admin)
- Paid idea handling with payment status
- Feedback system for rejected ideas
- Admin routes for moderation and control

## 🛠️ Setup Instructions

```bash
git https://github.com/rafioul-hasan-58/Green-Circle-Server.git
cd green-circle-backend
npm install
npx prisma migrate dev
npm run dev
```
