import './styles.css';
import { createHeroScene } from './scene.js';
import { renderSections } from './sections.js';
import { content } from './content.js';

const canvas = document.getElementById('hero-canvas');
const scene = createHeroScene(canvas);
renderSections(document.getElementById('content'), content);
window.addEventListener('beforeunload', () => scene.dispose());
