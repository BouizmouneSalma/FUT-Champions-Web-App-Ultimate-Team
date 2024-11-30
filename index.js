document.addEventListener("DOMContentLoaded", () => {
    // Éléments du input element
    const button = document.querySelector(".btn");
    const teamNameInput = document.getElementById("teamName");
    const teamNameDisplay = document.getElementById("tName");
    // Écouteur d'événement pour changer le nom d'équipe au clic sur le bouton
    button.addEventListener("click", () => {
        const val = teamNameInput.value.trim();
        if (val !== "") {
            teamNameDisplay.textContent = val;
        } else {
            alert("Veuillez entrer un nom d'équipe.");
        }
    });

    // Éléments du modal
    const modal = document.getElementById("playerModal");
    const modalContent = modal.querySelector(".modal-content");
    const playerContainers = document.querySelectorAll(".player-container");
    let fetchPlayers = async () => {
        try {
            const response = await fetch("https://fut.codia-dev.com/players.json");
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des joueurs");
            }
            const data = await response.json();
            console.log("Players fetched successfully:", data.players);
            return data.players;
        } catch (error) {
            console.error("Erreur :", error);
            alert("Impossible de récupérer les joueurs Veuillez réessayer.");
        }
    };
    // Fonction pour afficher les joueurs dans le modal 
    const displayPlayersInModal = (players, positionFilter = null) => {
        modalContent.innerHTML = "";
        // console.log("Displaying players in modal");
        let filteredPlayers;
        if (positionFilter) {
            filteredPlayers = players.filter((player) => player.position === positionFilter);
        } else {
            filteredPlayers = players;
        }
        // console.log("lenght of ");
        // console.log(filteredPlayers);
        if (filteredPlayers.length === 0) {
            modalContent.innerHTML = "<p>Aucun joueur disponible pour cette position.</p>";
        } else {
            filteredPlayers.forEach((player) => {
                const playerCard = document.createElement("div");
                playerCard.classList.add("player-card");
                playerCard.innerHTML = `
                    <img src="${player.photo || 'images/placeholder-card-normal.webp'}" alt="${player.name || 'Sans nom'}">
                    <h3>${player.name || 'Nom inconnu'}</h3>
                    <p>Position: ${player.position || 'Position inconnue'}</p>
                    <p>Club: <img src="${player.logo || 'images/placeholder-logo.png'}" alt="${player.club || 'Club inconnu'}" style="width: 20px;"> ${player.club || 'Inconnu'}</p>
                    <p>Nationalité: <img src="${player.flag || 'images/placeholder-flag.png'}" alt="${player.nationality || 'Nationalité inconnue'}" style="width: 20px;"> ${player.nationality || 'Inconnue'}</p>
                    <p>Note: ${player.rating || 'Non noté'}</p>
                `;

                // Ajouter un événement de clic pour sélectionner le joueur
                playerCard.addEventListener("click", () => {
                    console.log("Player selected:", player.name);
                    assignPlayerToField(player);
                    modal.style.display = "none"; // Fermer le modal apres la sélection
                });
                modalContent.appendChild(playerCard);
            });
        }
    };
    // Fonction pour assigner un joueur a terrain
    const assignPlayerToField = (player) => {
        // console.log("Assigning player to field:", player.name);
        const selectedContainer = document.querySelector(".player-container.selected");
        if (selectedContainer) {
            const playerImage = selectedContainer.querySelector("img");
            const playerPosition = selectedContainer.querySelector(".place");

            playerImage.src = player.photo; // Mettre à jour la photo du joueur
            playerImage.alt = player.name;
            playerPosition.textContent = player.name; // Afficher le nom du joueur dans la position
            selectedContainer.classList.remove("selected");
        } else {
            console.error("Aucun conteneur de joueur sélectionné.");
        }
    };

    // Ajouter un événement de clic à chaque conteneur de joueur sur le terrain
    playerContainers.forEach((container) => {
        container.addEventListener("click", async () => {
            // console.log("Player container clicked:", container.id);
            playerContainers.forEach((c) => c.classList.remove("selected")); // Désélectionner les autres
            container.classList.add("selected"); // Sélectionner l'élément actuel

            const position = container.querySelector(".place").textContent; // Obtenir la position actuelle
            // console.log("Fetching players for position:", position);
            const players = await fetchPlayers(); // Récupérer la liste des joueurs
            displayPlayersInModal(players, position); // Afficher les joueurs dans le modal
            modal.style.display = "flex"; // Afficher le modal
        });
    });

    // Fermer le modal lorsqu'on clique en dehors
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    const playerModal = document.getElementById("playerModal");
    const showPlayersBtn = document.getElementById("showPlayersBtn");
    const playerList = document.getElementById("playerList");
     // Récupérer les boutons "plus" dans la section "chang"
     const plusButtons = document.querySelectorAll(".card-container .plus");

     let selectedCardContainer = null; // Conteneur sélectionné dans "chang"

     // Fonction pour gérer le clic sur les boutons "plus"
     plusButtons.forEach((plusButton) => {
         plusButton.addEventListener("click", async () => {
             console.log("Bouton 'plus' cliqué !");

             // Associer le conteneur parent au bouton cliqué
             selectedCardContainer = plusButton.closest(".card-container");

             // Récupérer les joueurs depuis l'API
             const players = await fetchPlayers();

             // Afficher les joueurs dans la fenêtre modale
             displayPlayersInModal(players);

             // Afficher le modal
             modal.style.display = "flex";
         });
     });
    

    // Selectioner les elements de ajout
    const addPlayerButton = document.getElementById("ajout");
    const addPlayerModal = document.querySelector(".add-player-modal");
    // Ouvrir le formulaire d'ajout de joueur
    addPlayerButton.addEventListener("click", () => {   
        addPlayerModal.style.display = "flex";
        });
    const addPlayerToLocalStorage = (player) => {
        // Vérifiez s'il y a déjà des joueurs dans localStorage
        let storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
        // Ajoutez le nouveau joueur à la liste
        storedPlayers.push(player);
        // Mettez à jour le localStorage
        localStorage.setItem("players", JSON.stringify(storedPlayers));
        console.log("Joueur ajouté à localStorage:", player);
    };


});