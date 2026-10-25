# ACASA

## Overview

This system provides an automated solution for compliance auditing, integrating technological control checks with document analysis and system-level verifications. It supports Annex A controls from compliance standards like ISO 27001, focusing on areas such as firewall rules, antivirus checks, and document-based validations.

## Features

- **User Management**: Secure registration and login functionality.
- **Compliance Dashboard**: Provides a checklist of compliance controls for auditing.
- **File Upload and Analysis**: Allows IT admins to upload documents for automated compliance validation.
- **Firewall Analysis**: Retrieves and displays firewall rules and status.
- **Antivirus Checks**: Identifies installed antivirus software and security applications.
- **Compliance Reports**: Generates and displays completion percentages for compliance controls.

## System Architecture

The system follows a layered architecture for maintainability and scalability:

1. **Frontend Layer**: User interface built with React.js.
2. **Backend Layer**: RESTful API built with Node.js and Express.js.
3. **Database Layer**: PostgreSQL for persisting user, document, and control data.
4. **Scripts Layer**: Python scripts for document analysis and system checks.

Refer to the architecture and data model diagrams in the documentation for detailed structure and relationships.

## Tools and Technologies

### Frontend

- **React.js**: Modular component-based UI framework.
- **CSS**: Styling for responsive and user-friendly design.

### Backend

- **Node.js**: JavaScript runtime for server-side logic.
- **Express.js**: Framework for routing and RESTful APIs.
- **Multer**: Middleware for file upload handling.

### Database

- **PostgreSQL**: Relational database for data persistence.
- **pg (PostgreSQL Client)**: Node.js library for database interaction.

### Python Scripts

- **PyPDF2**: Extracts text from PDF documents.
- **OpenAI API**: Analyzes document content for compliance verification.
- **Subprocess**: Executes system commands for firewall and antivirus checks.

## Installation

### Prerequisites

1. **Node.js** (v16 or above)
2. **Python** (v3.8 or above)
3. **PostgreSQL**
4. **npm** (Node Package Manager)

### Steps

1. Clone the repository:

   ```zsh
   git clone https://github.com/ammadakram/P07-ACASA.git
   ```

2. Navigate to the backend directory and install dependencies:

   ```zsh
   cd backend
   npm install
   ```

3. Start the backend server:

   ```zsh
   node server.js
   ```

4. Navigate to the frontend directory and install dependencies:

   ```zsh
   cd ../frontend
   npm install
   ```

5. Start the frontend server:

   ```zsh
   npm start
   ```

## Usage

1. Register a new user or log in using existing credentials.
2. Navigate to the dashboard to view the checklist of compliance controls.
3. Upload documents or run automated scripts for specific controls.
4. Generate and view compliance reports.

## Project Structure

### Backend

- **server.js**: Entry point for the backend server.
- **db.js**: Database connection configuration.
- **scripts/**: Python scripts for compliance checks and system analysis.

### Frontend

- **src/components/**: React components for user interface.
- **src/App.js**: Main application entry point.

### Database

- **Users Table**: Stores user credentials.
- **Documents Table**: Tracks uploaded files and metadata.
- **Controls Table**: Lists compliance controls.

## Contributing

1. Fork the repository.
2. Create a feature branch:

   ```zsh
   git checkout -b feature-name
   ```

3. Commit changes:

   ```zsh
   git commit -m "Description of changes"
   ```

4. Push to the branch:

   ```zsh
   git push origin feature-name
   ```

5. Submit a pull request.

## License

This project is licensed under the Apache-2.0 License. See the LICENSE file for details.

---

For further details, refer to the documentation included in the repository or contact the project maintainers.
