function attachEvents() {
    const BASE_URL = 'http://localhost:3030/jsonstore/blog/';
    
    const postSelectorRef = document.getElementById('posts');
    const titleRef = document.getElementById('post-title');
    const bodyRef = document.getElementById('post-body');
    const commentsRef = document.getElementById('post-comments');
    
    const loadBtn = document.getElementById('btnLoadPosts');
    const viewBtn = document.getElementById('btnViewPost');

    loadBtn.addEventListener('click', onLoadPosts);
    viewBtn.addEventListener('click', onViewPosts);

    async function onLoadPosts() {
        postSelectorRef.innerHTML = '';

        try{
            const response = await fetch(BASE_URL + 'posts');
            const data = await response.json();
            if(!response.ok){
                throw new Error ("Request failed");
            }
            for(let post of Object.values(data)){
                const option = document.createElement('option');

                option.value = post.id;
                option.textContent = post.title;
                postSelectorRef.appendChild(option);
            }

        } catch (error){
            console.error(error);
        }
    }

    async function onViewPosts(){
        const selectedPost = postSelectorRef.value;
        if(!selectedPost) return;

        commentsRef.innerHTML = ''

        try {
            const [posts, comments] = await Promise.all([
                fetch(BASE_URL + 'posts'),
                fetch(BASE_URL + 'comments'),
            ]);
            const postsData = await posts.json();
            const commentData = await comments.json();

            const post = postsData[selectedPost];
            titleRef.textContent = post.title;
            bodyRef.textContent = post.body;

            const postComments = Object.values(commentData).filter(comment => comment.postId === post.id);

            for(let el of postComments){
                const liElement = document.createElement('li');
                liElement.textContent = el.text;

                commentsRef.appendChild(liElement);
            }


        } catch (error) {
            console.error(error);
        }

    }


}

attachEvents();