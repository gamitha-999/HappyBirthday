const IMAGES = {
  harsha: [
    'images/harsha/32423434234234.jpeg',
    'images/harsha/435345435435435322.jpeg',
    'images/harsha/454634643.jpeg',
    'images/harsha/WhatsApp Image 2026-06-24 at 19.35.29.jpeg',
    'images/harsha/WhatsApp Image 2026-06-24 at 19.35.30.jpeg',
    'images/harsha/WhatsApp Image 2026-06-24 at 19.35.41.jpeg'
  ],
  harshaf: [
    'images/harshaf/121212.jpeg',
    'images/harshaf/34343434.jpeg',
    'images/harshaf/WhatsApp Image 2026-06-24 at 19.35.40.jpeg'
  ],
  harshi: [
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.17 (1).jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.17.jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.18.jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.19 (1).jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.20.jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.21.jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.23.jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.24.jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.32.jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.11.38.jpeg',
    'images/harshi/WhatsApp Image 2026-06-24 at 19.34.35.jpeg'
  ],
  harshif: [
    'images/harshif/WhatsApp Image 2026-06-24 at 19.11.45.jpeg',
    'images/harshif/WhatsApp Image 2026-06-24 at 19.11.19.jpeg',
    'images/harshif/WhatsApp Image 2026-06-24 at 19.11.34.jpeg',
    'images/harshif/WhatsApp Image 2026-06-24 at 19.11.35.jpeg',
    'images/harshif/WhatsApp Image 2026-06-24 at 19.11.36.jpeg',
    'images/harshif/WhatsApp Image 2026-06-24 at 19.11.39.jpeg',
    'images/harshif/WhatsApp Image 2026-06-24 at 19.11.39 (12).jpeg',
    'images/harshif/WhatsApp Image 2026-06-24 at 19.11.45.jpeg',
    'images/harshif/WhatsApp Image 2026-06-24 at 19.35.31.jpeg',
    'images/harshif/WhatsApp Image 2026-06-24 at 19.11.39 (2).jpeg'
  ]
};

function encodePath(path) {
  return path.split('/').map(part => encodeURI(part)).join('/');
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
