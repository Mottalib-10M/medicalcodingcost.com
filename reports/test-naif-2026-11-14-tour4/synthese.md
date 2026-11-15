# Synthèse du test naïf du 2026-11-14, 4e tour : medicalcodingcost.com

Notes du 4e tour : testeur 1 7/7/8, testeur 2 7/7/8, testeur 3 7/6/8. Corrections du 5e et dernier tour (aucun
testeur ne repasse). L'éditeur a validé **une seule** correction : la contradiction sur « par quoi commencer ».
Rien des tours 1 à 3 n'est défait.

| # | Difficulté relevée (testeurs) | Décision | Raison / correction |
|---|---|---|---|
| 1 | Accueil « Start with the CCA » contre page CPC « the one AAPC calls the best place to start a coding career » : je ne sais plus par quoi commencer (1, 2, 3) | **corrigé** | Une seule règle partout, selon le lieu de travail visé (critère que le site donnait déjà : « Start from where you want to work ») : « New to coding? Start with the CPC for doctor offices, or the CCA for hospitals, as it leads to the CCS. » Appliquée à : chapeau de l'accueil (CPC et CCA développés à la première apparition), résumé de la page CPC (phrase « best place to start » retirée), FAQ « Which medical coding certification should a beginner take? » et paragraphe « How to choose » de la page Medical coding certification, chapeau et tableau de la page Medical billing and coding (cible du bouton « Which one to take first → »), note du choix « Starting out » du calculateur de cette page, libellé du menu CCA (« entry level, hospitals » au lieu de « entry level, to start »). Recherche de « start », « first », « begin », « beginner », « best place » sur `src/` : plus aucune autre recommandation de départ. |
| 2 | « Your chance of passing » confondu avec le score d'examen blanc ; « $553 on average » (1, 2, 3) | **non retenu** | Non validé par l'éditeur pour ce dernier tour. |
| 3 | Tableau « Average paid per candidate, retakes included » abstrait sur la page CCA (1, 2) | **non retenu** | Non validé par l'éditeur pour ce dernier tour. |
| 4 | « 1 years » au pluriel (1, 2) | **non retenu** | Non validé par l'éditeur pour ce dernier tour (défaut objectif à reprendre). |
| 5 | Paragraphe des trois prix trop chargé en sigles (1, 2, 3) | **non retenu (allégé en passant)** | Non validé ; le développement de CPC passe dans la phrase du dessus, qui le nomme en premier. |
| 6 | Totaux sans cours ni livres, lien « full cost » trop bas (2) ; menu « Getting started » redondant (2) ; autres remarques d'un seul testeur | **non retenu** | Non validé par l'éditeur pour ce dernier tour. |

`npm run check` : passe, sortie 0 (180 tests ; layout 20 pages × 4 largeurs, premier écran 0/18, règles, mot-clé 0/18).
Un premier passage échouait sur le premier écran (accueil, 806 px) puis sur le mot-clé (« certification » absent du
1er paragraphe) : phrase de l'accueil resserrée (« New to coding? Start your certification with the CPC… »).
Captures refaites et relues : accueil, CPC, Medical billing and coding (`reports/med-t5-captures-2/`).
