# StayVista 🏡

**Discover places that feel like home.**

StayVista is an accommodation listing web application built with Node.js, Express, MongoDB, and EJS. It provides a platform where users can explore available stays, search listings, and manage accommodation details after logging in.

## ✨ Features

- **User Authentication:** User registration and login with password hashing.
- **Explore Listings:** Browse accommodation listings and view individual property details.
- **Search and Filter:** Search stays by location, country, activity-related keywords, and price range.
- **Create Listings:** Add accommodation details, including title, description, image URL, price, location, and country.
- **Edit and Delete:** Manage listings after authentication.
- **Responsive Interface:** Web pages built with EJS, CSS, and Bootstrap.
- **Database Integration:** MongoDB with Mongoose for storing listings, users, and login sessions.
- **Error Handling:** Custom error handling for invalid requests and missing listings.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| EJS | Dynamic HTML rendering |
| EJS-Mate | Layouts and reusable page templates |
| Joi | Input validation |
| Bootstrap and CSS | User interface and styling |
| Git and GitHub | Version control and source code hosting |
| Render | Application deployment |

## 📁 Project Structure

```text
StayVista/
├── app.js
├── package.json
├── package-lock.json
├── schema.js
├── init/
│   ├── data.js
│   └── index.js
├── models/
│   ├── listing.js
│   ├── user.js
│   └── authSession.js
├── utils/
│   ├── auth.js
│   ├── password.js
│   ├── ExpressError.js
│   └── wrapAsync.js
├── public/
│   ├── css/
│   └── home.jpg
└── views/
    ├── layouts/
    ├── listings/
    ├── auth/
    ├── home.ejs
    └── error.ejs
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd StayVista
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root if you want to use environment variables locally.

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=8080
NODE_ENV=development
```

Never commit your `.env` file or expose database credentials publicly.

### 4. Start the Application

```bash
npm start
```

Open the following URL in your browser:

```text
http://localhost:8080
```

## 🚀 Deploy to Render

StayVista is a Node.js web service and needs a reachable MongoDB database.

1. Create a MongoDB Atlas database. In Atlas **Network Access**, allow connections from Render (for a quick setup, `0.0.0.0/0`; use stronger network restrictions where practical). Create a database user and copy the Atlas connection string.
2. Push the project to GitHub, then in Render choose **New → Web Service** and connect the repository.
3. Use these service settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free is enough to try the app
4. In the service's **Environment** settings, add:
   - `MONGODB_URI` — the MongoDB Atlas connection string, with the database username/password and database name filled in
   - `NODE_ENV` — `production`
5. Click **Create Web Service**. Render installs the dependencies, starts the app, and provides its public URL. Render sets `PORT` automatically; do not set a fixed `PORT` in the Render environment.

Keep the Atlas connection string private. Do not upload `.env` to GitHub; add secrets in Render's environment settings instead. If deployment fails, check the Render deploy logs and confirm the Atlas database user, connection string, and Network Access settings.

To add missing sample listings to Atlas, set `MONGODB_URI` in your local `.env` to the same Atlas connection string used by Render, then run `npm run seed` from your project folder. The seed command adds only missing samples and never deletes existing listings. Keep `.env` private.

## 🔐 Security Notes

- Store database credentials in environment variables.
- Do not upload `.env` or `node_modules`.
- Use a strong database password and restrict database network access where practical.
- Keep dependencies updated.

## 🎯 Project Objective

The objective of StayVista is to demonstrate full-stack web development using a server-rendered interface, REST-style routes, database integration, authentication, input validation, and deployment.

## 🔮 Future Enhancements

- Property booking and reservation management
- User reviews and ratings
- Map-based property discovery
- Image uploads using cloud storage
- Payment gateway integration
- Advanced user profiles and host dashboards

## 👨‍💻 Author

**Awdhesh Sahani**

GitHub: https://github.com/Awdhesh-Sahani

## 📄 License

This project is intended for educational and portfolio purposes. Add a suitable open-source license if you wish to distribute it under specific reuse terms.
