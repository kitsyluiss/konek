# 🚀 Konek 

> **The modern, dynamic NFC profile and link-in-bio builder.**

![Konek Banner](https://via.placeholder.com/1200x400/1e293b/ffffff?text=Konek+-+Next+Gen+NFC+Profiles)

**Konek** is an elegant, open-source dynamic profile builder tailored for NFC cards, creators, and professionals. Build beautiful, mobile-optimized link-in-bio pages with a powerful drag-and-drop React interface.

---

## ✨ Features

- 📱 **Mobile-First Design**: Optimized layouts that look stunning on any smartphone.
- 🎨 **Drag-and-Drop Builder**: Build your profile intuitively with a beautiful visual editor.
- 🔗 **Smart Blocks**: Link blocks, embedded media, Google Maps, YouTube videos, and rich social integrations.
- 📞 **NFC-Ready Contacts**: Includes a native "Save to Contacts" block that generates vCards on the fly.
- ⚡ **Lightning Fast**: Built with React and Vite for immediate loading times and smooth animations.
- 🔒 **Privacy Focused**: Everything is stored securely; static hosting ready, no complex backend required.

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

---

## 🚀 Quick Start / Local Setup

Follow these steps to get a local copy of Konek up and running:

### 1. Clone the repository
```bash
git clone https://github.com/kitsyluiss/konek.git
cd konek
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the builder in the browser.

### 4. Build for Production
```bash
npm run build
```
This generates the optimized static files into the `dist` directory, ready to be hosted on Vercel, Netlify, or GitHub Pages.

---

## 📂 Project Structure

```text
konek/
├── public/                 # Static public assets
├── src/                    
│   ├── components/         # React UI Components (Builder, Blocks, Sidebar)
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper utilities (vCard generator, responsive logic, security)
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Main application entry
│   └── index.css           # Global Tailwind and custom styles
├── .github/
│   └── workflows/          # CI/CD Actions
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## 🤝 Contributing
We welcome community contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
