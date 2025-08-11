# 🛡️ CiviSafe

CiviSafe is a modern **Next.js** web application that enables users to submit **anonymous complaints** and allows admins to view, manage, and take action.  
It’s designed with a secure and intuitive interface to make civic reporting accessible and confidential.

---

## 🚀 Features

### 👤 User
- Submit anonymous complaints
- Simple and responsive interface
- Fast, mobile-friendly experience

### 🛠️ Admin
- View all submitted complaints
- Mark complaints as resolved
- Take actions and record notes

---

## 🖼️ Tech Stack

| Category      | Technology |
|--------------|------------|
| **Frontend & Backend** | [Next.js](https://nextjs.org/) (App Router) |
| **UI Library** | [React](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| **Fonts** | [Geist](https://vercel.com/fonts) |
| **Linting** | [ESLint](https://eslint.org/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/civisafe.git
   cd civisafe
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create an `.env.local` file** and add your environment variables:

   ```env
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 🌍 Live Demo

🔗 **[CiviSafe Live](https://civisafe.vercel.app)**

---

## 📂 Project Structure

```
civisafe/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── public/           # Static assets
├── styles/           # Tailwind CSS styles
└── ...
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Added feature"`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

---

**Made with ❤️ using Next.js, Tailwind, and shadcn/ui**

```
