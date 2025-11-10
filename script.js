1. DÉCLARATION DE LA BASE DE DONNÉES (Gestion du Local Storage)

let orders = []; // La liste commence vide

// Fonction pour récupérer les données sauvegardées ou utiliser des exemples
function loadOrders() {
    const savedOrders = localStorage.getItem('logiTrackOrders');
    if (savedOrders) {
        // CHARGE les données sauvegardées
        orders = JSON.parse(savedOrders);
    } else {
        // Utilise les données d'exemple SEULEMENT si aucune donnée n'est trouvée
        orders = [
            { id: 'T1001', client: 'Malak Logistique', depart: 'Meknès', livraison: 'Casablanca', typeCamion: 'Semi-remorque', telephone: '0661123456', statut: 'En cours' },
            { id: 'T1002', client: 'Client Pro', depart: 'Rabat', livraison: 'Fès', typeCamion: 'Fourgon', telephone: '0537987654', statut: 'Livré' },
            { id: 'T1003', client: 'Nouvelle Commande', depart: 'Tanger', livraison: 'Marrakech', typeCamion: 'Citerne', telephone: '0600112233', statut: 'À planifier' }
        ];
    }
}

// Fonction TRÈS IMPORTANTE pour sauvegarder l'état actuel des commandes
function saveOrders() {
    localStorage.setItem('logiTrackOrders', JSON.stringify(orders));
}

// Fonction pour générer un ID unique (T1004, etc.)
function generateId() {
    const lastId = orders.length > 0 ? orders[orders.length - 1].id : 'T1000';
    // Utilise le dernier ID de la liste chargée
    const num = parseInt(lastId.substring(1)) + 1; 
    return 'T' + num;
}

// 2. FONCTION D'AFFICHAGE : Met à jour le tableau HTML
function displayOrders() {
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = ''; 

    orders.forEach((order, index) => {
        const row = tableBody.insertRow();
        
        // Insère les données
        row.insertCell().textContent = order.id;
        row.insertCell().textContent = order.client;
        row.insertCell().textContent = order.depart;
        row.insertCell().textContent = order.livraison;
        row.insertCell().textContent = order.typeCamion;
        row.insertCell().textContent = order.telephone;
        
        // Cellule Statut
        const statutCell = row.insertCell();
        statutCell.textContent = order.statut;
        statutCell.style.fontWeight = 'bold'; 

        const actionCell = row.insertCell();
        const nextStatutButton = document.createElement('button');
        
        // Logique pour le bouton d'action
        if (order.statut === 'À planifier') {
            nextStatutButton.textContent = 'Passer à En cours';
            nextStatutButton.onclick = () => updateStatut(index, 'En cours');
            statutCell.style.color = 'blue';
        } else if (order.statut === 'En cours') {
            nextStatutButton.textContent = 'Marquer Livré';
            nextStatutButton.onclick = () => updateStatut(index, 'Livré');
            statutCell.style.color = 'orange';
        } else {
            nextStatutButton.textContent = 'Terminé';
            nextStatutButton.disabled = true; 
            nextStatutButton.style.backgroundColor = '#ccc'; 
            statutCell.style.color = 'green';
        }
        
        actionCell.appendChild(nextStatutButton);
    });
}

// 3. FONCTION DE MISE À JOUR : Change le statut et SAUVEGARDE
function updateStatut(index, newStatut) {
    orders[index].statut = newStatut;
    saveOrders(); // <-- SAUVEGARDE !
    displayOrders();
}

// 4. GESTION DU FORMULAIRE : Ajoute une nouvelle commande et SAUVEGARDE
document.getElementById('addOrderForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const newOrder = {
        id: generateId(),
        client: document.getElementById('client').value,
        depart: document.getElementById('adresseDepart').value,
        livraison: document.getElementById('adresseLivraison').value,
        typeCamion: document.getElementById('typeCamion').value,
        telephone: document.getElementById('telephone').value,
        statut: 'À planifier' 
    };

    orders.push(newOrder);
    saveOrders(); // <-- SAUVEGARDE !
    displayOrders();
    this.reset();
});

// 5. INITIALISATION : Charge et affiche les commandes au chargement de la page
loadOrders(); 
displayOrders();
