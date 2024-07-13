async function addFavorite(productId) {
    try {
        const response = await fetch(`/api/product/${productId}/favorite/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ product_id: productId }),
        });
        if (response.ok) {
            updateFavoriteButton(productId, true);
            // La favorite a été ajoutée avec succès
        } else {
            // Une erreur s'est produite
            console.log('erreur dans addfavorite');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function removeFavorite(productId) {
    try {
        const response = await fetch(`/api/product/${productId}/favorite/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });
        if (response.ok) {
            updateFavoriteButton(productId, false);
            // La favorite a été supprimée avec succès
        } else {
            // Une erreur s'est produite
            console.log("l'erreur est dans removefavorite");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}



function updateFavoriteButton(productId, isFavorite) {
    const favoriteButtons = document.querySelectorAll(".favorite-button");
    favoriteButtons.forEach(button => {
        if (button.dataset.productId == productId) {
            if (isFavorite) {
                button.innerHTML = '<i class="fas fa-heart" ></i>';
                button.onclick = () => removeFavorite(productId);
            } else {
                button.innerHTML = '<i class="far fa-heart"></i>';
                button.onclick = () => addFavorite(productId);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Code à exécuter une fois que le DOM est chargé
    // Appels de fonction ou autres opérations liées au DOM
});




/* const button = document.querySelector(".remove-btn");
button.addEventListener("click", e=> removeProductInFavorite(favorite.id))
 */  
async function removeProductInFavorite(productId, rowId) {
    try {
        const response = await fetch(`/api/users/product/${productId}/remove/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });
        if (response.ok) {
            // Remove the row from the table on successful deletion
            document.getElementById(rowId).remove();
            // Optionally, you can show a success message here
        } else {
            // An error occurred
            console.log("l'erreur est dans removefavorite");
            alert('Il y a une erreur lors de la suppression.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}












