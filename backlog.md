# Hivemind : brief client et backlog

Le livret donne le projet en une page ; ici, tout le détail. Les heures du module sont sur les slides et dans le livret.

## 1. Le mot du client

Je m'appelle Casey, je suis lead dev dans une agence web lyonnaise. Tous les jours, je jongle avec trois IA : Claude Code pour le gros du code, Codex pour la relecture, Antigravity quand les deux autres ont épuisé mon quota. Résultat : trois terminaux ouverts, le même contexte réexpliqué trois fois, des copier-coller dans tous les sens et, à 18h, plus aucune idée de quelle IA a dit quoi.

Je veux **Hivemind** : une appli web qui tourne sur mon poste, depuis laquelle j'envoie mes prompts à n'importe laquelle de mes IA, avec une **mémoire commune** que les trois lisent (recopiée dans `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`). Pas d'API payante : j'ai déjà mes abonnements. Je ne suis pas patient, mais je suis honnête : je préfère trois fonctions qui marchent à dix fonctions qui plantent en démo. Lancement public visé pour la v1 : **15 décembre 2026**.

## 2. Objectifs

| Objectif | Comment on le mesure |
|---|---|
| Piloter Claude Code, Codex CLI et Antigravity CLI depuis une seule page web locale | Nombre de CLI pilotables en démo (cible : 3) |
| Ne plus perdre le contexte : une mémoire unique partagée par les trois IA | Une info écrite une seule fois est reprise par plusieurs IA en démo |
| Un MVP utilisable dès la fin du premier sprint | MVP présenté à la démo 1 (lundi 11h56) |
| Maximiser la valeur livrée en deux jours | Score = somme des valeurs des features qui marchent en direct sur le poste de démo (classement mardi 12h26, pour le fun, non noté) |

## 3. Parties prenantes

| Qui | Rôle | Ce qu'il attend |
|---|---|---|
| Casey, lead dev | Client, sponsor, valide les livraisons | Un outil qui lui fait gagner du temps dès demain. Des démos qui marchent, pas des promesses. |
| Les devs de l'agence | Utilisateurs finaux | Une installation simple, une interface claire, aucune formation. |
| Votre équipe | Pilote, conçoit, relit, teste, décide | Un périmètre réaliste et des règles claires. |
| Les agents IA | Écrivent le code | Des consignes précises et un contexte à jour. Elles exécutent, elles ne décident pas. |
| La sécurité de l'agence | Garde-fou | Aucune donnée de projet client ne sort du poste, hors IA déjà utilisées par l'agence. |

## 4. Ressources et contraintes

- **L'équipe** : 3 ou 4 personnes, 4 rôles qui tournent à chaque sprint (pilote IA, relecteur-testeur, gardien du tableau, responsable produit).
- **Les comptes IA** : ceux que vous avez (Claude, ChatGPT, compte Google pour Antigravity). Quotas limités : une IA à court de quota, c'est une ressource en moins. Chacun se connecte uniquement avec son propre compte.
- **Le poste de démo** : au moins 2 CLI réellement connectées (HM-02, HM-07, HM-13). Choisissez-le dès le cadrage.
- **Le temps** : 3 sprints de 40 + 75 + 55 min, soit 2h50. Pas une minute de plus.
- **L'outillage** : GitHub (repo + GitHub Projects), créés par vous (voir `README.md`).
- **Contraintes** : aucune API payante · 100 % local (localhost, pas d'hébergement) · Windows · **zéro code à la main** (une ligne tapée à la main = une feature qui ne compte pas) · toute feature passe par une issue GitHub.

## 5. Règles du jeu

| Règle | Ce que ça veut dire |
|---|---|
| Temps fixe, périmètre variable | Les heures ne bougent pas. Ce que vous livrez, si. |
| Le score, c'est la valeur | Somme des valeurs des features qui marchent en direct sur le poste de démo, devant le client, avec un prompt qu'il choisit (vérification mardi entre 11h31 et 11h50). Une feature à moitié faite vaut 0. Le score ne compte pas dans la note. |
| L'IA est R, jamais A | Dans votre RACI, une IA peut réaliser (R). L'approbateur (A) est toujours un humain, et un seul par tâche. |
| Le backlog est trop gros | 20 features, 111 points : personne ne finira tout, prioriser fait partie du travail. |
| Le client est vivant | Il peut changer d'avis ou vous retirer une ressource en cours de route (cartes événement lundi 14h40 et mardi 10h12). |
| Le dossier de pilotage | Le README du repo suit `dossier-de-pilotage_TEMPLATE.md`, rempli au fil des étapes. |

**Définition de « fini »** : 1. ça marche en démo, en direct, sur le poste de démo ; 2. un humain a relu le code produit par l'IA (son nom dans l'issue) ; 3. l'issue est fermée. Pas deux conditions : trois.

