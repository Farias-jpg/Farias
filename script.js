const buttons = document.querySelectorAll('.action-btn');
const panels = document.querySelectorAll('.panel');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;
    panels.forEach((panel) => {
      panel.classList.toggle('visible', panel.id === targetId);
    });
  });
});

function updateCounter() {
  const startDate = new Date('2025-09-01T00:00:00');
  const now = new Date();
  const diff = Math.max(0, now - startDate);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = `${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`;
  }
}

setInterval(updateCounter, 1000);
updateCounter();

const textarea = document.getElementById('message-input');
const saveButton = document.getElementById('save-message');
const status = document.getElementById('save-status');

if (textarea) {
  const savedMessage = localStorage.getItem('loveMessage');
  if (savedMessage) {
    textarea.value = savedMessage;
  }
}

if (saveButton) {
  saveButton.addEventListener('click', () => {
    const value = textarea ? textarea.value.trim() : '';
    localStorage.setItem('loveMessage', value);
    if (status) {
      status.textContent = 'Mensagem salva!';
    }
  });
}

const updateButton = document.getElementById('update-images');
const galleryGrid = document.getElementById('gallery-grid');
const galleryStorageKey = 'galleryImages';

async function updateGalleryImages() {
  const imageInputs = [
    document.getElementById('image1'),
    document.getElementById('image2'),
    document.getElementById('image3'),
    document.getElementById('image4'),
  ];

  const figures = galleryGrid?.querySelectorAll('figure') || [];
  const savedImages = [];

  for (let index = 0; index < imageInputs.length; index += 1) {
    const input = imageInputs[index];
    const file = input?.files?.[0];
    const figure = figures[index];
    const img = figure?.querySelector('img');

    if (file) {
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      savedImages.push(dataUrl);
      if (img) {
        img.src = dataUrl;
        img.alt = `Imagem ${index + 1}`;
      }
    } else if (img) {
      savedImages.push(img.src);
    } else {
      savedImages.push('');
    }
  }

  localStorage.setItem(galleryStorageKey, JSON.stringify(savedImages));
}

if (updateButton) {
  updateButton.addEventListener('click', updateGalleryImages);
}

const savedGalleryImages = (() => {
  try {
    return JSON.parse(localStorage.getItem(galleryStorageKey) || 'null');
  } catch (error) {
    console.error('Não foi possível restaurar as imagens da galeria:', error);
    return null;
  }
})();

if (savedGalleryImages && Array.isArray(savedGalleryImages)) {
  const figures = galleryGrid?.querySelectorAll('figure') || [];
  figures.forEach((figure, index) => {
    const img = figure.querySelector('img');
    const url = savedGalleryImages[index];
    if (img && url) {
      img.src = url;
      img.alt = `Imagem ${index + 1}`;
    }
  });
}
