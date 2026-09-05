# Contexte — moncreneau-node

SDK client officiel Node.js pour l'API MonCréneau (`@moncreneau/api`, publié sur npm).

## Contenu

Client basé sur clé API (`mk_live_...`), promesses, gestion d'erreurs (`MoncreneauError`), vérification de signature webhook. Ressources : `appointments` (create/list/retrieve/cancel), `departments` (list/getAvailability). Base URL par défaut : `https://mc-prd.duckdns.org/api/v1`.

## Publication

```bash
cd moncreneau-node
npm login
npm publish --access public
# alternative GitHub Packages : voir "publication sdk.md" à la racine de /perso
```

## Documentation complète

https://moncreneau-docs.vercel.app/docs/v1/sdks/nodejs (voir aussi `moncreneau-docs/`)

## À maintenir en synchro avec

L'API publique exposée par `rdv/` (backend). Toute évolution d'endpoint public doit être répercutée ici et dans `moncreneau-docs`.
