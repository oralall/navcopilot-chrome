// Scroll to bottom of message box
export function scrollToBottom(targetId: string = 'messagearea') {
  const msgbox = document.getElementById(targetId) as HTMLDivElement;
  msgbox.scrollTop = msgbox.scrollHeight;
}
