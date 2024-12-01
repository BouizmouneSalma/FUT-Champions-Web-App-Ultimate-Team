document.addEventListener("DOMContentLoaded", async () => {
    // Éléments du input element
    const button = document.querySelector(".btn");
    const teamNameInput = document.getElementById("teamName");
    const teamNameDisplay = document.getElementById("tName");
   
    // Éléments du modal
    const modal = document.getElementById("playerModal");
    const modalContent = modal.querySelector(".modal-content");
    const playerContainers = document.querySelectorAll(".player-container");
    const addPlayerModal = document.querySelector(".add-player-modal");
    const playerForm = document.getElementById("playerForm");
    const plusPlayerModal = document.getElementsByClassName("plus");
    const addPlayerButton = document.getElementById("ajout");
    
    // Fonction pour gérer les erreurs de chargement des images
    const handleImageError = (img, fallbackUrl) => {
        img.onerror = () => {
            img.src = fallbackUrl;
        };
    };

    // Fonction pour récupérer les joueurs depuis l'API et les stocker dans le localStorage
    const fetchAndStorePlayers = async () => {
        try {
            const response = await fetch("https://fut.codia-dev.com/players.json");
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des joueurs");
            }
            const data = await response.json();
            console.log("Players fetched successfully:", data.players);
            localStorage.setItem("players", JSON.stringify(data.players));
        } catch (error) {
            console.error("Erreur :", error);
            alert("Impossible de récupérer les joueurs. Veuillez réessayer.");
        }
    };

    // Fonction pour récupérer les joueurs depuis le localStorage
    const getPlayersFromLocalStorage = () => {
        const localPlayers = JSON.parse(localStorage.getItem("players")) || [];
        console.log("Players from localStorage:", localPlayers);
        return localPlayers;
    };

    // Fonction pour afficher les joueurs dans le modal
    const displayPlayersInModal = (players, positionFilter = null) => {
        modalContent.innerHTML = "";

        let filteredPlayers;
        if (positionFilter) {
            filteredPlayers = players.filter((player) => player.position === positionFilter);
        } else {
            filteredPlayers = players;
        }

        if (filteredPlayers.length === 0) {
            modalContent.innerHTML = "<p>Aucun joueur disponible pour cette position.</p>";
        } else {
            filteredPlayers.forEach((player) => {
                const playerCard = document.createElement("div");
                playerCard.classList.add("player-card");
                playerCard.innerHTML = `
                    <img src="${player.photo || 'images/img1.png'}" alt="${player.name || 'Sans nom'}">
                    <h3>${player.name || 'Oussama' || 'Modritch'}</h3>
                    <p>Position: ${player.position || 'ST'}</p>
                    <p>Club: <img src="${player.logo || 'images/ar.webp'}" alt="${player.club || 'Club inconnu'}" style="width: 20px;"> ${player.club || 'Inconnu'}</p>
                    <p>Nationalité: <img src="${player.flag || 'images/ar.webp'}" alt="${player.nationality || 'Nationalité inconnue'}" style="width: 20px;"> ${player.nationality || 'Inconnue'}</p>
                    <p>Note: ${player.rating || 'Non noté'}</p>
                `;

                // Gérer les erreurs de chargement des images
                playerCard.querySelectorAll('img').forEach((img) => {
                    handleImageError(img, img.alt.includes('flag') ? './images/placeholder-flag.png' : './images/placeholder-logo.png');
                });
                // Ajouter un événement de clic pour sélectionner le joueur
                playerCard.addEventListener("click", () => {
                    console.log("Player selected:", player.name);
                    assignPlayerToField(player);
                    modal.style.display = "none"; // Fermer le modal après la sélection
                });
                modalContent.appendChild(playerCard);
            });
        }
    };

    // Fonction pour assigner un joueur au terrain
    const assignPlayerToField = (player) => {
        const selectedContainer = document.querySelector(".player-container.selected");
        if (selectedContainer) {
            const playerImage = selectedContainer.querySelector("img");
            const playerPosition = selectedContainer.querySelector(".place");

            playerImage.src = player.photo; // Mettre à jour la photo du joueur
            playerImage.alt = player.name;
            handleImageError(playerImage, 'images/placeholder-card-normal.webp'); // Gérer l'erreur de chargement d'image
            playerPosition.textContent = player.name; // Afficher le nom du joueur dans la position
            selectedContainer.classList.remove("selected");
        } else {
            console.error("Aucun conteneur de joueur sélectionné.");
        }
    };

    // Ajouter un événement de clic à chaque conteneur de joueur sur le terrain
    playerContainers.forEach((container) => {
        container.addEventListener("click", async () => {
            playerContainers.forEach((c) => c.classList.remove("selected")); // Désélectionner les autres
            container.classList.add("selected"); // Sélectionner l'élément actuel

            const position = container.querySelector(".place").textContent; // Obtenir la position actuelle
            const players = getPlayersFromLocalStorage(); // Récupérer la liste des joueurs depuis le localStorage
            displayPlayersInModal(players, position); // Afficher les joueurs dans le modal
            modal.style.display = "flex"; // Afficher le modal
        });
    });

    // Ajouter un événement de clic au bouton "plus" pour afficher tous les joueurs
    Array.from(plusPlayerModal).forEach((plusButton) => {
        plusButton.addEventListener("click", async () => {
            const players = getPlayersFromLocalStorage(); // Récupérer la liste des joueurs depuis le localStorage
            displayPlayersInModal(players); // Afficher tous les joueurs dans le modal
            modal.style.display = "flex"; // Afficher le modal
        });
    });

    // Fermer le modal lorsqu'on clique en dehors
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    addPlayerButton.addEventListener("click", () => {
        addPlayerModal.style.display = "flex";
    });

    const addPlayerToLocalStorage = (player) => {
        // Vérifiez s'il y a déjà des joueurs dans localStorage
        let storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
        storedPlayers.push(player);
        // Mettez à jour le localStorage
        localStorage.setItem("players", JSON.stringify(storedPlayers));
        console.log("Joueur ajouté à localStorage:", player);
    };

    // Ajouter un joueur avec les données du formulaire
    playerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Récupérer les données du formulaire
        const formData = new FormData(playerForm);
        const newPlayer = {};
        formData.forEach((value, key) => {
            newPlayer[key] = value;
        });

        console.log("Nouveau joueur ajouté :", newPlayer);

        // Sauvegarder le joueur dans localStorage
        addPlayerToLocalStorage(newPlayer);

        // Réinitialiser le formulaire et fermer la modale
        playerForm.reset();
        addPlayerModal.style.display = "none";

        // Mettre à jour la liste des joueurs et afficher dans le modal
        const players = getPlayersFromLocalStorage(); // Récupérer la liste des joueurs depuis le localStorage
        displayPlayersInModal(players); // Afficher tous les joueurs dans le modal
    });

    // Gérer le clic sur le bouton "Fermer" pour fermer la modale
    button.addEventListener("click", () => {
        const val = teamNameInput.value.trim();
        if (val !== "") {
            teamNameDisplay.textContent = val;
        } else {
            alert("Veuillez entrer un nom d'équipe.");
        }
    });

    // Récupérer les joueurs depuis l'API et les stocker dans le localStorage au chargement de la page
    await fetchAndStorePlayers();
});

