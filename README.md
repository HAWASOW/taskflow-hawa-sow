# EXAMEN-NODEJS-OCTOBRE-2026

# Conception d’une API REST professionnelle avec Node.js, Express, Swagger et un Backoffice
# Durée : 3 heures


**1. Contexte professionnel**
Une entreprise souhaite développer TaskFlow, une API REST permettant aux entreprises de gérer leurs projets, leurs équipes et leurs tâches. Plusieurs utilisateurs doivent pouvoir collaborer sur des projets, suivre l’avancement des tâches et consulter des statistiques.

Vous êtes recruté en tant que développeur Backend Node.js. Votre mission est de concevoir une API sécurisée, maintenable, testable et documentée, comme dans un environnement professionnel.

L’objectif principal : démontrer votre maîtrise de Node.js, Express, des principes REST, de la sécurité des API  et de la documentation interactive avec Swagger. Aussi mettre en place un backoffice pour la gestion de l'admin.

**2. Objectifs de l’évaluation**
À la fin de cette épreuve, le candidat doit être capable de :
- Concevoir une API REST cohérente avec des routes et des codes HTTP appropriés.
- Organiser un projet Node.js avec une architecture claire et maintenable.
- Gérer l’authentification, les autorisations et la validation des données.
- Implémenter des relations entre utilisateurs, projets et tâches.
- Gérer les erreurs et les cas limites.
- Documenter les endpoints avec Swagger / OpenAPI.
- Tester les endpoints et expliquer comment lancer et utiliser l’API.
- Mettre en place un backoffice pour l'admin

**3. Fonctionnalités obligatoires**
**Module A — Authentification et gestion des utilisateurs**
Mettre en place les fonctionnalités suivantes :
- Inscription d’un utilisateur.
- Connexion avec email et mot de passe.
- Consultation du profil de l’utilisateur connecté.
- Modification de son profil.
- Protection des routes privées par JWT.
- Gestion des rôles : ADMIN et USER.
Contraintes de sécurité :
- Hacher les mots de passe avec bcrypt ou Argon2.
- Ne jamais retourner les mots de passe ou leurs hashes dans les réponses.
- Vérifier la validité du token et les permissions de l’utilisateur.
- Valider les données reçues avant de les traiter.

**Module B — Gestion des projets**
Un utilisateur authentifié doit pouvoir :
- Créer un projet.
- Consulter la liste de ses projets.
- Consulter les détails d’un projet.
- Modifier un projet dont il est responsable.
- Supprimer un projet selon les règles définies.
- Ajouter des membres à un projet.
- Consulter les membres d’un projet.
**Un utilisateur ne doit pas pouvoir accéder ou modifier les projets d’une autre équipe sans autorisation.**
  
**Module C — Gestion des tâches**
Chaque projet peut contenir plusieurs tâches.
Une tâche doit comporter au minimum :
- Un titre et une description.
- Un statut : TODO, IN_PROGRESS ou DONE.
- Une priorité : LOW, MEDIUM ou HIGH.
- Une date limite facultative.
- Un utilisateur assigné.
- Une référence au projet concerné.
- Les dates de création et de dernière modification.
Fonctionnalités attendues :
- Créer, consulter, modifier et supprimer une tâche.
- Assigner une tâche à un membre autorisé du projet.
- Filtrer les tâches par statut, priorité ou utilisateur assigné.
- Rechercher des tâches par titre.
- Paginer les résultats.
- Trier les tâches par date de création ou date limite.
  
**Module D — Tableau de bord et statistiques**
Créer des endpoints permettant d’obtenir :
- Le nombre total de projets accessibles à l’utilisateur.
- Le nombre total de tâches.
- Le nombre de tâches terminées et en cours.
- Le nombre de tâches en retard.
- La répartition des tâches par statut.
**Les statistiques doivent être calculées à partir des données réelles de la base de données.**
  
**4. Conception des endpoints REST**
Le candidat doit définir et implémenter des endpoints cohérents. 
Le tableau ci-dessous constitue une base de travail : il peut être complété si nécessaire.
Méthode	Endpoint	Fonction
POST	/api/auth/register	Inscrire un utilisateur
POST	/api/auth/login	Authentifier un utilisateur
GET	/api/users/me	Consulter son profil
PATCH	/api/users/me	Modifier son profil
POST	/api/projects	Créer un projet
GET	/api/projects	Lister les projets accessibles
GET	/api/projects/:id	Consulter un projet
PATCH	/api/projects/:id	Modifier un projet
DELETE	/api/projects/:id	Supprimer un projet
POST	/api/projects/:id/members	Ajouter un membre
GET	/api/projects/:id/members	Lister les membres
POST	/api/projects/:id/tasks	Créer une tâche
GET	/api/projects/:id/tasks	Lister les tâches du projet
GET	/api/tasks/:id	Consulter une tâche
PATCH	/api/tasks/:id	Modifier une tâche
DELETE	/api/tasks/:id	Supprimer une tâche
GET	/api/dashboard/stats	Consulter les statistiques
Les routes sont proposées à titre indicatif. Le candidat doit conserver une cohérence entre ses routes, ses règles métier et sa documentation Swagger.
Complétez les routes restantes y'a pas que ces routes qui existent.

**5. Documentation Swagger / OpenAPI — obligatoire**
La documentation est un élément central de cette épreuve. Une API fonctionnelle mais non documentée ne peut pas obtenir tous les points.

Le candidat doit utiliser Swagger UI et OpenAPI pour produire une documentation consultable et interactive.
Exigences attendues
1. Mettre en place Swagger UI, par exemple à l’adresse /api-docs.
2. Décrire les endpoints, leurs méthodes HTTP et leur objectif.
3. Documenter les paramètres de route, de requête et les corps des requêtes.
4. Définir les schémas de données : User, Project, Task, etc.
5. Documenter les réponses HTTP et leurs codes : 200, 201, 400, 401, 403, 404, 409 et 500, selon les situations.
6. Déclarer le mécanisme d’authentification Bearer JWT dans OpenAPI.
7. Permettre de tester les endpoints protégés depuis Swagger UI après saisie du token.
8. Fournir des exemples de requêtes et de réponses JSON.
9. Documenter les filtres, la pagination et le tri.
10. Décrire les erreurs possibles et leur format.

**6. Mettre en place un backoffice pour l'admin**
Vous devez faire une interface pour l'administrateur pour qu'il teste toutes les fonctionnalités de chaque module.

# Livraison obligatoire déployé le backend sur Render et déployé le backoffice sur vercel.

**NB :** La livraison sera noté sur 7 points et le reste 13 points
