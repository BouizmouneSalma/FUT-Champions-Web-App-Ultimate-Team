document.addEventListener("DOMContentLoaded", () => {
    // Éléments pour la fonctionnalité de nom d'équipe
    const button = document.querySelector(".btn");
    const teamNameInput = document.getElementById("teamName");
    const teamNameDisplay = document.getElementById("tName");

    // Définir le nom d'équipe au clic sur le bouton
    button.addEventListener("click", () => {
        const val = teamNameInput.value.trim();
        if (val !== "") {
            teamNameDisplay.textContent = val;
        } else {
            alert("Veuillez entrer un nom d'équipe.");
        }
    });

    // Éléments du modal
    const modal = document.getElementById("playerModal"); // Assurez-vous que l'élément a bien l'ID "playerModal"
    const modalContent = modal.querySelector(".modal-content"); // Le contenu du modal
    const playerContainers = document.querySelectorAll(".player-container"); // Conteneurs des joueurs sur le terrain

    // Fonction pour récupérer les joueurs depuis l'API
    const fetchPlayers = async () => {
        try {
            console.log("Fetching players...");
            const response = await fetch("https://fut.codia-dev.com/players.json");
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des joueurs");
            }
            const data = await response.json();
            console.log("Players fetched successfully:", data.players);
            return data.players;
        } catch (error) {
            console.error("Erreur :", error);
            alert("Impossible de récupérer les joueurs. Veuillez réessayer.");
            return [];
        }
    };

    // Fonction pour afficher les joueurs dans le modal
    const displayPlayersInModal = (players, positionFilter = null) => {
        modalContent.innerHTML = ""; // Réinitialiser le contenu du modal
        console.log("Displaying players in modal...");

        // Filtrer les joueurs par position si nécessaire
        const filteredPlayers = positionFilter
            ? players.filter((player) => player.position === positionFilter)
            : players;

        if (filteredPlayers.length === 0) {
            modalContent.innerHTML = "<p>Aucun joueur disponible pour cette position.</p>";
        } else {
            // Ajouter chaque joueur au modal
            filteredPlayers.forEach((player) => {
                const playerCard = document.createElement("div");
                playerCard.classList.add("player-card");
                playerCard.innerHTML = `
                    <img src="${player.photo}" alt="${player.name}">
                    <h3>${player.name}</h3>
                    <p>Position: ${player.position}</p>
                    <p>Club: <img src="${player.logo}" alt="${player.club}" style="width: 20px;"> ${player.club}</p>
                    <p>Nationalité: <img src="${player.flag}" alt="${player.nationality}" style="width: 20px;"> ${player.nationality}</p>
                    <p>Note: ${player.rating}</p>
                `;

                // Ajouter un événement de clic pour sélectionner le joueur
                playerCard.addEventListener("click", () => {
                    console.log("Player selected:", player.name);
                    assignPlayerToField(player);
                    modal.style.display = "none"; // Fermer le modal après la sélection
                });

                modalContent.appendChild(playerCard);
            });
        }

        // Ajouter un bouton pour fermer le modal
        const closeModalButton = document.createElement("button");
        closeModalButton.textContent = "Fermer";
        closeModalButton.classList.add("btn");
        closeModalButton.style.marginTop = "20px";
        closeModalButton.addEventListener("click", () => {
            modal.style.display = "none";
        });
        modalContent.appendChild(closeModalButton);
    };

    // Fonction pour assigner un joueur à une carte du terrain
    const assignPlayerToField = (player) => {
        console.log("Assigning player to field:", player.name);
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
            console.log("Player container clicked:", container.id);
            playerContainers.forEach((c) => c.classList.remove("selected")); // Désélectionner les autres
            container.classList.add("selected"); // Sélectionner l'élément actuel

            const position = container.querySelector(".place").textContent; // Obtenir la position actuelle
            console.log("Fetching players for position:", position);
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
        const closeModal = document.getElementById("closeModal");
        const playerList = document.getElementById("playerList");

        // Vérifier si les éléments existent avant d'ajouter des écouteurs
        if (showPlayersBtn) {
            // Exemple de données de joueurs à afficher (vous pouvez les remplacer par les données de votre API)
            const players = [
                { name: "Lionel Messi", position: "RW", club: "PSG", rating: 93 },
                { name: "Cristiano Ronaldo", position: "ST", club: "Al Nassr", rating: 92 },
                { name: "Kevin De Bruyne", position: "CM", club: "Manchester City", rating: 91 }
            ];

            // Afficher le modal avec la liste des joueurs
            showPlayersBtn.addEventListener("click", () => {
                playerList.innerHTML = "";
                players.forEach(player => {
                    const playerCard = document.createElement("div");
                    playerCard.classList.add("player-card");
                    playerCard.innerHTML = `
                        <h3>${player.name}</h3>
                        <p>Position: ${player.position}</p>
                        <p>Club: ${player.club}</p>
                        <p>Note: ${player.rating}</p>
                    `;
                    playerList.appendChild(playerCard);
                });
                playerModal.style.display = "block";
            });
        }

        if (closeModal) {
            // Fermer le modal
            closeModal.addEventListener("click", () => {
                playerModal.style.display = "none";
            });
        }

        // Fermer le modal si l'utilisateur clique en dehors du modal
        window.addEventListener("click", (event) => {
            if (event.target === playerModal) {
                playerModal.style.display = "none";
            }
        });
    
// 


    // Fonction pour gérer le clic sur les boutons "plus"
    const plusButtons = document.querySelectorAll(".card-container .plus");

    plusButtons.forEach((plusButton) => {
        plusButton.addEventListener("click", async () => {
            console.log("Bouton plus cliqué !");
            
            // Récupérer les joueurs depuis l'API
            const players = await fetchPlayers();
            
            // Afficher les joueurs dans le modal
            displayPlayersInModal(players);
            
            // Afficher le modal
            modal.style.display = "flex";
        });
    });
    document.addEventListener("DOMContentLoaded", () => {
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
    
        // Fonction pour afficher les joueurs dans le modal
        const displayPlayersInModal = (players) => {
            modalContent.innerHTML = ""; // Réinitialiser le contenu du modal
            console.log("Affichage des joueurs dans le modal...");
    
            if (players.length === 0) {
                modalContent.innerHTML = "<p>Aucun joueur disponible.</p>";
            } else {
                // Créer une carte pour chaque joueur
                players.forEach((player) => {
                    const playerCard = document.createElement("div");
                    playerCard.classList.add("player-card");
                    playerCard.innerHTML = `
                        <img src="${player.photo}" alt="${player.name}">
                        <h3>${player.name}</h3>
                        <p>Position: ${player.position}</p>
                        <p>Club: <img src="${player.logo}" alt="${player.club}" style="width: 20px;"> ${player.club}</p>
                        <p>Nationalité: <img src="${player.flag}" alt="${player.nationality}" style="width: 20px;"> ${player.nationality}</p>
                        <p>Note: ${player.rating}</p>
                    `;
    
                    // Ajouter un événement de clic pour sélectionner le joueur
                    playerCard.addEventListener("click", () => {
                        console.log("Joueur sélectionné :", player.name);
    
                        // Ajouter les détails du joueur dans le conteneur sélectionné
                        if (selectedCardContainer) {
                            selectedCardContainer.innerHTML = `
                                <img src="${player.photo}" alt="${player.name}">
                                <div class="player-info">
                                    <h3>${player.name}</h3>
                                    <p>Position: ${player.position}</p>
                                </div>
                            `;
                        }
    
                        // Fermer le modal
                        modal.style.display = "none";
                    });
    
                    modalContent.appendChild(playerCard);
                });
            }
    
            // Ajouter un bouton pour fermer le modal
            const closeModalButton = document.createElement("button");
            closeModalButton.textContent = "Fermer";
            closeModalButton.classList.add("btn");
            closeModalButton.style.marginTop = "20px";
            closeModalButton.addEventListener("click", () => {
                modal.style.display = "none";
            });
            modalContent.appendChild(closeModalButton);
        };
    
        // Fonction pour récupérer les joueurs depuis l'API
        const fetchPlayers = async () => {
            try {
                console.log("Fetching players...");
                const response = await fetch("https://fut.codia-dev.com/players.json");
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des joueurs");
                }
                const data = await response.json();
                console.log("Players fetched successfully:", data.players);
                return data.players;
            } catch (error) {
                console.error("Erreur :", error);
                alert("Impossible de récupérer les joueurs. Veuillez réessayer.");
                return [];
            }
        };
    
        // Fermer le modal lorsqu'on clique en dehors
        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });

    // Selectioner les elements
    const addPlayerButton = document.getElementById("ajout");
    const addPlayerModal = document.querySelector(".add-player-modal");
    const closeAddModalButton = document.querySelector(".close-add-modal");
    
    addPlayerButton.addEventListener("click", () => {
            addPlayerModal.style.display = "flex"; // Rendre visible la modale
        });


        document.addEventListener("DOMContentLoaded", () => {
            // Sélection des éléments
            const addPlayerButton = document.getElementById("ajout");
            const addPlayerModal = document.querySelector(".add-player-modal");
            const closeAddModalButton = document.querySelector(".close-add-modal");
        
            // Afficher le formulaire d'ajout de joueur
            addPlayerButton.addEventListener("click", () => {
                addPlayerModal.style.display = "flex"; // Rendre visible la modale
            });
        
            // Cacher le formulaire d'ajout de joueur
            closeAddModalButton.addEventListener("click", () => {
                addPlayerModal.style.display = "none"; // Cacher la modale
            });
        
            // Cacher la modale si l'utilisateur clique en dehors
            window.addEventListener("click", (event) => {
                if (event.target === addPlayerModal) {
                    addPlayerModal.style.display = "none";
                }
            });
        
            // Ajouter un joueur avec les données du formulaire
            const playerForm = document.getElementById("playerForm");
            playerForm.addEventListener("submit", (event) => {
                event.preventDefault(); // Empêcher la soumission du formulaire
        
                // Récupérer les données du formulaire
                const formData = new FormData(playerForm);
                const newPlayer = {};
                formData.forEach((value, key) => {
                    newPlayer[key] = value;
                });
        
                console.log("Nouveau joueur ajouté :", newPlayer);
        
                // Vous pouvez ici ajouter le joueur à une liste ou un tableau
                alert(`Joueur ajouté : ${newPlayer.playerName}`);
        
                // Réinitialiser le formulaire et fermer la modale
                playerForm.reset();
                addPlayerModal.style.display = "none";
            });
        });
        

    
});





