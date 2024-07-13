// Récupérer le nom d'utilisateur de l'utilisateur connecté
const currentUsername = "{{ request.user.username }}";

// Fonction pour récupérer le jeton CSRF à partir du cookie
function getCookie(name) {
    const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
}

function toggleLike(publicationId) {
    fetch(`/blog/publication/${publicationId}/toggle_like/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'), // Récupérer le jeton CSRF à partir du cookie
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const likeButton = document.getElementById('likeButton');
            const likeCount = document.getElementById('likeCount');

            if (data.is_liked) {
                likeButton.innerHTML = '<i class="fas fa-thumbs-up"></i> J\'aime';
            } else {
                likeButton.innerHTML = '<i class="far fa-thumbs-up"></i> J\'aime';
            }

            likeCount.innerHTML = data.likes_count;
        })
        .catch((error) => console.error('Erreur :', error));
}

document.getElementById('commentForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken'), // Récupérer le jeton CSRF à partir du cookie
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const commentList = document.getElementById('commentList');

            const commentItem = document.createElement('div');
            commentItem.classList.add('content-blog', 'format-quote', 'mt--10', 'mb--50', 'mb_sm--30');
            commentItem.innerHTML = `
                <div class="inner">
                    <div class="content">
                        <blockquote>
                            <li>“${data.content}”</li>
                        </blockquote>
                        <div class="lax-post-meta">
                            <div class="post-author-avatar">
                                <img src="{{ data.user_avatar }}" alt="${data.user}">
                            </div>
                            <div class="post-meta-content">
                                <h6 class="author-title">
                                    <a href="#">${data.user}</a>
                                </h6>
                                <ul class="post-meta-list">
                                    <li>Maintenant</li>
                                    <li>0 Vues</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>`;
            commentList.prepend(commentItem);
        })
        .catch((error) => console.error('Erreur :', error));
});
