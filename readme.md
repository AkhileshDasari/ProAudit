# 🔍 ProAudit — AI-Powered Procurement Compliance Platform

> Intelligent tender document auditing and compliance verification, powered by AI.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**ProAudit** (ProcureAudit AI) is a full-stack web application that automates the review and compliance auditing of procurement tender documents. It leverages an AI agent to analyze tender PDFs, flag compliance issues, and generate structured audit reports — helping procurement teams save time and reduce human error.

---

## Features

- 📄 **Tender Document Upload & Analysis** — Upload PDF tender documents for instant AI-driven review
- 🤖 **AI Compliance Agent** — Autonomous agent that checks tenders against compliance rules and requirements
- 📊 **Audit Report Generation** — Export detailed compliance reports as PDF using jsPDF
- 🔎 **PDF Diagnosis Tools** — Utilities to inspect and validate PDF structure before processing
- ⚡ **Real-Time Feedback** — Fast backend API responses via FastAPI + Uvicorn
- 🖥️ **Modern React UI** — Clean, responsive interface built with React 18 and Vite

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite, Lucide React, jsPDF             |
| Backend   | Python, FastAPI, Uvicorn                        |
| AI Agent  | Custom agent (`my-agent`) for compliance logic  |
| Styling   | CSS                                             |
| Build     | Vite (ESM), `dist/` output                      |

---

## Project Structure

```
ProAudit/
├── backend/             # FastAPI backend application
│   └── main.py          # API entry point (app)
├── my-agent/            # AI compliance agent logic
├── src/                 # React frontend source
├── public/              # Static assets
├── dist/                # Production build output
├── tenders/             # Sample/test tender documents
├── diagnose_pdf.py      # PDF structure diagnostic utility
├── manual_test.py       # Manual backend test scripts
├── verify_models.py     # AI model verification script
├── run_backend.py       # Backend startup script
├── vite.config.js       # Vite configuration
├── package.json         # Frontend dependencies
└── index.html           # HTML entry point
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18+ and **npm**
- **Python** 3.9+
- **pip**

---

### Backend Setup

1. Clone the repository:
```bash
   git clone https://github.com/AkhileshDasari/ProAudit.git
   cd ProAudit
```

2. Install Python dependencies:
```bash
   pip install fastapi uvicorn
   # Install any additional dependencies required by backend/my-agent
```

3. Start the backend server:
```bash
   python run_backend.py
```

   The API will be available at `http://localhost:8000`.

---

### Frontend Setup

1. Install Node dependencies:
```bash
   npm install
```

2. Start the development server:
```bash
   npm run dev
```

   The app will be available at `http://localhost:5173`.

3. To build for production:
```bash
   npm run build
```

---

## Usage

1. Launch both the backend and frontend servers (see above).
2. Open the app in your browser at `http://localhost:5173`.
3. Upload a tender PDF document via the UI.
4. The AI agent will analyze the document and return a compliance audit summary.
5. Download the generated audit report as a PDF.

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing style and that all tests pass before submitting.

---

## License

This project is open source. Add a `LICENSE` file to specify the terms under which others can use, modify, and distribute this software.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/AkhileshDasari">Akhilesh Dasari</a>
</p>
