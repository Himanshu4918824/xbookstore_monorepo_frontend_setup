# XBookstore Monorepo Frontend Setup

This repository contains the frontend applications for the XBookstore project, managed as a monorepo using Turbo. It includes two distinct applications: an **Admin Panel** and a **Customer-Facing Store**.

## Project Structure

```
.
├── apps
│   ├── admin/         # Admin Panel application
│   └── store/         # Customer-Facing Store application
├── package.json       # Root package.json for monorepo management
└── README.md          # This README file
```

## Technologies

### Admin Panel (`apps/admin`)

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`), Material UI Icons (`@mui/icons-material`)
*   **State Management/UI Components:**
    *   Material UI X Tree View (`@mui/x-tree-view`)
    *   Material UI Lab (`@mui/lab`)
    *   React Select (`react-select`)
    *   React Image Crop (`react-image-crop`)
    *   Hello Pangea Drag and Drop (`@hello-pangea/dnd`)
*   **Routing:** React Router DOM (`react-router-dom`)
*   **HTTP Client:** Axios (`axios`)
*   **Date Handling:** Date-fns (`date-fns`)
*   **Animation:** Motion (`motion`)
*   **3D Integration:** Spline (`@splinetool/react-spline`, `@splinetool/runtime`)
*   **Utilities:** `use-debounce`
*   **Linting:** ESLint

### Customer-Facing Store (`apps/store`)

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`), Material UI Icons (`@mui/icons-material`)
*   **3D Rendering:** React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Three.js (`three`, `three-stdlib`)
*   **Routing:** React Router DOM (`react-router-dom`)
*   **HTTP Client:** Axios (`axios`)
*   **Animation:** Framer Motion (`framer-motion`)
*   **UI Components:** React Phone Input 2 (`react-phone-input-2`), React Scroll Snap (`react-scroll-snap`)
*   **Linting:** ESLint

### Monorepo Management

*   **Tool:** Turbo (`turbo`)

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn (npm is assumed for package management in this guide)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/xbookstore_monorepo_frontend_setup.git
    cd xbookstore_monorepo_frontend_setup
    ```

2.  **Install dependencies:**
    This command will install all project-level and individual application dependencies using Turbo.

    ```bash
    npm install
    ```

## Development

### Running Applications

Turbo allows you to run scripts across all packages efficiently.

*   **Start the Admin Panel:**

    ```bash
    npm run dev -w apps/admin
    ```
    or using Turbo directly:
    ```bash
    turbo run dev --filter=admin
    ```

*   **Start the Customer-Facing Store:**

    ```bash
    npm run dev -w apps/store
    ```
    or using Turbo directly:
    ```bash
    turbo run dev --filter=store
    ```

### Building Applications

*   **Build the Admin Panel:**

    ```bash
    npm run build -w apps/admin
    ```
    or using Turbo directly:
    ```bash
    turbo run build --filter=admin
    ```

*   **Build the Customer-Facing Store:**

    ```bash
    npm run build -w apps/store
    ```
    or using Turbo directly:
    ```bash
    turbo run build --filter=store
    ```

### Linting

*   **Lint all applications:**

    ```bash
    npm run lint
    ```
    or using Turbo directly:
    ```bash
    turbo run lint
    ```

*   **Lint a specific application:**

    ```bash
    npm run lint -w apps/admin
    ```
    or using Turbo directly:
    ```bash
    turbo run lint --filter=admin
    ```

## Contributing

Contributions are welcome! Please follow the standard GitHub pull request workflow.

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure they are well-tested.
4.  Commit your changes.
5.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
