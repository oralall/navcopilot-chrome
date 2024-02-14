import { scrollToBottom } from './scrollToBottom';

export const showUserMessage = (msg: string) => {
  if (!msg || msg.length === 0) {
    return;
  }

  const msgpage = document.querySelector('.chatbox-wrap') as HTMLDivElement;
  let div = document.createElement('div');
  div.innerHTML = `
    <div class="flex my-2 justify-end">
      <div class="rounded py-2 px-3 text-white bg-blue-500" style="max-width: 80%;">
        ${msg}
      </div>
    </div>
  `;
  msgpage.appendChild(div);
  scrollToBottom();
  return div;
};
