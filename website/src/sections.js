// Owned by the content task.
// Builds the whole page DOM inside `container` from the `content` object.

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue;
    if (key === 'className') node.className = value;
    else if (key === 'text') node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) {
    if (child) node.append(child);
  }
  return node;
}

function isExternal(href) {
  return /^https?:\/\//i.test(href);
}

function link(href, text, className) {
  const props = { href, text, className };
  if (isExternal(href)) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }
  return el('a', props);
}

function renderNav(content) {
  const items = SECTIONS.map((s) =>
    el('li', {}, [el('a', { href: `#${s.id}`, text: s.label })]),
  );
  return el('header', { className: 'site-header' }, [
    el('nav', { className: 'site-nav', 'aria-label': 'Primary' }, [
      el('a', { href: '#top', className: 'site-nav__brand', text: content.name }),
      el('ul', { className: 'site-nav__links' }, items),
    ]),
  ]);
}

function renderHero(content) {
  return el('section', { id: 'top', className: 'hero', 'aria-labelledby': 'hero-title' }, [
    el('div', { className: 'hero__inner' }, [
      el('h1', { id: 'hero-title', className: 'hero__name', text: content.name }),
      content.tagline && el('p', { className: 'hero__tagline', text: content.tagline }),
      el('a', { href: '#about', className: 'hero__scroll' }, [
        el('span', { text: content.scrollHint || 'Scroll' }),
        el('span', { className: 'hero__scroll-arrow', 'aria-hidden': 'true', text: '↓' }),
      ]),
    ]),
  ]);
}

function section(id, title, children) {
  const headingId = `${id}-title`;
  return el('section', { id, className: `section section--${id}`, 'aria-labelledby': headingId }, [
    el('div', { className: 'panel' }, [
      el('h2', { id: headingId, className: 'section__title', text: title }),
      ...children,
    ]),
  ]);
}

function renderAbout(content) {
  return section('about', 'About', [el('p', { className: 'about__text', text: content.about })]);
}

function renderProjects(content) {
  const cards = content.projects.map((p) => {
    const tags = el(
      'ul',
      { className: 'tags', 'aria-label': 'Technologies' },
      (p.tags || []).map((t) => el('li', { className: 'tag', text: t })),
    );
    const title = p.link
      ? el('h3', { className: 'card__title' }, [link(p.link, p.title)])
      : el('h3', { className: 'card__title', text: p.title });
    return el('li', { className: 'card' }, [
      title,
      el('p', { className: 'card__description', text: p.description }),
      tags,
      p.link && link(p.link, 'View project', 'card__link'),
    ]);
  });
  return section('projects', 'Projects', [el('ul', { className: 'card-grid' }, cards)]);
}

function renderSkills(content) {
  return section('skills', 'Skills', [
    el('ul', { className: 'tags tags--large' }, content.skills.map((s) => el('li', { className: 'tag', text: s }))),
  ]);
}

function renderContact(content) {
  return section('contact', 'Contact', [
    el('p', { className: 'contact__text', text: 'Want to work together or just say hello? Reach me here.' }),
    el('ul', { className: 'contact__links' }, content.links.map((l) => el('li', {}, [link(l.href, l.label, 'contact__link')]))),
  ]);
}

function renderFooter(content) {
  const year = new Date().getFullYear();
  return el('footer', { className: 'site-footer' }, [
    el('p', { text: `© ${year} ${content.name}` }),
  ]);
}

export function renderSections(container, content) {
  container.replaceChildren(
    renderNav(content),
    renderHero(content),
    renderAbout(content),
    renderProjects(content),
    renderSkills(content),
    renderContact(content),
    renderFooter(content),
  );
}
