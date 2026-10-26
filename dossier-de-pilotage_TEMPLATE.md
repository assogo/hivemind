# Hivemind — README.md

> Équipe : **[nom de l'équipe]** · Repo : `[pseudo/repo]` · Project : [lien GitHub Project]
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

| Rubrique | Ce que dit le brief (données précises) | Ce que ça implique pour nous |
|---|---|---|
| Objectifs du client | | |
| Parties prenantes | | |
| Ressources (humaines, IA, temps) | | |
| Contraintes (techniques, délais, règles) | | |

| # | Enjeu principal | Pourquoi c'est critique (donnée du brief) |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

---

## 2. Phases, objectifs et livrables

*Ce qu'on attend : les 4 phases du projet (conception, développement, tests, déploiement), chacune avec un objectif et des livrables concrets. Un livrable, ça se montre : un fichier, une démo, une issue fermée.*

| Phase | Objectif | Livrables | Critère de sortie (on passe à la suite quand…) |
|---|---|---|---|
| Conception | | | |
| Développement | | | |
| Tests | | | |
| Déploiement | | | |

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
| | | | | |
| | | | | |
| | | | | |

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
| Taille et composition de l'équipe | | |
| Durée et rythme | | |
| Incertitude technique | | |
| Disponibilité du client | | |

**Méthode retenue** : … **Parce que** : … **Ce qu'on abandonne de la méthode et pourquoi** : …

---

## B. Journal des rétros

*Ce qu'on attend : après chaque démo, 5 minutes honnêtes. Estimé contre réel (en points d'effort : c'est la vélocité), la valeur livrée (en points de valeur : c'est le score), puis Garder / Arrêter / Essayer.*

| Sprint | Estimé (pts d'effort) | Livré et qui marche (pts d'effort) | Écart | Valeur livrée (pts de valeur) | Garder | Arrêter | Essayer |
|---|---|---|---|---|---|---|---|
| Sprint 1 | | | | | | | |
| Sprint 2 | | | | | | | |
| Sprint 3 | | | | | | | |
