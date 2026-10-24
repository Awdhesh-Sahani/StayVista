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

If you use a `.env` file, install `dotenv` and load it at the beginning of `app.js`:

```bash
npm install dotenv
```

```js
require("dotenv").config();
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

## 🚀 Deployment

StayVista can be deployed using Render and MongoDB Atlas.

1. Push the project to GitHub.
2. Create a new Web Service on Render and connect your repository.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Configure `MONGODB_URI` and `NODE_ENV` in Render's environment settings.
6. Deploy the application and open the generated public URL.

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
