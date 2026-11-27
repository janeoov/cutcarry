const progress = document.querySelector('.progress');
function updateProgress() {
  const length = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 0;
  progress.style.transform = 'scaleX(' + fraction + ')';
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
  const targets = '.hero h1, .hero .intro, .card, .section > h2, .section > .note, footer > .wrap';
  document.querySelectorAll(targets).forEach(element => reveal.observe(element));
}

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
      ? '양식 복사 완료'
      : '자동 복사 실패. 선택된 텍스트는 기기의 복사 기능으로 복사할 수 있습니다.';
    messageTimeout = setTimeout(() => { statusMessage.textContent = ''; }, 3200);
  });
});

async function showViewCount() {
  const output = document.getElementById('views');
  const action = location.hostname === 'cutcarry.vercel.app' ? 'hit' : 'get';
  try {
    const response = await fetch(
      'https://abacus.jasoncameron.dev/' + action + '/cutcarry-vercel-app/visits',
      { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' }
    );
    if (!response.ok) throw new Error('Counter unavailable');
    const { value } = await response.json();
    if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid count');
    output.textContent = value.toLocaleString('ko-KR');
  } catch {
    output.title = '조회수를 불러올 수 없습니다.';
  }
}

showViewCount();
