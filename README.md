# Hivemind — dossier de pilotage

> Équipe : **[Dream Team]** · Repo : `[assogo/hivemind]` · Project : [http://127.0.0.1:3000]
> Ce fichier est le `README.md` de votre repo. Il se remplit au fil du projet, section par section, au moment où le planning le demande. Pas la veille au soir.
> Mardi 11h50, il est le support de votre **démo de pilotage notée** (6 min de pilotage, 1 min d'appli, 5 min de questions individuelles).

| Membre | Rôle au sprint 1 | Rôle au sprint 2 | Rôle au sprint 3 | IA connectée(s) avec SON compte | Sur le poste de démo ? |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |

*Les 4 rôles tournent à chaque sprint : **pilote IA** (rédige les prompts), **relecteur-testeur** (relit le code de l'IA, teste), **gardien du tableau** (tient les cartes et le champ Sprint à jour), **responsable produit** (priorise, parle au client, remplit ce dossier). À 3, on cumule les 2 derniers. Le poste de démo doit avoir au moins 2 CLI réellement connectées ; chacun ne se connecte qu'avec son propre compte.*

**Règle d'or de ce dossier** : chaque affirmation s'appuie sur une donnée du brief client (un chiffre, une contrainte, une partie prenante). Une phrase qui marcherait pour n'importe quel projet ne sert à rien.

---

## 0. Installer et lancer Hivemind

*Exigé par HM-04 : un membre qui n'a pas codé la feature doit pouvoir lancer l'appli en suivant cette section, et rien d'autre.*

| Rubrique | À remplir |
|---|---|
| Prérequis (Node.js / Python, version) | |
| CLI pilotées (au moins 2 connectées sur le poste de démo) | |
| Installation (commande) | `…` |
| Lancement (une seule commande) | `…` (ex. `npm start`) |
| Adresse dans le navigateur | `http://127.0.0.1:…` |
| À savoir | Lancez Hivemind dans **votre propre terminal**, pas via un agent Claude Code (sinon `claude -p` refuse de démarrer : sessions imbriquées). |

---

## 1. Analyse du projet et enjeux

*Ce qu'on attend : en quelques lignes, ce que veut le client, pour qui, avec quoi et sous quelles contraintes. Puis les 3 enjeux qui feront réussir ou échouer le projet.*

Casey, lead dev dans une agence web lyonnaise, veut **Hivemind** : une application web locale (localhost Windows) permettant de piloter depuis une interface unique ses trois CLI d'IA (Claude Code, Codex CLI, Antigravity CLI) avec une mémoire commune synchronisée (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) sans API payante. Destinée aux développeurs de l'agence (prise en main immédiate sans formation), l'application est développée par une équipe de 3 à 4 personnes en zéro code manuel en vue d'un lancement public fixé au **15 décembre 2026**.

| Rubrique | Ce que dit le brief (données précises) | Ce que ça implique pour nous |
|---|---|---|
| Objectifs du client | Casey veut piloter 3 CLI (Claude Code, Codex CLI, Antigravity CLI) depuis une interface web locale sur son poste, partager une mémoire unique (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) sans copier-coller ni API payante, avec un MVP à la démo 1 (lundi 11h56) et une v1 au 15 décembre 2026. | Développer une interface web locale sous Windows orchestrant les sous-processus CLI sans API externe ; synchroniser fidèlement la mémoire centrale vers les 3 fichiers Markdown ; livrer le MVP (HM-01 à HM-04) dès le Sprint 1 (40 min) et prioriser la valeur sur les 20 features (111 pts). |
| Parties prenantes | Casey (lead dev client/sponsor qui valide en direct sur démos réelles avec ses prompts) ; développeurs de l'agence (utilisateurs finaux, 0 formation, démarrage en 1 commande) ; équipe projet (3 ou 4 personnes : [À COMPLÉTER]) ; agents IA (Claude, Codex, Antigravity qui codent sans décider) ; sécurité de l'agence (aucune donnée locale ne sort du poste). | Valider chaque issue en conditions réelles sur le poste de démo devant Casey ; soigner le démarrage en une commande (HM-04) ; garder l'humain comme seul approbateur (A) face aux IA exécutantes (R) ; garantir un fonctionnement 100 % local et étanche sans fuite de données hors des abonnements existants. |
| Ressources (humaines, IA, temps) | Équipe de 3 ou 4 personnes ([À COMPLÉTER]) tournant sur 4 rôles par sprint (pilote IA, relecteur-testeur, gardien du tableau, responsable produit) ; quotas IA personnels limités (Claude, ChatGPT, compte Google) ; 1 poste de démo avec ≥ 2 CLI connectées ([À COMPLÉTER]) ; 2 jours avec 3 sprints minutés (40 min, 75 min, 55 min = 2h50 au total). | Répartir strictement les rôles sans coder manuellement (100 % IA) ; surveiller les quotas IA pour ne pas perdre une ressource critique en plein sprint ; préparer le poste de démo désigné ([À COMPLÉTER]) dès le cadrage ; gérer le temps fixe strict (2h50) en ajustant le périmètre fonctionnel. |
| Contraintes (techniques, délais, règles) | 100 % local sous Windows (localhost, abonnements existants de Casey, pas d'API payante) ; zéro ligne de code écrite à la main (une ligne manuelle = feature annulée) ; toute feature tracée par une issue GitHub fermée après relecture humaine ; gestion des revirements client (cartes événement) ; v1 au 15 décembre 2026. | Piloter les agents IA par des prompts précis et relire tout le code produit avant validation ; gérer proprement les flux stdin/stdout des CLI sous Windows sans blocage ; prévoir l'absorption des cartes événement (lundi 14h40/15h00 et mardi 10h12) sans déborder du planning. |

| # | Enjeu principal | Pourquoi c'est critique (donnée du brief) |
|---|---|---|
| 1 | Pilotage local fiable des 3 CLI sous Windows sans blocage ni code manuel | Casey exige d'exécuter Claude Code, Codex et Antigravity depuis la page web sans API payante. L'interfaçage de processus CLI en direct sous Windows (gestion des flux stdin/stdout, mode non interactif, risque de blocage ou sessions imbriquées type `claude -p`) doit fonctionner en démo live alors que l'équipe a interdiction absolue de retoucher le code à la main. |
| 2 | Intégrité et synchronisation de la mémoire partagée (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) | C'est le cœur du besoin de Casey pour ne plus réexpliquer trois fois son contexte. La synchronisation (HM-07, 8 pts de valeur) est vérifiée en direct par le client : une information écrite dans Hivemind doit être citée par au moins 2 CLI connectées sur le poste de démo ([À COMPLÉTER]), sans écraser le contenu manuel existant. |
| 3 | Maîtrise du temps fixe (2h50 en 3 sprints) et des quotas IA face aux revirements client | Le backlog comporte 20 features pour 111 pts, le temps est figé à 2h50 avec 2 cartes événement imprévues (lundi 14h40 et mardi 10h12) et des quotas d'IA personnels limités. Tout dépassement ou panne de quota compromet la démo live devant Casey, où une feature incomplète vaut 0 point. |

---

## 2. Phases, objectifs et livrables

*Ce qu'on attend : les 4 phases du projet (conception, développement, tests, déploiement), chacune avec un objectif et des livrables concrets. Un livrable, ça se montre : un fichier, une démo, une issue fermée.*

| Phase | Objectif | Livrables | Critère de sortie (on passe à la suite quand…) |
|---|---|---|---|
| Conception | Cadrer l'architecture locale d'Hivemind sous Windows (orchestration de Claude Code, Codex CLI et Antigravity CLI sans API payante), définir le schéma de la mémoire partagée (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) et initialiser le GitHub Project avec les 20 issues valorisées (111 pts). | GitHub Project configuré avec backlog priorisé (MoSCoW), dossier de pilotage initialisé (§1, §2, §6 et A complétés) et spécification d'architecture locale (serveur local et exécution des CLI). | Backlog validé sur GitHub avec les 4 issues du MVP (HM-01 à HM-04) prêtes pour le Sprint 1, et poste de démo ([À COMPLÉTER]) configuré avec au moins 2 CLI connectées. |
| Développement | Générer par prompts IA exclusifs (zéro code manuel) les fonctionnalités d'Hivemind : exécution des CLI en sous-processus, persistance locale de l'historique (JSON/SQLite), interface web localhost et module de synchronisation de la mémoire partagée. | Code source complet d'Hivemind versionné sur GitHub (backend d'orchestration CLI, interface web localhost, synchroniseur de mémoire) et issues associées fermées. | Code de chaque feature généré par IA relu par un humain (nom tracé dans l'issue) et application démarrable en une commande (HM-04). |
| Tests | Valider sur le poste de démo Windows l'intégration live des CLI connectées (réponse réelle aux prompts libres, persistance de l'historique et prise en compte du contexte partagé) sans plantage ni processus orphelin. | Cahier de recette consignant les critères d'acceptation validés pour chaque issue, et journal de bord des démos avec preuves de fonctionnement des CLI connectées. | 100 % des critères d'acceptation du sprint vérifiés en direct sur le poste de démo ([À COMPLÉTER]) avec au moins 2 CLI connectées sans erreur bloquante. |
| Déploiement | Mettre à disposition l'application Hivemind opérationnelle en local (démo notée devant Casey mardi 11h50 puis version livrable pour le lancement public du 15 décembre 2026) avec documentation de lancement autonome en une commande (HM-04). | Release GitHub d'Hivemind étiquetée, section §0 du README documentée (commande unique de lancement, URL `http://127.0.0.1:...`, prérequis) et démo live validée devant Casey. | Démonstration en direct validée par Casey avec un prompt de son choix sans plantage, et confirmation du score de valeur livrée sur GitHub Projects. |

---

## 3. Estimations et marges

*Ce qu'on attend : la charge de chaque feature retenue et la capacité de l'équipe, justifiées par nos données réelles : nombre de personnes, minutes de sprint, quotas IA. Capacité réelle = temps disponible × 0,8 (temps utile), puis une marge de sécurité de 15 à 25 % liée à un risque nommé, pas cachée dans les chiffres.*

*Deux unités à ne pas mélanger : **Estimation = points d'effort** (ce que la feature nous coûte, notre planning poker) ; **Valeur = points de valeur** (ce qu'elle vaut pour le client, donnée par le backlog).*

**Capacité de l'équipe**

| Sprint | Durée | Personnes | Temps humain dispo (min) | Temps utile (× 0,8) | Quotas IA (estimation) | Capacité retenue (pts d'effort) |
|---|---|---|---|---|---|---|
| Sprint 1 | 40 min | | | | | |
| Sprint 2 | 75 min | | | | | |
| Sprint 3 | 55 min | | | | | |

**Estimations**

| Élément (phase ou feature) | Estimation (pts d'effort) | Hypothèse | Marge de sécurité | Risque qui justifie la marge |
|---|---|---|---|---|
| | | | | |
| | | | | |

**Négociation (lundi 14h15) : une ligne par personnage au minimum**

| Rôle | Objection | Décision (hypothèse ou arbitrage) | Impact sur l'estimation |
|---|---|---|---|
| UX/UI | | | |
| Infra / Sécurité | | | |
| Dev senior | | | |

**Estimé contre réel, par feature (mis à jour à chaque démo)**

| Feature | Valeur (pts de valeur) | Estimation (pts d'effort) | Réel (pts d'effort ou minutes) | Livrée et marche en démo ? | Écart expliqué |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |

**Cartes événement**

| Carte | Arbitrage (ce qui entre, ce qui sort) | Qui a validé (A) | Impact (capacité, planning, valeur) |
|---|---|---|---|
| n°1 (lundi 15h00) | | | |
| n°2 (mardi 10h12) | | | |

---

## 4. Ressources et RACI

*Ce qu'on attend : qui fait quoi, phase par phase. R = réalise, A = approuve (un seul A par ligne, toujours un humain), C = consulté, I = informé. Une IA peut être R, jamais A. Tout le monde n'est pas sur toutes les lignes.*

**Ressources par phase**

| Phase | Ressources humaines | Ressources techniques (IA, outils, postes) |
|---|---|---|
| Conception | | |
| Développement | | |
| Tests | | |
| Déploiement | | |

**RACI**

| Tâche | [Membre 1] | [Membre 2] | [Membre 3] | [Membre 4] | [IA 1] | [IA 2] | Client |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

---

## 5. Rétroplanning

*Ce qu'on attend : le planning de la v1 construit à rebours depuis la date de lancement public fixée par le client, avec phases, jalons, livrables, marges et risques. Lien vers la vue Roadmap du project.*

Vue Roadmap : [lien]

| Phase / tâche | Début | Fin | Durée | Dépend de | Marge | Livrable | Responsable (A) |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
| | | | | | | | |

**Risques et parades**

| Risque | Probabilité | Impact | Parade (anti-retard) | Où dans le planning |
|---|---|---|---|---|
| | | | | |
| | | | | |

---

## 6. Jalons

*Ce qu'on attend : au moins 3 jalons structurants. Un jalon, c'est une date et une décision : on passe, ou on ne passe pas. Placez un livrable intermédiaire avant chaque phase critique.*

| ◆ Jalon | Date | Critère de passage | Livrable vérifié | Qui valide (A) |
|---|---|---|---|---|
| J1 - Validation du cadrage et de l'architecture Hivemind (Phase Conception) | Lundi matin [À COMPLÉTER] | Décision Go Développement ? : Validé si le GitHub Project est configuré avec les 20 issues valorisées (111 pts), l'architecture locale sans API payante est définie, et au moins 2 CLI sont connectées sur le poste de démo ([À COMPLÉTER]). Sinon No-Go. | Backlog GitHub Project initialisé (MoSCoW), dossier de pilotage rempli (§1, §2, §6, A) et poste de démo prêt. | Responsable produit ([À COMPLÉTER]) |
| J2 - Fin de développement du MVP Hivemind (Phase Développement) | Lundi 11h45 [À COMPLÉTER] | Décision Go Tests ? : Validé si les 4 features Must (HM-01, HM-02, HM-03, HM-04) sont 100 % générées par IA (zéro code manuel) avec relecture humaine tracée dans chaque issue. Sinon No-Go. | Code source Hivemind sur le repo GitHub avec serveur local, connecteurs CLI, historique et commande de lancement (HM-04). | Relecteur-testeur ([À COMPLÉTER]) |
| J3 - Recette technique et validation de la démo live (Phase Tests) | Lundi 11h56 (Démo 1) & Mardi 11h31 (Démo finale) [À COMPLÉTER] | Décision Go Déploiement / Démo ? : Validé si au moins 2 CLI connectées répondent avec succès à un prompt réel sur le poste de démo ([À COMPLÉTER]), avec persistance de l'historique (HM-03) et synchronisation mémoire (HM-07). Sinon No-Go. | Démonstration live fonctionnelle sur localhost devant Casey et cahier de recette des critères d'acceptation validé. | Relecteur-testeur ([À COMPLÉTER]) |
| J4 - Clôture des sprints et Release v1 Hivemind (Phase Déploiement) | Mardi 11h50 (Démo notée) & 15 décembre 2026 (Lancement v1) | Décision Go Lancement public ? : Validé si la démo live réussit devant Casey avec un prompt libre sur le poste de démo ([À COMPLÉTER]), README §0 documenté pour installation autonome et valeur client actée. Sinon No-Go. | Application Hivemind opérationnelle en 1 commande, README §0 complet et release v1 étiquetée sur GitHub. | Casey (lead dev / client) |

---

## 7. KPI

*Ce qu'on attend : 5 indicateurs maximum, répartis en trois familles : avancement (délai et coût), qualité ou adoption, business (valeur pour le client). Au moins un KPI de coût (quota d'IA consommé, jours-personne). Chacun avec une formule, une cible et une source de données.*

| KPI | Famille | Formule | Cible | Source (GitHub, démo…) | Fréquence |
|---|---|---|---|---|---|
| | Avancement (délai) | | | | |
| | Avancement (coût) | | | | |
| | Qualité / adoption | | | | |
| | Business (valeur client) | | | | |
| | | | | | |

---

## 8. Tableau de bord

*Ce qu'on attend : une vue lisible en 30 secondes qui dit où on en est par rapport aux objectifs (délais, ressources, coûts) et quelle décision prendre. Données tirées de GitHub Projects : capture ou lien vers le graphique Insights « Somme de Valeur par Sprint et Status ».*

Insights : [lien ou capture]

| Indicateur | Valeur actuelle | Cible | Écart | Tendance | Météo | Mode de suivi | Fréquence | Responsable |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |

*Météo : vert = écart ≤ 5 % · orange = écart de 5 à 15 % · rouge = écart > 15 %.*

**Décision à prendre maintenant** : [une phrase]

---

## A. Décision de méthode

*Ce qu'on attend : la méthode retenue (Scrum, Kanban, autre ou un mélange) et pourquoi, au regard de notre contexte : taille de l'équipe, durée, incertitude technique, client présent.*

| Critère du contexte | Notre situation (donnée) | Ce que ça favorise |
|---|---|---|
| Taille et composition de l'équipe | 3 ou 4 personnes ([À COMPLÉTER]) avec 4 rôles tournants par sprint (pilote IA, relecteur-testeur, gardien du tableau, responsable produit) pilotant des agents IA sans taper de code à la main. | Une organisation agile légère sans surcharge managériale, où chaque rôle est dédié à fluidifier le cycle : rédaction de prompt IA -> relecture humaine du code -> traçabilité GitHub. |
| Durée et rythme | 2 jours d'atelier découpés en 3 sprints très courts (Sprint 1 : 40 min, Sprint 2 : 75 min, Sprint 3 : 55 min = 2h50 au total) avec démos intermédiaires (lundi 11h56, mardi 11h50) et lancement v1 fixé au 15 décembre 2026. | Un rythme itératif cadencé en timeboxing strict (Scrum allégé) combiné à un jalonnement global par étapes (cadre hybride) pour sécuriser la trajectoire de livraison de la v1. |
| Incertitude technique | Orchestration locale sous Windows de 3 CLI d'IA aux fonctionnements hétérogènes sans API payante, quotas IA personnels limités, interdiction absolue de coder à la main. | Des cycles courts d'expérimentation permettant de tester immédiatement les fonctions critiques (MVP HM-01 à HM-04) en démo live avant d'aborder les features plus complexes (HM-07, HM-13). |
| Disponibilité du client | Casey est présent en direct lors des démos pour tester l'appli avec ses propres prompts et déclenche des événements impromptus (cartes événement lundi 14h40 et mardi 10h12). | Des rituels de feedback direct (démo, négociation) et un backlog ajustable en continu pour réarbitrer le périmètre à chaque fin de sprint selon les réactions réelles du client. |

**Méthode retenue** : Scrum allégé dans un cadre hybride.

**Parce que** :
1. **Équipe restreinte et temps ultra-court (3 à 4 personnes sur 2 jours)** : avec 2h50 de temps de développement effectif découpées en 3 sprints minutés (40, 75 et 55 min), le découpage Scrum impose un timeboxing rigoureux qui pousse l'équipe à délivrer des incréments immédiatement testables plutôt que de concevoir des plans théoriques.
2. **Client réactif et vivant qui change d'avis en cours de route** : Casey évalue le projet sur des démos réelles avec ses prompts et impose des perturbations majeures via les cartes événement (lundi 14h40 et mardi 10h12) ; l'approche agile permet d'ajuster le périmètre à chaque sprint en re-priorisant les 20 features (111 pts) sans compromettre le reste du projet.
3. **Date de lancement public fixe au 15 décembre 2026** : le cadre hybride (jalonnement prédictif avec dates cibles et jalons Go/No-Go) est indispensable pour structurer la trajectoire et garantir le respect de l'échéance finale ferme du 15 décembre 2026, tout en conservant l'agilité itérative au quotidien.

**Pourquoi pas le Cycle en V, SAFe et Kanban ?** : Le Cycle en V est inadapté car trop rigide face aux cartes événement de Casey et aux ajustements de périmètre en 2 jours ; SAFe est disproportionné car conçu pour coordonner des centaines de personnes là où nous sommes 3 ou 4 ; et Kanban pur est écarté car son flux continu sans timebox strict ne garantit pas la livraison d'un incrément fonctionnel aux heures fixes des démos (lundi 11h56 et mardi 11h50).

**Ce qu'on abandonne de la méthode et pourquoi** : Les cérémonies Scrum lourdes (Sprint Planning exhaustif, Daily formel de 15 min, poker planning complexe) sont abandonnées au profit de synchronisations flash et de rétrospectives de 5 minutes, afin de maximiser le temps utile dédié à prompter et relire le code généré par les IA.

---

## B. Journal des rétros

*Ce qu'on attend : après chaque démo, 5 minutes honnêtes. Estimé contre réel (en points d'effort : c'est la vélocité), la valeur livrée (en points de valeur : c'est le score), puis Garder / Arrêter / Essayer.*

| Sprint | Estimé (pts d'effort) | Livré et qui marche (pts d'effort) | Écart | Valeur livrée (pts de valeur) | Garder | Arrêter | Essayer |
|---|---|---|---|---|---|---|---|
| Sprint 1 | | | | | | | |
| Sprint 2 | | | | | | | |
| Sprint 3 | | | | | | | |
