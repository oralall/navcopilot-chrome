<script>
  import { showUserMessage } from '$lib';

  const chatboxHeight = 400;
  const site_name = 'Navcopilot';

  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      const message = evt.target.value.trim();
      if (message.length > 0) {
        evt.target.value = '';
        showUserMessage(message);
        //  sendMessageToLLM(message);
      }
    }
  };
</script>

<div class="light">
  <div class="flex flex-col w-[500px] max-w-md">
    <div class="flex flex-col flex-1 dark:bg-gray-800 bg-slate-100 opacity-100">
      <div
        class="pt-4 px-4 mb-4 overflow-y-auto
               transition-height duration-100 ease-in"
        id="messagearea"
        style="max-height: {chatboxHeight}px; min-height: {chatboxHeight}px;"
      >
        <div class="chatbox-wrap pt-3">
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
              Welcome to {site_name}! How can I assist you today?
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 pb-4">
        <div class="p-2 rounded-xl shadow-md border">
          <form>
            <input
              id="chatinput"
              class="bg-transparent outline-none box-border w-full p-2 dark:text-white"
              placeholder="Start typing..."
              value=""
              on:keydown={handleKeyDown}
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
