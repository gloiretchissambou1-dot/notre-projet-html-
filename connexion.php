<?php
// Configuration de la base de données MySQL

$host = 'localhost';      // Serveur MySQL
$user = 'root';           // Utilisateur MySQL
$password = '';           // Mot de passe MySQL
$database = 'la_mandarine'; // Nom de la base de données

// Créer la connexion
$conn = new mysqli($host, $user, $password, $database);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode([
        'succes' => false,
        'message' => 'Erreur de connexion à la base de données',
        'erreur' => $conn->connect_error
    ]));
}

// Définir le charset UTF-8
$conn->set_charset("utf8mb4");

// Créer la table si elle n'existe pas
$sql_create_table = "CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telephone VARCHAR(20),
    date_reservation DATE NOT NULL,
    service VARCHAR(50) NOT NULL,
    couverts VARCHAR(50) NOT NULL,
    menu VARCHAR(100),
    demandes TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'en attente' COMMENT 'en attente, confirmée, annulée'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if (!$conn->query($sql_create_table)) {
    error_log("Erreur création table: " . $conn->error);
}

?>
