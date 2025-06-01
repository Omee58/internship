# Task 1 - Subscription Management App

This is a Node.js web application for managing user registration, login, profile updates, and subscription plans with Razorpay integration.

## ✨ Features

- ✅ User registration with OTP email verification
- 🔐 Secure login using sessions and JWT
- 🧾 View and update user profiles
- 📅 Subscription plan selection and payment via Razorpay
- 📬 Email notifications using Nodemailer
- 🗑️ Account and subscription deletion
- 🛠 Admin endpoints for cleanup

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Templating:** EJS
- **Authentication:** express-session, JWT
- **Email:** Nodemailer
- **Payments:** Razorpay

---

## 📁 Folder Structure

```
.
├── index.js
├── seedPlans.js
├── .env
├── package.json
├── config/
│   └── mongo.js
├── controllers/
│   └── user.controller.js
├── middelwares/
│   └── middelware.js
├── models/
│   ├── deletedUser.model.js
│   ├── plan.model.js
│   ├── subscription.model.js
│   └── user.model.js
├── views/
│   ├── login.ejs
│   ├── profile.ejs
│   ├── register.ejs
│   ├── subscription.ejs
│   ├── update.ejs
│   └── verifyOtp.ejs
└── test.html
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Omee58/internship.git
cd internship
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=3030
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
EMAIL_ADDRESS=your_gmail_address
EMAIL_PASS=your_gmail_app_password
RAZORPAY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_key_secret
```

### 4. Seed Subscription Plans (Optional)
```bash
node seedPlans.js
```

### 5. Run the App
```bash
node index.js
```

Then open your browser and visit: [http://localhost:3030](http://localhost:3030)

---

## 📌 Main Files

| File | Purpose |
|------|---------|
| `index.js` | App entry point and route declarations |
| `controllers/user.controller.js` | Core logic for user and subscription handling |
| `middelwares/middelware.js` | Middleware for OTP, JWT, Razorpay, and validation |
| `models/` | Mongoose models for User, Subscription, Plan, and DeletedUser |
| `views/` | EJS templates for frontend rendering |

---

## 🔁 API Routes & Data Flow

### 🔐 Authentication & User Management

| Method | Route               | Middleware(s)                   | Description |
|--------|---------------------|----------------------------------|-------------|
| GET    | `/`                 | -                                | Renders login page |
| POST   | `/login`            | `SetTocken`                      | Validates user, sets JWT, redirects to profile |
| GET    | `/register`         | -                                | Renders registration form |
| POST   | `/register`         | `UserExist`, `sendOtp`           | Sends OTP and redirects to OTP page |
| GET    | `/otp-verification` | `addOTP`                         | Renders OTP verification page |
| POST   | `/verify-otp`       | `RegisterUser`                   | Verifies OTP, registers user, redirects to profile |
| GET    | `/profile`          | `isUserLogin`, `FindUser`        | Renders profile with active plans |
| GET    | `/update`           | `FindUser`                       | Renders update form |
| POST   | `/update`           | `FindUser`                       | Updates user data |
| GET    | `/delete/:id`       | `isUserLogin`                    | Deletes user and logs them out |
| GET    | `/logout`           | -                                | Logs user out, clears cookies |

### 💳 Subscription & Payment

| Method | Route                  | Middleware(s)                  | Description |
|--------|------------------------|--------------------------------|-------------|
| GET    | `/subscription`        | `LoadPlan`, `FindUser`         | Renders subscription options |
| POST   | `/subscribe`           | `FindUser`, `createSubscription`| Creates Razorpay order |
| POST   | `/verify-payment`      | -                              | Verifies Razorpay payment |
| GET    | `/delete-subscription` | -                              | Deletes user's active subscription(s) |

---

## 🔄 Data Flow Example

### 1. **User Registration Flow**
```
/register (POST) → /otp-verification → /verify-otp (POST) → JWT cookie set → /profile
```

### 2. **Subscription Flow**
```
/subscription → /subscribe (POST) → Razorpay payment on frontend → /verify-payment → Plan activated
```

---

## 📝 License

ISC License

---

## 👤 Author

**Omee Balar**