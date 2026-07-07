# Mentorship Project

Angular-based web application for mentorship program management.

## Project Structure

```
mentor/
├── .gitignore
├── package-lock.json
├── README.md
└── public-mentorship/
    ├── .gitignore
    ├── .npmrc
    ├── angular.json
    ├── package.json
    ├── tsconfig.app.json
    ├── tsconfig.json
    └── src/
        ├── app/                 # Angular application modules and components
        ├── assets/              # Static assets (images, fonts, data)
        ├── index.html           # Main HTML entry point
        ├── main.ts              # Application bootstrap
        └── styles.css           # Global styles
```

## Technologies

- **Angular** - Frontend framework
- **TypeScript** - Programming language
- **Node.js** - Runtime environment

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mentor/public-mentorship
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
ng serve
```

4. Open [http://localhost:4200](http://localhost:4200) in your browser.

## Build

```bash
ng build
```

The build artifacts will be stored in the `dist/public-frontend/` directory.
