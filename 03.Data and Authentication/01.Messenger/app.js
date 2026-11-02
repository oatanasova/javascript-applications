function attachEvents() {
    const URL = 'http://localhost:3030/jsonstore/messenger';
    const authorRef = document.querySelector('[name = "author"]');
    const contentRef = document.querySelector('[name = "content"]');
    const msgArea = document.querySelector('#messages');

    document.getElementById('submit').addEventListener('click', onSubmit);
    document.getElementById('refresh').addEventListener('click', loadMsgs);

    async function onSubmit() {
        const author = authorRef.value;
        const content = contentRef.value;

        try {
            const response = await fetch(URL,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ author, content })
                }
            );

            if (!response.ok) {
                throw new Error("Could not send");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function loadMsgs() {
        try {
            const response = await fetch(URL);
            if (!response.ok) {
                throw new Error("Could not load");
            }
            const data = await response.json();

            msgArea.value = Object.values(data)
                .map(message => `${message.author}: ${message.content}`)
                .join('\n');
        } catch (error) {
            console.error(error);
        }
    }

}

attachEvents();