**Le MVP (démo 1)** : HM-01 + HM-02 + HM-03 + HM-04 : envoyer un prompt à une CLI choisie, afficher la réponse, garder l'historique, lancer l'appli en une commande. Faisable en 40 minutes si vous commencez simple (mode non interactif d'abord).

**À chaque démo, le client regarde** : ça marche en direct ou pas (pas de vidéo, pas de « en local ça marchait ») · le Board dit la vérité · vous savez dire ce que vous avez livré, abandonné, et pourquoi.

---

## 6. Le backlog : 20 features, 111 points de valeur

Must 14 pts · Should 46 pts · Could 51 pts. La **Valeur** (points de valeur) est donnée par le client : elle dit ce que la feature vaut pour lui. L'**Estimation** (points d'effort) est à vous : vous la donnez au planning poker.

**Mode d'emploi** : un bloc = une issue. Sur github.com, chaque bloc gris a un bouton *Copier* en haut à droite. Copiez le titre dans le titre de l'issue, le corps dans sa description, puis renseignez `MoSCoW` et `Valeur` sur la carte du Board. Commencez par les 4 Must (HM-01 à HM-04) ; ajoutez les autres au fil de l'eau, quand vous les attaquez.

| ID | Feature | MoSCoW | Valeur |
|---|---|---|---|
| HM-01 | Envoyer un prompt à une CLI et afficher la réponse | Must | 5 pts |
| HM-02 | Choisir la CLI cible | Must | 3 pts |
| HM-03 | Historique des échanges | Must | 3 pts |
| HM-04 | Démarrage en une commande | Must | 3 pts |
| HM-05 | Détection des CLI installées | Should | 5 pts |
| HM-06 | Mémoire centrale éditable | Should | 8 pts |
| HM-07 | Synchronisation de la mémoire vers les 3 CLI | Should | 8 pts |
| HM-08 | Choix du dossier de travail | Should | 5 pts |
| HM-09 | Réponse en direct (streaming) | Should | 5 pts |
| HM-10 | État de la requête et annulation | Should | 5 pts |
| HM-11 | Rendu Markdown et code | Should | 5 pts |
| HM-12 | Messages d'erreur compréhensibles | Should | 5 pts |
| HM-13 | Mode « comparer » | Could | 13 pts |
| HM-14 | Terminal interactif intégré | Could | 13 pts |
| HM-15 | Relais entre IA | Could | 8 pts |
| HM-16 | Compteur d'usage par CLI | Could | 5 pts |
| HM-17 | Bibliothèque de prompts | Could | 3 pts |
| HM-18 | Recherche dans l'historique | Could | 3 pts |
| HM-19 | Export Markdown | Could | 3 pts |
| HM-20 | Thème clair / sombre | Could | 3 pts |

---

### HM-01 · Envoyer un prompt à une CLI et afficher la réponse

MoSCoW : **Must** · Valeur : **5 pts**

Titre de l'issue :

