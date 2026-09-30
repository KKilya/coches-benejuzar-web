(function(){
  "use strict";

  // Páginas estáticas por idioma (/es/, /ru/) fijan window.CB_IMG_BASE = '../'
  // antes de cargar este script, porque viven un nivel más abajo que images/.
  const IMG_BASE = window.CB_IMG_BASE || '';

  /* Photo numbers sorted into categories by visual review of images/*.jpg.
     There is no filename/metadata signal for category, so this list is the
     source of truth — update it by hand if photos are added or reclassified. */
  const GALLERY_DATA = {
    coches: [1, 7, 8, 9, 15, 20, 21, 29, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 105, 107, 108, 109, 111, 112, 113, 114, 115, 117, 118, 120, 121, 122, 124, 126, 128, 129, 136, 137, 138, 142, 146, 147, 148, 156, 165, 166, 168, 169, 182, 183, 188, 189, 194, 196, 208, 220, 233, 243, 245, 251, 254, 255, 267, 273, 276],
    motos: [47, 139, 140, 141, 205],
    marine: [2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 16, 17, 18, 19, 22, 23, 24, 25, 26, 27, 28, 37, 58, 73, 74, 104, 106, 110, 116, 119, 123, 125, 127, 130, 131, 132, 133, 134, 135, 143, 144, 145, 149, 150, 151, 152, 153, 154, 155, 157, 158, 159, 160, 161, 162, 163, 164, 167, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 184, 185, 186, 187, 190, 191, 192, 193, 195, 197, 198, 199, 200, 201, 202, 203, 204, 206, 207, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 234, 235, 236, 237, 238, 239, 240, 241, 242, 244, 246, 247, 248, 249, 250, 252, 253, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 268, 269, 270, 271, 272, 274, 275]
  };
  const CATEGORIES = ['coches', 'motos', 'marine'];

  const grid = document.getElementById('gallery-grid');
  const tabs = document.querySelectorAll('.tab-btn');
  const countLabel = document.getElementById('gallery-count');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCurrent = document.getElementById('lightbox-current');
  const lightboxTotal = document.getElementById('lightbox-total');

  let activeList = [];
  let lightboxPos = -1;

  function renderGrid(category){
    activeList = GALLERY_DATA[category] || [];
    grid.innerHTML = '';
    activeList.forEach((num, idx) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const img = document.createElement('img');
      img.src = IMG_BASE + 'images/' + num + '.jpg';
      img.alt = 'Proyecto ' + num;
      img.loading = 'lazy';
      item.appendChild(img);
      item.addEventListener('click', () => openLightbox(idx));
      grid.appendChild(item);
    });
    if(countLabel) countLabel.textContent = activeList.length;
  }

  function activateCategory(category){
    if(CATEGORIES.indexOf(category) === -1) category = 'coches';
    tabs.forEach(t => t.classList.toggle('active', t.dataset.cat === category));
    renderGrid(category);
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => {
      activateCategory(t.dataset.cat);
      history.replaceState(null, '', '#' + t.dataset.cat);
    });
  });

  function openLightbox(idx){
    lightboxPos = idx;
    const num = activeList[idx];
    lightboxImage.src = IMG_BASE + 'images/' + num + '.jpg';
    lightboxImage.alt = 'Proyecto ' + num;
    lightboxCurrent.textContent = idx + 1;
    lightboxTotal.textContent = activeList.length;
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showNextImage(){ if(lightboxPos < activeList.length - 1) openLightbox(lightboxPos + 1); }
  function showPrevImage(){ if(lightboxPos > 0) openLightbox(lightboxPos - 1); }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);
  lightboxModal.addEventListener('click', (e) => { if(e.target === lightboxModal) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if(!lightboxModal.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') showNextImage();
    if(e.key === 'ArrowLeft') showPrevImage();
  });

  const initialCategory = (location.hash || '').replace('#', '');
  activateCategory(initialCategory);

  window.addEventListener('hashchange', () => {
    activateCategory((location.hash || '').replace('#', ''));
  });
})();
