document.documentElement.classList.add('js');

const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', String(menu.getAttribute('aria-expanded') !== 'true'));
});

nav.addEventListener('click', event => {
  if (event.target.closest('a')) menu.setAttribute('aria-expanded', 'false');
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    menu.focus();
  }
});

const progress = document.querySelector('.progress');
function updateProgress() {
  const length = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 0;
  progress.style.transform = 'scaleX(' + fraction + ')';
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const statusMessage = document.getElementById('status');
let messageTimeout;
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copy);
    let copied = false;
    try {
      await navigator.clipboard.writeText(source.textContent);
      copied = true;
    } catch {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      try { copied = document.execCommand('copy'); } catch { /* Keep the text selected for manual copying. */ }
      if (copied) selection.removeAllRanges();
    }
    clearTimeout(messageTimeout);
    statusMessage.textContent = copied
      ? (source.id === 'kakao' ? '카카오톡 ID를 복사했어요.' : '양식을 복사했어요. 오픈톡에 붙여넣어 주세요.')
      : '텍스트를 선택했어요. 기기의 복사 기능을 이용해 주세요.';
    messageTimeout = setTimeout(() => { statusMessage.textContent = ''; }, 3200);
  });
});
