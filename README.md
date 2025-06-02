````markdown
# 🛡️ Admin Dashboard - Registration Management

This is a React-based Admin Dashboard for managing user registration submissions. It fetches data from a secured backend API and supports features like search, filters, pagination, view/edit/delete actions, and media preview.

## 🚀 Features

- 🧾 List of user registrations
- 🔍 Search by name or email
- 🗂️ Filter by state, city, and gender
- 📄 View full registration details
- ✏️ Edit selected submission fields
- 🗑️ Delete entries
- 📸 Photo & Video preview
- 🔐 Protected API access via token
- 🧭 Pagination

## 🧱 Tech Stack

- React + TypeScript
- Axios
- Lucide Icons
- CSS/SCSS or Tailwind (depending on styling used)
- Backend API (Node/Express assumed)

## 📦 Setup

### 1. Clone the repository

```bash
git clone https://github.com/kumarshivam04203/RegistrationForm_Syatem.git
cd RegistrationForm_Syatem
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

> The app should now be running on `http://localhost:5173` (or Vite default port).

## 🔐 Authentication

The dashboard expects a valid JWT token stored in `localStorage` with the key:

```js
localStorage.setItem("token", "your-jwt-token");
```

This token is sent in the `Authorization` header when making API requests:

```http
Authorization: Bearer <token>
```

## 🔗 API Endpoint

* `GET /api/registrations`
  Protected route that returns paginated registration data.

Expected response:

```json
{
  "registrations": [...],
  "totalPages": 10,
  "currentPage": 1,
  "total": 50
}
```

## 🧪 Example `.env` (if needed)

```env
VITE_API_BASE_URL=http://localhost:5000
```

Use this in your Axios config:

```ts
axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/registrations`)
```

## 📁 Folder Structure

```
src/
├── components/       # Reusable UI components
├── types/            # TypeScript interfaces
├── utils/            # Axios instance or helpers
├── App.tsx
└── main.tsx
```

## ✨ To-Do Enhancements

* ✅ Token auto-refresh
* 🔔 Toast notifications
* ⏳ Loading spinners
* 🧪 Unit tests with Jest + React Testing Library
* 🔧 Reusable modal and form components

## 📸 Preview

![Admin Dashboard Preview](https://via.placeholder.com/800x400.png?text=Admin+Dashboard+Screenshot)

## 📄 License

MIT © [Shivam Kumar](https://github.com/kumarshivam04203)

```

---

Let me know if you want me to customize it further (e.g., if you use Tailwind, add screenshots, or want deployment instructions).
```
