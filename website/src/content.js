// Owned by the content task; single source of truth for all text on the site.
// Edit this file to personalise the portfolio. Everything else renders from it.
export const content = {
  name: 'Your Name',
  tagline: 'Software developer building games, tools, and the systems underneath them.',
  scrollHint: 'Scroll to explore',

  about:
    'I write software across the stack, from low-level C++ engines to web ' +
    'front-ends. I care about fast feedback loops, readable code, and tools ' +
    'that get out of the way. When I am not shipping, I am usually poking at ' +
    'graphics programming or reading about how old game consoles worked.',

  // The first project is real and lives in this repository. The others are
  // PLACEHOLDERS: swap them for your own work before publishing.
  projects: [
    {
      title: 'Shiva',
      description:
        'A 2D game engine written in C++ on top of SDL2. Handles the window, ' +
        'rendering, input and game loop so a game can focus on its own logic.',
      tags: ['C++', 'SDL2', 'Game engine'],
      link: 'https://github.com/your-handle/shiva',
    },
    {
      // PLACEHOLDER project
      title: 'Tilewright',
      description:
        'A browser-based tile map editor with layers, autotiling and export ' +
        'to a compact JSON format consumed by Shiva.',
      tags: ['TypeScript', 'Canvas', 'Vite'],
      link: 'https://example.com/tilewright',
    },
    {
      // PLACEHOLDER project
      title: 'Pulse',
      description:
        'A lightweight metrics agent and dashboard for home-lab servers. ' +
        'Streams CPU, memory and disk stats over WebSockets.',
      tags: ['Go', 'WebSockets', 'SQLite'],
      link: 'https://example.com/pulse',
    },
    {
      // PLACEHOLDER project
      title: 'Chiptune Studio',
      description:
        'A four-channel tracker that renders authentic 8-bit audio in the ' +
        'browser with the Web Audio API.',
      tags: ['JavaScript', 'Web Audio', 'Music'],
      link: 'https://example.com/chiptune-studio',
    },
  ],

  skills: [
    'C++',
    'JavaScript',
    'TypeScript',
    'Python',
    'Go',
    'SDL2',
    'Three.js',
    'WebGL',
    'Node.js',
    'React',
    'SQL',
    'Git',
    'Linux',
    'CMake',
  ],

  // Contact links. Use a mailto: href for email.
  links: [
    { label: 'GitHub', href: 'https://github.com/your-handle' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' },
    { label: 'Email', href: 'mailto:you@example.com' },
  ],
};
