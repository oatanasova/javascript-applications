import { requestor } from "./requests.js";

document.querySelector('a[href]').addEventListener('click', something);

const form = document.querySelector('form');
form.addEventListener('submit', onSubmit);
form.querySelector('.cancel').addEventListener('click', onCancel);

async function onSubmit(e){
    e.preventDefault();

    const formData = new FormData(e.target);

    const title = formData.get('topicName');
    const username = formData.get('username');
    const content = formData.get('postText');
    
    if (!title || !username || !content ) {
        return;
    }

    const data = { 
        title: title, 
        username: username, 
        content: content };

    await requestor('/posts', "POST", data);
}

function onCancel(e){
    e.preventDefault();
    form.reset();
}

function something(){

}