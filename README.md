# Excursions App — JavaScript + REST API

A simple web application for managing and booking excursions.
The project consists of a **client part** (booking excursions) and an **admin panel** (CRUD management of excursions).

This project was built as a learning and portfolio project using **vanilla JavaScript**, **Fetch API**, **Webpack**, and **Tailwind CSS**.

---

## 🚀 Features

### Client
- Display list of available excursions
- Add excursions to cart
- Calculate total price (adults / children)
- Remove items from cart
- Submit order form

### Admin Panel
- Add new excursions
- Edit existing excursions
- Delete excursions
- Data persistence via REST API

---

## 🛠️ Tech Stack

- JavaScript (ES6+)
- Fetch API
- Webpack
- Babel
- Tailwind CSS
- JSON Server (mock REST API)

---

## 📂 Project Structure
src/
├─ js/
│ ├─ client.js
│ ├─ admin.js
│ └─ ExcursionsAPI.js
├─ css/
│ ├─ client.css
│ ├─ admin.css
│ └─ tailwind.css
├─ index.html
└─ admin.html

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/AlexKry96/js-api-excursion.git
cd js-api-excursion

2️⃣ Install dependencies
bash
npm install

3️⃣ Start REST API (JSON Server)

The project uses a local mock API based on db.json.


npx json-server --watch excursion.json --port 3000
API endpoints:

GET /excursions

POST /excursions

PATCH /excursions/:id

DELETE /excursions/:id

POST /orders

4️⃣ Start the development server


npm start
The application will be available at:

Client: http://localhost:8080

Admin panel: http://localhost:8080/admin.html

🧪 Development Notes
The project uses Webpack Dev Server

Tailwind CSS is integrated via PostCSS

No frameworks (React/Vue) were used — pure JavaScript

Admin and Client are built as separate entry points

👤 Author

Oleksii Krylov
GitHub: https://github.com/AlexKry96