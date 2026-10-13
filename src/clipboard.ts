export async function copyText(text: string): Promise<void> {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Older browsers can still copy from a user-initiated click.
    const previous = document.activeElement;
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(field);
    try {
      field.select();
      if (!document.execCommand('copy')) throw new Error('Clipboard access denied');
    } finally {
      field.remove();
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    }
  }
}
