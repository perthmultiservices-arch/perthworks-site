# Céleste — Prototype WebGL (Next.js + React Three Fiber + GSAP)

Un site vitrine pour une pâtisserie fictive ("Céleste"), avec une pièce
signature en 3D interactive au centre de l'expérience : rotation à 360°
à la souris/au doigt, puis un travelling de caméra piloté par le scroll
(GSAP ScrollTrigger) qui zoome sur trois détails de la pièce.

C'est un **vrai site fonctionnel**, pas une maquette : la 3D est rendue en
temps réel avec Three.js (WebGL), les animations sont pilotées par de vrais
hooks de scroll, et le formulaire de contact appelle une vraie route API
Next.js.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Three.js** via **React Three Fiber** + **@react-three/drei**
- **GSAP** + **ScrollTrigger** pour le travelling de caméra scrubé au scroll
- **@react-three/postprocessing** (Bloom + Vignette, désactivé sur mobile)
- **Tailwind CSS**
- Déploiement visé : **Vercel**

## Ce qui est réellement implémenté

- Objet 3D procédural (gâteau à 3 étages, construit à partir de primitives
  Three.js + matériaux PBR — `MeshPhysicalMaterial` avec clearcoat pour le
  glaçage), **pas une image ni une vidéo**.
- Rotation à 360° par glisser-déposer (souris et tactile), avec inertie et
  rotation automatique au repos.
- Travelling de caméra cinématique scrubé au scroll (GSAP ScrollTrigger,
  section pinnée de 520vh), avec 3 arrêts sur des points de détail
  (biscuit, cœur framboise, glaçage), chacun avec son propre texte et son
  propre repère visuel ancré en 3D (`<Html>` de drei, qui suit l'objet).
- Galerie avec lightbox, réveils au scroll (IntersectionObserver), process
  en 4 étapes, témoignage, navigation responsive avec menu mobile.
- Formulaire de contact **fonctionnel** : `POST /api/contact` valide les
  champs côté serveur et répond un succès/erreur réel (voir plus bas pour
  brancher un vrai envoi d'e-mail).
- SEO : métadonnées Next.js (title/description/OG/Twitter), JSON-LD
  `Bakery`, images servies via `next/image`.
- Mobile : FOV et distance de caméra adaptés à l'écran portrait,
  post-processing et ombres désactivés sous 768px pour la performance,
  nav avec menu plein écran.

## Ce qui est un placeholder (volontairement)

Il n'y a **aucun modèle 3D externe** (`.glb`/`.gltf`) dans ce prototype — le
gâteau est généré par code (cylindres, tores, cônes, icosaèdre) pour rester
livrable sans dépendance à un asset externe, comme demandé. Le rendu est
réel et interactif, mais un vrai modèle scanné/sculpté apporterait un bond
de réalisme. Pour un rendu photoréaliste, fournir :

| Fichier à fournir | Usage |
|---|---|
| `cake.glb` (ou `.gltf` + textures) | Remplace `src/components/scene/Cake.tsx` : un modèle scanné/sculpté du gâteau signature, avec UVs propres. |
| Textures PBR (`basecolor`, `normal`, `roughness`, `ao`) | Pour la glaçure, le biscuit, la crème — en 2–4K. |
| Un fichier `.hdr` de studio (environnement lumineux) | Remplace le préréglage `Environment preset="apartment"` de drei par votre propre lightning setup, à placer dans `/public/hdri/` et charger avec `<Environment files="/hdri/studio.hdr" />`. |
| Photos produit réelles | Pour remplacer les images Unsplash de la galerie (`src/components/sections/Gallery.tsx`) par vos propres pièces. |

Charger un `.glb` se fait avec `useGLTF` de drei :
```tsx
import { useGLTF } from '@react-three/drei';
const { scene } = useGLTF('/models/cake.glb');
return <primitive object={scene} />;
```

## Lancer en local

```bash
cd webgl-studio
npm install
npm run dev
```
Ouvrir [http://localhost:3000](http://localhost:3000).

Build de production :
```bash
npm run build
npm run start
```

## Déployer sur Vercel

Cette session n'a pas d'accès autorisé à votre compte Vercel (le token
disponible ici n'a pas la portée nécessaire), le déploiement n'a donc
**pas** été fait automatiquement. Deux façons de le faire vous-même :

**Option A — via le dashboard Vercel (le plus simple)**
1. Poussez ce dépôt sur GitHub (déjà fait si vous lisez ceci depuis le repo).
2. Sur [vercel.com/new](https://vercel.com/new), importez le repo.
3. **Important** : comme ce projet vit dans un sous-dossier, réglez
   **Root Directory** sur `webgl-studio` dans la configuration du projet.
4. Déployez — aucune variable d'environnement n'est requise pour que le
   site fonctionne (le formulaire de contact loggue simplement les
   soumissions tant qu'aucun fournisseur d'e-mail n'est branché).

**Option B — via la CLI Vercel**
```bash
cd webgl-studio
npx vercel        # déploiement de preview
npx vercel --prod # mise en production
```

## Brancher un vrai envoi d'e-mail sur le formulaire de contact

Le endpoint `src/app/api/contact/route.ts` valide déjà les champs et
répond correctement, mais ne fait que logger la demande (`console.log`).
Pour envoyer un vrai e-mail, par exemple avec [Resend](https://resend.com) :

```bash
npm install resend
```
```ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'contact@votredomaine.com',
  to: 'hello@celeste-patisserie.com.au',
  subject: `Nouvelle demande de ${name}`,
  text: message,
});
```
Puis ajoutez `RESEND_API_KEY` dans les variables d'environnement du projet
Vercel (Project Settings → Environment Variables).

## Sécurité des dépendances

`npm audit` signale 2 vulnérabilités restantes, toutes deux **internes à
Next.js 14.2.x lui-même** (une version patchée de `postcss` embarquée dans
les outils de build de Next, pas dans votre propre pipeline CSS). Les
corriger demanderait de passer à Next 16, une migration majeure
(React 19) non compatible avec `@react-three/fiber` v8 utilisé ici. À
surveiller lors d'une future mise à jour majeure du stack 3D.

## Structure du projet

```
webgl-studio/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # polices, métadonnées SEO, JSON-LD
│   │   ├── page.tsx         # assemble toutes les sections
│   │   ├── globals.css
│   │   └── api/contact/route.ts
│   ├── components/
│   │   ├── scene/           # Cake, CameraRig, Experience3D, PostFX
│   │   ├── sections/        # Manifesto, Gallery, Process, Testimonial, Contact, Footer
│   │   ├── nav/Nav.tsx
│   │   └── ui/Reveal.tsx
│   └── lib/                 # gsapConfig, cameraPath, useIsMobile
└── README.md
```
