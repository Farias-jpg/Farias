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
