/**
 * Generate deployment README
 */

import { ExportDeploymentTarget } from './types';

export const generateDeployMd = (params: {
  name: string;
  target: ExportDeploymentTarget;
}): string => `# Deploy ${params.name}

This is a React/Vite/Tailwind project exported from Konek.

## Quick Start

\`\`\`bash
npm install
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
\`\`\`

## Deployment

### ${params.target.charAt(0).toUpperCase() + params.target.slice(1)}

${
  params.target === 'vercel'
    ? `1. Push to GitHub
2. Import in Vercel
3. Deploy (auto-detected)`
    : ''
}
${
  params.target === 'netlify'
    ? `1. Push to GitHub
2. Import in Netlify
3. Deploy (auto-detected)`
    : ''
}
${
  params.target === 'github-pages'
    ? `1. Push to GitHub
2. Go to Settings → Pages → Source: GitHub Actions
3. The included workflow will auto-deploy`
    : ''
}
${
  params.target === 'docker'
    ? `\`\`\`bash
docker build -t my-konek .
docker run -p 8080:80 my-konek
\`\`\``
    : ''
}
${
  params.target === 'vps'
    ? `1. Copy files to your server
2. Run \`npm install && npm run build\`
3. Configure nginx with the provided config
4. Point nginx root to the \`dist\` folder`
    : ''
}
${
  params.target === 'heroku'
    ? `1. Create Heroku app
2. Add buildpack: \`heroku/nodejs\`
3. Push to Heroku`
    : ''
}

## Files

- \`src/App.tsx\` - Main component with all data embedded
- \`src/index.css\` - Tailwind styles
- \`public/assets/\` - Images (if any)
`;