```text
HM-01 · Envoyer un prompt à une CLI et afficher la réponse
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux taper un prompt dans l'appli et voir la réponse de l'IA, afin de ne plus jongler entre trois terminaux.

**Critères d'acceptation**
- [ ] Un champ texte + un bouton « Envoyer » sur la page d'accueil (localhost).
- [ ] Le prompt est envoyé à la CLI en mode non interactif ; la réponse complète s'affiche dans la page.
- [ ] Testé en démo avec un vrai prompt (pas de réponse simulée).

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Must · Valeur client : 5 pts_
```

---

### HM-02 · Choisir la CLI cible

MoSCoW : **Must** · Valeur : **3 pts**

Titre de l'issue :

```text
HM-02 · Choisir la CLI cible
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux choisir entre Claude Code, Codex CLI et Antigravity CLI avant d'envoyer, afin d'utiliser l'IA la plus adaptée à la tâche.

**Critères d'acceptation**
- [ ] Un sélecteur propose les 3 CLI.
- [ ] Le prompt part bien vers la CLI choisie (visible dans la réponse ou les logs).
- [ ] Au moins 2 CLI réellement connectées (chacune avec le compte de la personne qui l'a connectée) répondent en démo, sur le poste de démo.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Must · Valeur client : 3 pts_
```

---

### HM-03 · Historique des échanges

MoSCoW : **Must** · Valeur : **3 pts**

Titre de l'issue :

```text
HM-03 · Historique des échanges
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux retrouver mes derniers prompts et réponses, afin de ne pas perdre le fil quand je change d'IA.

**Critères d'acceptation**
- [ ] Chaque échange (date, CLI, prompt, réponse) est enregistré localement (fichier JSON ou SQLite).
- [ ] L'historique est toujours là après redémarrage de l'appli.
- [ ] Un clic sur un échange réaffiche la réponse.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Must · Valeur client : 3 pts_
```

---

### HM-04 · Démarrage en une commande

MoSCoW : **Must** · Valeur : **3 pts**

Titre de l'issue :

```text
HM-04 · Démarrage en une commande
```

Corps de l'issue :

```markdown
**User story**
En tant que nouvel utilisateur, je veux installer et lancer l'appli avec une seule commande documentée, afin de ne pas perdre une heure à la mettre en route.

**Critères d'acceptation**
- [ ] Le README du repo indique les prérequis et la commande de lancement (ex. npm start).
- [ ] Un membre qui n'a pas codé la feature lance l'appli sur son poste en suivant le README.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Must · Valeur client : 3 pts_
```

---

### HM-05 · Détection des CLI installées

MoSCoW : **Should** · Valeur : **5 pts**

Titre de l'issue :

```text
HM-05 · Détection des CLI installées
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux voir quelles CLI sont installées et connectées, afin de savoir tout de suite laquelle je peux utiliser.

**Critères d'acceptation**
- [ ] Au démarrage, l'appli vérifie la présence de chaque CLI (ex. commande --version).
- [ ] Chaque CLI affiche un état : disponible / absente.
- [ ] Une CLI absente est grisée dans le sélecteur.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Should · Valeur client : 5 pts_
```

---

### HM-06 · Mémoire centrale éditable

MoSCoW : **Should** · Valeur : **8 pts**

Titre de l'issue :

```text
HM-06 · Mémoire centrale éditable
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux écrire une seule fois le contexte de mon projet (stack, conventions, décisions), afin que toutes mes IA partent de la même base.

**Critères d'acceptation**
- [ ] Un éditeur de texte dans l'appli permet d'écrire et d'enregistrer la mémoire centrale (Markdown).
- [ ] La mémoire est sauvegardée localement et rechargée au redémarrage.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Should · Valeur client : 8 pts_
```

---

### HM-07 · Synchronisation de la mémoire vers les 3 CLI

MoSCoW : **Should** · Valeur : **8 pts**

Titre de l'issue :

