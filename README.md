# Projet 7 - Groupomania

##Procédure d'installation :

1.:Démarrez un invité de commande dans le dossier principal

2.:Exécutez la commande npm install

3.:Connectez-vous au serveur mysql de votre choix et éxecutez la commande CREATE database_development;

4.:Toujours dans votre serveur mysql exécutez la commande SOURCE "chemin jusqu'au fichier database/social.sql"

5.:Créez un fichier .env en utilisant le fichier backend/exemple env.txt pour créer un token sécurisé

6.:Insérez votre identifiant et votre mot de passe de votre serveur mysql dans les fichiers config/config.json et backend/utils/database.js

7.:Dans votre invité de commande aller dans le dossier backend et exécutez la commande node server

8.:Vous pouvez accéder au site en ouvrant le fichier frontend/html/index.html

## Utilisation

Pour vous inscrire il faut renseigner votre nom, votre prénom, votre email et un mot de passe avec au moins une lettre majuscule, une lettre minuscule, un chiffre et 8 caractères au minimum

Une fois connecté vous pouvez voir les publications des utilisateurs et publier, ajouter des commentaires, et supprimer vos publications et commentaires comme vous le souhaitez

