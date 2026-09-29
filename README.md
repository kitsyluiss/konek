# Konek Multi-Tenant Viewer

This repository serves as the highly optimized, **Multi-Tenant Dynamic Handler** for the Konek ecosystem. It is a lightweight, secure React application designed exclusively for rendering client profiles without exposing the Konek Builder UI or administrative data.

## 🚀 Architecture

- **Stateless & Secure:** The Builder editor code has been completely stripped out.
- **Dynamic Routing:** Built with React Router, it automatically matches dynamic `/:slug` URLs (e.g. `konek.com/rb-marcelo`) to the correct client profile.
- **JSON Data Fetching:** Seamlessly fetches configuration files directly from the `/public/koneks/` directory.

## 🛠 Adding a New Client

To deploy a new client's profile:
1. Export the JSON configuration from your private Konek Builder.
2. Name it according to the URL slug you want (e.g., `new-client.json`).
3. Place the file inside the `/public/koneks/` directory in this repository.
4. Commit and push. The profile will instantly be live at `yourdomain.com/p/new-client`.

## 📦 Setup & Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

## 📄 License
This project is licensed under the MIT License.
