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
const uploadButton = document.getElementById('upload-images');
const uploadStatus = document.getElementById('upload-status');
const galleryGrid = document.getElementById('gallery-grid');
const galleryStorageKey = 'galleryImages';

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

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
      const dataUrl = await readFileAsDataUrl(file);
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

async function uploadImagesToGithub() {
  const token = document.getElementById('github-token')?.value?.trim();
  const imageInputs = [
    document.getElementById('image1'),
    document.getElementById('image2'),
    document.getElementById('image3'),
    document.getElementById('image4'),
  ];

  if (!token) {
    uploadStatus.textContent = 'Informe o token do GitHub.';
    return;
  }

  uploadStatus.textContent = 'Enviando imagens...';

  const uploads = [];
  for (let index = 0; index < imageInputs.length; index += 1) {
    const file = imageInputs[index]?.files?.[0];
    if (!file) continue;
    const dataUrl = await readFileAsDataUrl(file);
    const base64 = dataUrl.split(',')[1];
    const fileName = `images/${Date.now()}-${index + 1}-${file.name}`;
    uploads.push({ fileName, content: base64, mime: file.type });
  }

  if (uploads.length === 0) {
    uploadStatus.textContent = 'Selecione pelo menos uma imagem.';
    return;
  }

  try {
    const repoOwner = 'Farias-jpg';
    const repoName = 'Farias';
    const branch = 'gh-pages';

    for (const upload of uploads) {
      const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${upload.fileName}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload image ${upload.fileName}`,
          content: upload.content,
          branch,
        }),
      });

      if (!response.ok) {
        throw new Error(`Falha ao enviar ${upload.fileName}`);
      }
    }

    uploadStatus.textContent = 'Imagens enviadas com sucesso!';
  } catch (error) {
    uploadStatus.textContent = `Erro ao enviar: ${error.message}`;
  }
}

if (updateButton) {
  updateButton.addEventListener('click', updateGalleryImages);
}

if (uploadButton) {
  uploadButton.addEventListener('click', uploadImagesToGithub);
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
