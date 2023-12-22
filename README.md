# Projet de Visualisation des Arrêts et Circuits de Transport à Nantes
## Description du Projet
Ce projet vise à créer une application de visualisation des arrêts de tram et de bus, ainsi que de leurs circuits, à Nantes. Les données sont récupérées à partir d'une API publique fournissant des informations sur les transports en commun dans la région de Nantes. L'objectif principal est de présenter ces données de manière claire et interactive sur une carte, permettant aux utilisateurs de visualiser facilement les arrêts, les circuits et d'explorer le réseau de transport.

## Fonctionnalités
### Affichage des Arrêts
Les arrêts de tram et de bus sont affichés sur la carte, offrant une vue d'ensemble des emplacements clés dans la ville.

### Circuits de Transport 
Les circuits de transport, à la fois pour les lignes de tram et de bus, sont représentés sur la carte pour permettre aux utilisateurs de comprendre les itinéraires disponibles.

### Interactivité 
L'application offre une expérience interactive où les utilisateurs peuvent activer ou désactiver l'affichage des arrêts, des circuits de tram et de bus, ainsi que d'autres filtres pertinents.

### Informations Détailées
En cliquant sur un arrêt ou un circuit, les utilisateurs peuvent accéder à des informations détaillées, telles que le nom de l'arrêt, l'accessibilité handicapé, et d'autres caractéristiques spécifiques.

### Précision des Itinéraires
Malgré les défis liés à la représentation des itinéraires de bus, des efforts sont déployés pour améliorer la précision en tenant compte des caractéristiques réelles des rues et des trajets empruntés.

## Technologies Utilisées
### Vue.js 
Le framework JavaScript Vue.js est utilisé pour le développement de l'interface utilisateur interactive.

### Leaflet
La bibliothèque Leaflet est employée pour l'intégration de cartes interactives dans l'application.

### Axios
Axios est utilisé pour effectuer des requêtes HTTP vers l'API publique et récupérer les données de transport.

## Installation et Utilisation
- Cloner le dépôt depuis GitHub.
- Installer les dépendances avec la commande
```npm install```
- Lancer l'application en local
```npm run serve```
L'application sera accessible à l'adresse http://localhost:8080 par défaut.
