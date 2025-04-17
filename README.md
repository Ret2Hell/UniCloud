# UniCloud

**UniCloud** is a modern platform built for university students and staff to efficiently **manage, share, and access files and folders**. Whether you're organizing academic resources, collaborating on group projects, or leveraging AI-powered tools for productivity, UniCloud offers a seamless experience tailored to academic environments.

---

## 🚀 Features

- **File Management**: Upload, download, organize, and delete files in structured folders.
- **Bookmarks**: Easily bookmark frequently accessed files.
- **AI Assistant**: Interact with an AI chatbot to get insights, summaries, and answers from your documents.
- **User Authentication**: Secure login and registration system with session management.
- **GraphQL API**: Powerful and flexible querying/mutation capabilities via Apollo Server.
- **Responsive Design**: Fully optimized for both desktop and mobile devices.

---

## 🛠 Tech Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com) – A progressive Node.js framework for scalable server-side applications.
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM.
- **GraphQL**: Apollo Server for handling API operations.
- **Authentication**: Secure JWT-based REST authentication.

### Frontend

- **Framework**: [Next.js](https://nextjs.org) – A powerful React-based framework for building performant UIs.
- **State Management**: Redux Toolkit Query (RTK Query) for seamless API data fetching and caching.
- **UI**: [Shadcn UI](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) for modern, responsive interfaces.

---

## ⚙️ Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) (for optional containerization)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ret2Hell/UniCloud.git
   cd UniCloud
   ```

2. **Configure environment variables:**

   - Copy `.env.example` to `.env` in both the `backend` and `frontend` directories.
   - Update values based on your environment and setup.

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Run the development servers:**

   - **Backend**:

     ```bash
     cd backend
     npm run start:dev
     ```

   - **Frontend**:
     ```bash
     cd frontend
     npm run dev
     ```

5. **Access the application:**

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend GraphQL Playground: [http://localhost:4000/graphql](http://localhost:4000/graphql)

---

### 🐳 Using Docker

To run the entire stack with Docker:

```bash
docker-compose up --build
```

Once running, access the app at [http://localhost:3000](http://localhost:3000).

---

## 📚 Usage Guide

### 📁 File Management

- Upload, download, and organize files into folders.
- Bookmark files for quick access.
- Remove files when no longer needed.

### 🤖 AI Assistant

- Chat with an AI about uploaded documents.
- Get summaries, clarifications, and context-aware insights.

### 🔐 Authentication

- Register and log in to unlock personalized features.
- Access your profile and activity logs.

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here’s how to get started:

1. **Fork the repository.**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes and commit:**
   ```bash
   git commit -m "feat: add your feature"
   ```
4. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a pull request** with a detailed explanation.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

Got questions or suggestions? Feel free to reach out:  
📧 [mohamedyassine.taieb@insat.ucar.tn](mailto:mohamedyassine.taieb@insat.ucar.tn)

---
