<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(0);
ini_set('display_errors', 0);

// Inclure la configuration de la base de données
require_once 'connexion.php';

try {
    // Récupération et nettoyage des données du formulaire
    $prenom = isset($_POST['prenom']) ? trim($_POST['prenom']) : '';
    $nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $telephone = isset($_POST['telephone']) ? trim($_POST['telephone']) : '';
    $date = isset($_POST['date']) ? trim($_POST['date']) : '';
    $service = isset($_POST['service']) ? trim($_POST['service']) : '';
    $couverts = isset($_POST['couverts']) ? trim($_POST['couverts']) : '';
    $menu = isset($_POST['menu']) ? trim($_POST['menu']) : '';
    $demandes = isset($_POST['demandes']) ? trim($_POST['demandes']) : '';

    // Validation des champs obligatoires
    $erreurs = [];

    if (empty($prenom)) {
        $erreurs[] = "Le prénom est obligatoire.";
    }

    if (empty($nom)) {
        $erreurs[] = "Le nom est obligatoire.";
    }

    if (empty($email)) {
        $erreurs[] = "L'adresse e-mail est obligatoire.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erreurs[] = "L'adresse e-mail n'est pas valide.";
    }

    if (empty($date)) {
        $erreurs[] = "La date de réservation est obligatoire.";
    } else {
        // Vérifier que la date n'est pas dans le passé
        $dateReservation = strtotime($date);
        $dateAujourd = strtotime(date('Y-m-d'));
        if ($dateReservation < $dateAujourd) {
            $erreurs[] = "La date de réservation ne peut pas être dans le passé.";
        }
    }

    if (empty($service)) {
        $erreurs[] = "Le service (horaire) est obligatoire.";
    }

    if (empty($couverts)) {
        $erreurs[] = "Le nombre de couverts est obligatoire.";
    }

    // Si des erreurs, les retourner
    if (!empty($erreurs)) {
        http_response_code(400);
        echo json_encode([
            'succes' => false,
            'message' => 'Erreurs dans le formulaire',
            'erreurs' => $erreurs
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Préparer l'insertion dans la base de données
    $stmt = $conn->prepare("INSERT INTO reservations (prenom, nom, email, telephone, date_reservation, service, couverts, menu, demandes, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'en attente')");
    
    if (!$stmt) {
        throw new Exception("Erreur de préparation: " . $conn->error);
    }

    // Binder les paramètres
    $stmt->bind_param(
        "sssssssss",
        $prenom,
        $nom,
        $email,
        $telephone,
        $date,
        $service,
        $couverts,
        $menu,
        $demandes
    );

    // Exécuter la requête
    if (!$stmt->execute()) {
        throw new Exception("Erreur lors de l'enregistrement: " . $stmt->error);
    }

    $reservation_id = $stmt->insert_id;
    $stmt->close();

    // Retour de succès
    http_response_code(200);
    echo json_encode([
        'succes' => true,
        'message' => 'Votre demande de réservation a bien été reçue !',
        'reservation_id' => $reservation_id,
        'details' => [
            'nom_complet' => $prenom . ' ' . $nom,
            'date' => date('d/m/Y', strtotime($date)),
            'service' => $service,
            'couverts' => $couverts
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    error_log("Erreur traitement.php: " . $e->getMessage());
    echo json_encode([
        'succes' => false,
        'message' => 'Une erreur système est survenue',
        'erreurs' => ['Veuillez réessayer plus tard']
    ], JSON_UNESCAPED_UNICODE);
} finally {
    // Fermer la connexion si elle existe
    if (isset($conn)) {
        $conn->close();
    }
}
?>
