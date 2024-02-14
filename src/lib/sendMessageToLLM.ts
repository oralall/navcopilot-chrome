import { scrollToBottom } from '$lib/scrollToBottom';
import { API } from '../constants';
import { checkLocalStorageFingerprint } from '$lib/utils';

// Show loading gif
function showLoadingGif() {
  const msgpage = document.querySelector('.chatbox-wrap') as HTMLDivElement;
  let div = document.createElement('div');
  div.className = 'flex my-2 justify-start items-center';
  div.innerHTML = `
      <div
        class="flex w-8 h-8 justify-center items-center mr-2 rounded-full text-white bg-blue-500"
      >
        A
      </div>
      <div
        class="aisay rounded py-2 px-3 bg-gray-100 dark:bg-gray-700 dark:text-white"
        style="max-width: 80%;"
      >
        <span class="loading loading-spinner loading-sm"></span>
      </div>
  `;

  msgpage.appendChild(div);
  scrollToBottom();
  return div;
}

// Show loading gif
function showErrorInfo(msg: string = '') {
  const msgpage = document.querySelector('#messagearea') as HTMLDivElement;
  let div = document.createElement('div');
  div.className = 'chatbox-wrap pt-3';
  div.innerHTML = `
    <div class="flex my-2 justify-start items-center">
      <div
        class="flex w-8 h-8 justify-center items-center mr-2 rounded-full text-white bg-blue-500"
      >
        A
      </div>
      <div
        class="rounded py-2 px-3 bg-gray-100 dark:bg-gray-700 dark:text-white"
        style="max-width: 80%;"
      >
        ${msg}
      </div>
    </div>
  `;

  msgpage.appendChild(div);
  scrollToBottom();
  return div;
}

// Return child for message presentation.
function gptMessageReplaceLoadingGif(loadingDiv: HTMLDivElement, message: string = '') {
  let div = loadingDiv.querySelector('.aisay') as HTMLDivElement;
  div.innerHTML = message;
}

/**
 * Send message.
 * Scenario 1: user input message, and click Enter
 * Scenario 2: user click Send button
 * Scenario 3: new session due to session length limit
 */
export async function sendMessageToLLM(message: string = '') {
  const searchParams = new URLSearchParams(window.location.search);
  const room_uuid = searchParams.get('id') || '';

  // Send message to server
  const data = {
    prompt: message,
    rid: room_uuid
  };
  //const url = API.anonymous.message;
  const url = API.assistant_message;
  const fp = await checkLocalStorageFingerprint();
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      fingerprint: fp
    },
    body: JSON.stringify(data)
  })
    .then(async function (response) {
      try {
        const result = await response.json();
        if (result && result.statusCode === 200) {
          const run_id = result.run_id;
          const thread_id = result.thread_id;
          await talkToAssistant(run_id, thread_id, fp);
        } else {
          showErrorInfo('Error 1001!');
        }
      } catch (error) {
        console.error('sendMessageToLLM: error: ', error);
        showErrorInfo('Error 1002!');
      }
    })
    .catch(function (error) {
      console.log('sendMessageToLLM: error: ', error);
      showErrorInfo('Error 1003!');
    });
}

// Talk to Assistant
async function talkToAssistant(run_id: string, thread_id: string, fingerprint: string) {
  const timestamp = Math.floor(Date.now() / 1000);

  // Request run status
  const requestRunStatus = (count: number, loadingDiv: HTMLDivElement) => {
    if (count > 30) {
      showErrorInfo('Error 1004!');
      return;
    }

    // room uuid
    const searchParams = new URLSearchParams(window.location.search);
    const room_uuid = searchParams.get('id') || '';

    setTimeout(
      async () => {
        const url = `${API.assistant_run}?thread_id=${thread_id}&run_id=${run_id}&timestamp=${timestamp}&rid=${room_uuid}`;
        const r = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            fingerprint: fingerprint
          }
        });
        const d = await r.json();
        if (d && d.statusCode === 200) {
          for (let i = 0; i < d.answers.length; i++) {
            const answer = d.answers[i];
            if (i === 0) {
              gptMessageReplaceLoadingGif(loadingDiv, answer);
            }
            scrollToBottom();
          }
        } else {
          requestRunStatus(count + 1, loadingDiv);
        }
      },
      1000 + Math.floor(Math.random() * 5) * 1000
    );
  };

  // show loading
  const loadingDiv = showLoadingGif();

  // Check run
  requestRunStatus(0, loadingDiv);
}
