const ICON_SLUGS: Record<string, string> = {
  figma: 'figma',
  notion: 'notion',
  'google colab': 'googlecolab',
  colab: 'googlecolab',
  vue: 'vuedotjs',
  'vue 3': 'vuedotjs',
  'vue.js': 'vuedotjs',
  typescript: 'typescript',
  javascript: 'javascript',
  tailwind: 'tailwindcss',
  'tailwind css': 'tailwindcss',
  laravel: 'laravel',
  'laravel 13': 'laravel',
  php: 'php',
  mysql: 'mysql',
  firebase: 'firebase',
  supabase: 'supabase',
  flutter: 'flutter',
  dart: 'dart',
  python: 'python',
  fastapi: 'fastapi',
  react: 'react',
  vite: 'vite',
  git: 'git',
  github: 'github',
  linux: 'linux',
  fedora: 'fedora',
  'fedora kde': 'fedora',
  bash: 'gnubash',
  docker: 'docker',
  railway: 'railway',
  vercel: 'vercel',
  html: 'html5',
  css: 'css3',
}

export function getTechIconUrl(tech: string): string | null {
  const key = tech.trim().toLowerCase()
  const slug = ICON_SLUGS[key]
  if (!slug) return null
  return `https://cdn.simpleicons.org/${slug}`
}