```text
HM-07 · Synchronisation de la mémoire vers les 3 CLI
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux que la mémoire centrale soit recopiée dans CLAUDE.md, AGENTS.md et GEMINI.md, afin que chaque IA la lise au démarrage sans copier-coller.

**Critères d'acceptation**
- [ ] Un bouton « Synchroniser » écrit les 3 fichiers dans le dossier de travail.
- [ ] Le contenu ajouté à la main dans ces fichiers n'est pas écrasé sans avertissement.
- [ ] Preuve en démo : une info présente uniquement dans la mémoire est citée par au moins 2 CLI réellement connectées sur le poste de démo.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Should · Valeur client : 8 pts_
```

---

### HM-08 · Choix du dossier de travail

MoSCoW : **Should** · Valeur : **5 pts**

Titre de l'issue :

```text
HM-08 · Choix du dossier de travail
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux indiquer le dossier du projet sur lequel l'IA travaille, afin qu'elle lise le bon code et la bonne mémoire.

**Critères d'acceptation**
- [ ] Le chemin du dossier est saisi ou choisi dans l'interface et mémorisé.
- [ ] La CLI s'exécute bien dans ce dossier (vérifiable en demandant à l'IA de lister les fichiers).

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Should · Valeur client : 5 pts_
```

---

### HM-09 · Réponse en direct (streaming)

MoSCoW : **Should** · Valeur : **5 pts**

Titre de l'issue :

```text
HM-09 · Réponse en direct (streaming)
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux voir la réponse s'afficher au fil de l'eau, afin de ne pas fixer un écran vide pendant 40 secondes.

**Critères d'acceptation**
- [ ] Le texte apparaît progressivement pendant que la CLI répond.
- [ ] La réponse finale est identique à celle enregistrée dans l'historique.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Should · Valeur client : 5 pts_
```

---

### HM-10 · État de la requête et annulation

MoSCoW : **Should** · Valeur : **5 pts**

Titre de l'issue :

```text
HM-10 · État de la requête et annulation
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux savoir si l'IA travaille encore et pouvoir l'arrêter, afin de ne pas attendre une réponse partie en vrille.

**Critères d'acceptation**
- [ ] Un indicateur affiche : en cours / terminé / erreur, avec la durée.
- [ ] Un bouton « Annuler » arrête le processus de la CLI (plus de processus orphelin).

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Should · Valeur client : 5 pts_
```

---

### HM-11 · Rendu Markdown et code

MoSCoW : **Should** · Valeur : **5 pts**

Titre de l'issue :

```text
HM-11 · Rendu Markdown et code
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux que les réponses soient mises en forme (titres, listes, blocs de code colorés), afin de les lire et copier facilement.

**Critères d'acceptation**
- [ ] Le Markdown est rendu proprement dans la page.
- [ ] Chaque bloc de code a un bouton « Copier ».

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Should · Valeur client : 5 pts_
```

---

### HM-12 · Messages d'erreur compréhensibles

MoSCoW : **Should** · Valeur : **5 pts**

Titre de l'issue :

```text
HM-12 · Messages d'erreur compréhensibles
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux un message clair quand une CLI échoue (absente, non connectée, quota atteint), afin de savoir quoi faire au lieu de lire une pile d'erreurs.

**Critères d'acceptation**
- [ ] Au moins 3 cas d'erreur sont distingués avec un message en français et une action conseillée.
- [ ] L'appli ne plante pas : on peut renvoyer un prompt juste après.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Should · Valeur client : 5 pts_
```

---

### HM-13 · Mode « comparer »

MoSCoW : **Could** · Valeur : **13 pts**

Titre de l'issue :

```text
HM-13 · Mode « comparer »
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux envoyer le même prompt aux 3 IA et voir les réponses côte à côte, afin de choisir la meilleure.

**Critères d'acceptation**
- [ ] Un mode envoie le même prompt, choisi par le client sur le moment, à au moins 2 CLI réellement connectées, en parallèle.
- [ ] Les réponses s'affichent en colonnes, avec la durée de chacune.
- [ ] Toutes les réponses sont enregistrées dans l'historique.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Could · Valeur client : 13 pts_
```

---

