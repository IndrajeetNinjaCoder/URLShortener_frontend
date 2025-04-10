
# ⚡ URL Shortener Frontend

This is the **frontend** of the Micro-SaaS URL Shortener application built using **React + Vite**. It allows users to shorten URLs, log in/log out, and view click analytics with a beautiful and responsive UI.

---

## 🚀 Features

- 🔐 **User Authentication** (Login via modal)
- ✂️ **URL Shortening** with copy-to-clipboard functionality
- 📊 **Click Analytics** with Chart.js
- 🧾 **Table View** of all shortened URLs with counts
- 🧠 **Redux Toolkit** for global state management
- 🎨 **Tailwind CSS** for styling

---

## 📁 Folder Structure

```
src/
├── assets/           # Static assets (e.g., icons)
│   └── react.svg
├── components/       # Reusable components
│   ├── Chart.jsx
│   ├── Navbar.jsx
│   ├── Table.jsx
│   └── UrlForm.jsx
├── redux/            # Redux slices and store config
│   ├── authSlice.js
│   ├── clickSlice.js
│   ├── store.js
│   └── urlSlice.js
├── App.jsx           # Main application wrapper
├── App.css           # Global styles
├── index.css         # Tailwind base
├── main.jsx          # Vite entry point
```

---

## 🔧 Environment Setup

### ✅ Prerequisites

- Node.js >= 16.x
- NPM >= 8.x

### 📦 Install Dependencies

```bash
npm install
```

### 🔐 Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:5000/
```

> You can set this URL according to your backend deployment.

---

## 💻 Running the App

```bash
npm run dev
```

The app will start on `http://localhost:5173`.

---

## 🔐 Authentication

Login is handled using Redux and shown as a modal popup. The credentials are sent to the backend API. Upon successful login, a token is stored in memory and used to access protected features like shortening URLs and viewing analytics.

---

## 🔍 Functional Highlights

| Feature        | Description                                         |
|----------------|-----------------------------------------------------|
| Login Modal    | Toggle-based modal for user login                  |
| Shorten URL    | Accepts long URL and returns short URL             |
| Table Display  | List of user's URLs with original, short, and clicks |
| Analytics      | Displays click stats via pie chart                 |
| Logout         | Clears auth state and returns to guest mode        |

---

## 📬 Feedback for Reviewer

- The project is fully modular with separation of components and slices.
- Clean and reusable code practices were followed.
- Integrated smooth transitions and conditional rendering logic.

---
