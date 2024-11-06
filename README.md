# 🐳 Goraebab Frontend 🐳

Welcome to the **Goraebab Frontend** project! 

---

## 🚀 Getting Started

### ⚙️ Prerequisites

- **Node.js** - version **v20.10.0** or higher
- **npm** - for package management

---

### 📥 Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Team-Goraebab/Goraebab-Frontend.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Goraebab-frontend
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

    The app will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 🛠 Project Structure

Here's an overview of the key directories and files in the project:

```bash
goraebab-frontend/
├── .github/                  # GitHub workflows and configurations
├── .idea/                    # Project settings (for JetBrains IDEs)
├── .next/                    # Next.js build output (auto-generated)
├── node_modules/             # Project dependencies (auto-generated)
├── public/                   # Static assets
├── src/                      # Source files
│   ├── app/                  # Main application logic
│   │   ├── dashboard/        # Dashboard components
│   │   ├── settings/         # Settings components
│   │   ├── api/              # API handlers
│   │   ├── favicon.ico       # Favicon file
│   │   ├── globals.css       # Global CSS
│   │   ├── layout.tsx        # Layout component
│   │   └── page.tsx          # Main page component
│   ├── components/           # Reusable UI components
│   ├── context/              # Context providers for global state
│   ├── data/                 # Static or configuration data
│   ├── hook/                 # Custom React hooks
│   ├── services/             # API services and business logic
│   ├── store/                # Zustand store configuration
│   ├── types/                # TypeScript types and interfaces
│   └── utils/                # Utility functions
├── .env                      # Environment variables
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── daemon.json               # Custom daemon configuration
├── next-env.d.ts             # Next.js TypeScript environment definitions
├── next.config.mjs           # Next.js configuration
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Lockfile for npm dependencies
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```



---

## ✨ Key Libraries

Here are some key libraries used in this project:

- **[Next.js](https://nextjs.org/)**: A React framework for production-grade web applications with SSR (Server-Side Rendering).
- **[React](https://reactjs.org/)**: The core UI library.
- **[Zustand](https://github.com/pmndrs/zustand)**: A lightweight state management library, used for managing global state in the app.
- **[axios](https://axios-http.com/)**: A promise-based HTTP client for making API requests.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework used for designing the UI.
- **[MUI](https://mui.com/)**: A popular UI component library for React, used for implementing Material Design in the app.
- **[Lucide](https://lucide.dev/)**: Icon library for adding vector icons to the app.
- **[React-Draggable](https://www.npmjs.com/package/react-draggable)**: A component used for making elements draggable within the UI.
- **[Panzoom](https://github.com/timmywil/panzoom)**: Provides zoom and pan functionality for elements.
- **[React Tooltip](https://react-tooltip.com/)**: A library to easily create tooltips in your app.
- **[Notistack](https://notistack.com/)**: Snackbar library for displaying notifications.
- **[uuid](https://www.npmjs.com/package/uuid)**: Generates unique IDs for various use cases.
  
---

## 📄 Available Scripts

- `dev`: Run the development server.
- `build`: Generate the production build.
- `start`: Run the production server.
- `lint`: Run ESLint to check for issues in the code.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.