### HM-14 · Terminal interactif intégré

MoSCoW : **Could** · Valeur : **13 pts**

Titre de l'issue :

```text
HM-14 · Terminal interactif intégré
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux ouvrir une vraie session interactive d'une CLI dans le navigateur, afin de travailler comme dans mon terminal mais au même endroit.

**Critères d'acceptation**
- [ ] Un terminal dans la page affiche la session de la CLI (couleurs, saisie clavier, raccourcis).
- [ ] On peut dialoguer plusieurs tours avec la CLI sans quitter la page.
- [ ] Fonctionne sous Windows sur le poste de démo.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Could · Valeur client : 13 pts_
```

---

### HM-15 · Relais entre IA

MoSCoW : **Could** · Valeur : **8 pts**

Titre de l'issue :

```text
HM-15 · Relais entre IA
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux envoyer la réponse d'une IA comme prompt à une autre (ex. Claude rédige, Antigravity relit), afin d'automatiser la relecture croisée.

**Critères d'acceptation**
- [ ] Un bouton « Envoyer à… » sur une réponse pré-remplit un nouveau prompt pour une autre CLI.
- [ ] L'enchaînement est visible dans l'historique.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Could · Valeur client : 8 pts_
```

---

### HM-16 · Compteur d'usage par CLI

MoSCoW : **Could** · Valeur : **5 pts**

Titre de l'issue :

```text
HM-16 · Compteur d'usage par CLI
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux voir combien de requêtes j'ai envoyées à chaque IA aujourd'hui, afin de surveiller mes quotas d'abonnement.

**Critères d'acceptation**
- [ ] Un compteur par CLI, remis à zéro chaque jour.
- [ ] Le compteur se met à jour sans recharger la page.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Could · Valeur client : 5 pts_
```

---

### HM-17 · Bibliothèque de prompts

MoSCoW : **Could** · Valeur : **3 pts**

Titre de l'issue :

```text
HM-17 · Bibliothèque de prompts
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux enregistrer mes prompts favoris et les réutiliser en un clic, afin de ne plus les retaper.

**Critères d'acceptation**
- [ ] On peut ajouter, renommer et supprimer un prompt favori.
- [ ] Un clic insère le prompt dans le champ de saisie.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Could · Valeur client : 3 pts_
```

---

### HM-18 · Recherche dans l'historique

MoSCoW : **Could** · Valeur : **3 pts**

Titre de l'issue :

```text
HM-18 · Recherche dans l'historique
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux chercher un mot dans mes anciens échanges, afin de retrouver une réponse vue la semaine dernière.

**Critères d'acceptation**
- [ ] Un champ de recherche filtre l'historique (prompt et réponse).
- [ ] Résultat en moins d'une seconde sur 200 échanges.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Could · Valeur client : 3 pts_
```

---

### HM-19 · Export Markdown

MoSCoW : **Could** · Valeur : **3 pts**

Titre de l'issue :

```text
HM-19 · Export Markdown
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux exporter une conversation en fichier .md, afin de la coller dans un ticket ou une doc.

**Critères d'acceptation**
- [ ] Un bouton télécharge le fichier .md (prompt, CLI, date, réponse).
- [ ] Le fichier s'ouvre proprement dans un éditeur Markdown.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Could · Valeur client : 3 pts_
```

---

### HM-20 · Thème clair / sombre

MoSCoW : **Could** · Valeur : **3 pts**

Titre de l'issue :

```text
HM-20 · Thème clair / sombre
```

Corps de l'issue :

```markdown
**User story**
En tant que lead dev, je veux basculer entre thème clair et sombre, afin de ménager mes yeux à 23 h.

**Critères d'acceptation**
- [ ] Un bouton bascule le thème.
- [ ] Le choix est mémorisé au rechargement.

**Définition de « fini »**
- [ ] Marche en démo
- [ ] Code relu par un humain (nom : …)
- [ ] Issue fermée

_MoSCoW : Could · Valeur client : 3 pts_
```
