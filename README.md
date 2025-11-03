# Node.js Static Server Dev Container

This project provides a Node.js dev container configured to serve static HTML files.

## Features

- **Node.js** runtime environment
- **http-server** package for serving static files
- Automatic port forwarding on port 8080

## Getting Started

### Using the Dev Container

1. Open this folder in VS Code
2. When prompted, click "Reopen in Container" (or run "Dev Containers: Reopen in Container" from the command palette)
3. Wait for the container to build and install dependencies
4. Run `npm start` in the terminal to start the server

### Available Commands

- `npm start` - Start the server and automatically open in browser
- `npm run dev` - Start the server without opening browser

### File Structure

```
.
├── .devcontainer/
│   └── devcontainer.json    # Dev container configuration
├── www/                     # Static files directory
│   └── index.html           # Sample homepage
├── package.json             # Node.js dependencies and scripts
└── README.md                # This file
```

### Adding Your Content

Place your HTML, CSS, JavaScript, and other static files in the `www/` directory. The server will automatically serve them at `http://localhost:8080`.
