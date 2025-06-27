
# VulnApp - Application Web d'Entraînement

## Description

VulnApp est une application web moderne conçue pour l'apprentissage de la cybersécurité. Elle simule une plateforme utilisateur classique avec différentes fonctionnalités courantes et contient **volontairement** des failles de sécurité pour l'entraînement au pentest.

⚠️ **ATTENTION** : Cette application contient des vulnérabilités intentionnelles. Ne jamais déployer en production !

## Déploiement sur Debian/Kali Linux avec MariaDB

### Prérequis système

- Debian/Kali Linux
- Node.js (version 16 ou supérieure)
- npm ou yarn
- MariaDB Server
- Apache2 ou Nginx (optionnel, pour servir l'application)

### Installation étape par étape

#### 1. Installation des dépendances système

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js et npm
sudo apt install -y nodejs npm

# Installation de MariaDB
sudo apt install -y mariadb-server mariadb-client

# Installation d'Apache (optionnel)
sudo apt install -y apache2
```

#### 2. Configuration de MariaDB

```bash
# Sécurisation de base de MariaDB
sudo mysql_secure_installation

# Connexion à MariaDB en tant que root
sudo mysql -u root -p

# Dans le prompt MySQL, créer la base de données
# (ou utiliser le fichier SQL fourni - voir étape 3)
```

#### 3. Import de la base de données

```bash
# Import du schéma de base de données
sudo mysql -u root -p < database.sql

# Vérification de l'import
sudo mysql -u root -p -e "USE vulnapp; SHOW TABLES;"
```

#### 4. Installation de l'application

```bash
# Clonage du repository (si applicable)
git clone <votre-repository-url>
cd vulnapp

# Installation des dépendances Node.js
npm install

# Configuration de l'environnement (créer un fichier de config si nécessaire)
# Note : Cette application utilise localStorage pour la simulation
# Pour une vraie connexion BDD, il faudrait un backend PHP/Node.js
```

#### 5. Démarrage de l'application

```bash
# Démarrage en mode développement
npm run dev

# L'application sera accessible sur http://localhost:5173
```

#### 6. Configuration Apache (optionnel - pour production)

```bash
# Compilation pour la production
npm run build

# Copie des fichiers vers Apache
sudo cp -r dist/* /var/www/html/vulnapp/

# Configuration du virtual host Apache
sudo nano /etc/apache2/sites-available/vulnapp.conf
```

Exemple de configuration Apache :
```apache
<VirtualHost *:80>
    ServerName vulnapp.local
    DocumentRoot /var/www/html/vulnapp
    
    <Directory /var/www/html/vulnapp>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/vulnapp_error.log
    CustomLog ${APACHE_LOG_DIR}/vulnapp_access.log combined
</VirtualHost>
```

```bash
# Activation du site
sudo a2ensite vulnapp.conf
sudo systemctl reload apache2

# Ajout dans /etc/hosts pour accès local
echo "127.0.0.1 vulnapp.local" | sudo tee -a /etc/hosts
```

## Structure de la base de données

La base de données `vulnapp` contient les tables suivantes :

- `users` - Comptes utilisateurs (avec vulnérabilités d'authentification)
- `uploads` - Fichiers uploadés par les utilisateurs
- `contact_messages` - Messages du formulaire de contact
- `activity_logs` - Logs d'activité (vulnérable aux injections)
- `comments` - Commentaires (vulnérable XSS)
- `user_sessions` - Sessions utilisateur (gestion vulnérable)

## Connexion à la base de données

### Paramètres de connexion par défaut

- **Host** : localhost
- **Database** : vulnapp
- **Username** : vulnapp_user
- **Password** : vulnapp_pass123
- **Port** : 3306

### Test de connexion

```bash
# Test de connexion avec l'utilisateur vulnérable
mysql -u vulnapp_user -p vulnapp

# Dans le prompt MySQL
SHOW TABLES;
SELECT * FROM users;
```

## Comptes de test

Pour tester l'application, vous pouvez utiliser ces comptes :

- **Utilisateur standard** : `user` / `password`
- **Administrateur** : `admin` / `admin123`
- **Compte test** : `test` / `test123`
- **Invité** : `guest` / `guest`

## Vulnérabilités présentes

Cette application contient intentionnellement les vulnérabilités suivantes :

1. **Injection SQL** - Formulaires de connexion et recherche
2. **XSS (Cross-Site Scripting)** - Affichage de contenu non filtré
3. **CSRF (Cross-Site Request Forgery)** - Formulaires sans protection
4. **Upload de fichiers non sécurisé** - Validation côté client uniquement
5. **Inclusion de fichiers (LFI/RFI)** - Paramètres non validés
6. **Gestion de session vulnérable** - Session ID prévisible
7. **Contrôle d'accès cassé** - Vérifications insuffisantes
8. **Divulgation d'informations** - Erreurs et logs exposés
9. **Injection de commandes** - Exécution de commandes système
10. **SSRF** - Requêtes serveur non contrôlées

## Commandes disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie la qualité du code

## Sécurisation (pour référence uniquement)

⚠️ **Ces mesures ne sont PAS appliquées dans cette version vulnérable** :

- Hashage sécurisé des mots de passe (bcrypt, Argon2)
- Validation et sanitisation des entrées
- Protection CSRF avec tokens
- Validation stricte des uploads
- Gestion sécurisée des sessions
- Principe du moindre privilège
- Logs sécurisés sans exposition de données sensibles

## Support et dépannage

### Problèmes courants

1. **Erreur de connexion MariaDB** :
   ```bash
   sudo systemctl status mariadb
   sudo systemctl start mariadb
   ```

2. **Permission denied sur les fichiers** :
   ```bash
   sudo chown -R www-data:www-data /var/www/html/vulnapp/
   sudo chmod -R 755 /var/www/html/vulnapp/
   ```

3. **Port 5173 déjà utilisé** :
   ```bash
   # Changer le port dans vite.config.ts ou tuer le processus
   sudo lsof -ti:5173 | xargs kill -9
   ```

### Logs utiles

- **Apache** : `/var/log/apache2/vulnapp_error.log`
- **MariaDB** : `/var/log/mysql/error.log`
- **Application** : Console du navigateur (F12)

## Notes importantes

⚠️ Cette application est conçue pour un usage éducatif uniquement. Elle ne doit être utilisée que dans un environnement de test sécurisé et isolé.

⚠️ Ne jamais exposer cette application sur Internet ou dans un environnement de production.

⚠️ Les vulnérabilités présentes sont volontaires et servent à l'apprentissage de la cybersécurité.

## Licence

Ce projet est destiné à un usage éducatif uniquement dans le cadre de l'apprentissage de la cybersécurité.
