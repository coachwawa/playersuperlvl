# 🏀 PlayerSuperLvl by Coach Wawa
## Guide de déploiement — 5 étapes simples

---

## Ce que vous allez obtenir
- ✅ Une URL publique type `playersuperlvl.vercel.app`
- ✅ Fonctionne sur téléphone ET ordinateur
- ✅ Installable comme une vraie appli (PWA)
- ✅ Gratuit à 100%

---

## ÉTAPE 1 — Créer un compte GitHub (5 min)

1. Allez sur **github.com**
2. Cliquez **Sign up** (gratuit)
3. Choisissez un nom d'utilisateur (ex: `coachwawa`)
4. Validez votre email

---

## ÉTAPE 2 — Mettre le projet sur GitHub (5 min)

1. Sur GitHub, cliquez **"New repository"** (bouton vert)
2. Nom du repo : `playersuperlvl`
3. Laissez tout par défaut, cliquez **"Create repository"**
4. Sur la page qui s'affiche, cliquez **"uploading an existing file"**
5. **Glissez-déposez tout le dossier** `playersuperlvl` (tous les fichiers)
6. Cliquez **"Commit changes"**

---

## ÉTAPE 3 — Déployer sur Vercel (5 min)

1. Allez sur **vercel.com**
2. Cliquez **"Sign up"** puis **"Continue with GitHub"**
3. Autorisez Vercel à accéder à vos repos
4. Cliquez **"Add New Project"**
5. Sélectionnez le repo `playersuperlvl`
6. Laissez tout par défaut (Vercel détecte automatiquement React)
7. Cliquez **"Deploy"**
8. ⏳ Attendez 2-3 minutes…
9. 🎉 Votre app est en ligne ! Vercel vous donne une URL

---

## ÉTAPE 4 — Personnaliser votre URL (optionnel, 2 min)

Sur Vercel > votre projet > **Settings > Domains** :
- Vous pouvez changer l'URL en `playersuperlvl.vercel.app`
- Ou acheter `playersuperlvl.fr` sur **ovh.com** (~10€/an) et le connecter

---

## ÉTAPE 5 — Installer l'app sur votre téléphone (PWA)

### Sur iPhone (Safari) :
1. Ouvrez votre URL dans **Safari**
2. Appuyez sur l'icône **Partager** (carré avec flèche)
3. Faites défiler et appuyez **"Sur l'écran d'accueil"**
4. Appuyez **"Ajouter"**
5. L'icône 🏀 apparaît sur votre écran comme une vraie appli !

### Sur Android (Chrome) :
1. Ouvrez votre URL dans **Chrome**
2. Appuyez sur les **3 points** en haut à droite
3. Appuyez **"Ajouter à l'écran d'accueil"**
4. Appuyez **"Ajouter"**

---

## Partager l'app à vos joueurs

Envoyez simplement le lien par **WhatsApp ou SMS** :

```
Bonjour ! Voici mon application pour réserver tes entraînements 🏀
👉 https://playersuperlvl.vercel.app

Connecte-toi avec ton prénom + nom et ton code d'accès.
Tu peux l'installer sur ton téléphone comme une vraie appli !
```

---

## Identifiants de connexion

| Rôle | Login | Mot de passe / Code |
|------|-------|---------------------|
| **Coach Wawa** | — | `wawa2024` |
| Lucas Martin (démo) | Lucas Martin | `lucas123` |
| Sarah Kone (démo) | Sarah Kone | `sarah123` |

⚠️ **Important** : Changez le mot de passe coach dans le fichier `src/App.jsx`
Cherchez `wawa2024` et remplacez par votre vrai mot de passe.

---

## Ajouter un nouveau joueur

En tant que coach :
1. Connectez-vous avec votre mot de passe
2. Allez dans **Fiche joueur** → **+ Nouvelle fiche**
3. Remplissez les infos et choisissez un **code d'accès** pour le joueur
4. Communiquez ce code au joueur par message privé

---

## Questions fréquentes

**Les données sont-elles sauvegardées ?**
Pour l'instant, les données sont en mémoire locale du navigateur. Pour une vraie sauvegarde permanente, une étape supplémentaire avec Firebase est nécessaire (gratuit, me demander).

**L'app fonctionne-t-elle sans internet ?**
Oui ! Grâce au Service Worker (PWA), l'app se charge même hors connexion après la première visite.

**Peut-on avoir un vrai nom de domaine ?**
Oui, achetez `playersuperlvl.fr` sur ovh.com (~10€/an) et connectez-le dans les paramètres Vercel.

---

*Créé avec ❤️ pour Coach Wawa — PlayerSuperLvl v1.0*
