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
      ? (source.id === 'kakao' ? '카카오톡 ID 복사 완료' : '양식 복사 완료')
      : '자동 복사 실패. 선택된 텍스트는 기기의 복사 기능으로 복사할 수 있습니다.';
    messageTimeout = setTimeout(() => { statusMessage.textContent = ''; }, 3200);
  });
});
