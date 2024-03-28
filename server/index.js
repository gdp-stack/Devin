const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simuler la structure des mots associés à différents niveaux de proximité pour un mot secret
const associations = {
    "port": {
        "0-10%": ["voile", "marin", "île", "phare", "vague", "horizon", "sable", "ancre", "corde", "boussole"],
        "10-20%": ["bateau", "navire", "embarcation", "pêcheur", "quai", "radeau", "voilier", "canot", "ponton", "amarre"],
        "20-30%": ["cargo", "fret", "conteneur", "grue", "logistique", "transport", "dock", "hangar", "cale", "débarquement"],
        "30-40%": ["marina", "yacht", "jetée", "lagon", "crique", "mouillage", "ancrage", "escale", "capitainerie", "varech"],
        "40-50%": ["écluse", "canal", "barrage", "rivière", "estuaire", "fleuve", "digue", "bassin", "chenal", "passerelle"],
        "50-60%": ["navigation", "cartographie", "exploration", "voyage", "expédition", "aventure", "pilote", "carte marine", "longitude", "latitude"],
        "60-70%": ["mer", "océan", "eau", "tide", "algue", "plongée", "nautique", "marée", "écume", "profondeur"],
        "70-80%": ["commerce", "échange", "marchandise", "importation", "exportation", "douane", "tarif", "colis", "palette", "consignation"],
        "80-90%": ["accueil", "sécurité", "surveillance", "sauvetage", "secours", "gardien", "patrouille", "vigie", "sémaphore", "balise"],
        "90-99%": ["darse", "quai", "terminal", "accostage", "amarrage", "embarcadère", "infrastructures", "zone maritime", "activité maritime", "ancrage"]
    },
    "diplomatie": {
        "0-10%": ["loi", "tradition", "échange", "culture", "langue", "accueil", "respect", "écoute", "curiosité", "ouverture"],
        "10-20%": ["conférence", "séminaire", "forum", "débat", "réunion", "entretien", "consultation", "assemblée", "dialogue", "discussion"],
        "20-30%": ["pacte", "accord", "traité", "convention", "charte", "protocole", "alliance", "engagement", "arrangement", "entente"],
        "30-40%": ["médiation", "arbitrage", "conciliation", "négociation", "pourparler", "intercession", "médiateur", "arbitre", "conciliateur", "négociateur"],
        "40-50%": ["ambassade", "consulat", "mission", "délégation", "représentation", "attaché", "consul", "ambassadeur", "envoyé", "délégué"],
        "50-60%": ["coopération", "aide", "assistance", "partenariat", "collaboration", "soutien", "solidarité", "appui", "contribution", "union"],
        "60-70%": ["crise", "conflit", "tension", "désaccord", "litige", "dispute", "affrontement", "opposition", "rivalité", "contentieux"],
        "70-80%": ["paix", "stabilité", "harmonie", "réconciliation", "détente", "pacification", "normalisation", "trêve", "cessation", "apaisement"],
        "80-90%": ["sécurité", "défense", "protection", "garantie", "prévention", "vigilance", "surveillance", "sauvegarde", "conservation", "préservation"],
        "90-99%": ["diplomate", "chancelier", "secrétaire", "représentant", "émissaire", "intermédiaire", "plénipotentiaire", "attaché", "conseiller", "agent"]
    },
    "argent": {
        "0-10%": ["cristal", "bois", "pierre", "verre", "coton", "plastique", "cuivre", "fer", "sable", "eau"],
        "10-20%": ["troque", "achat", "vente", "marché", "commerce", "échange", "bazar", "foire", "halles", "marchandise"],
        "20-30%": ["bourse", "action", "titre", "placement", "capital", "finance", "économie", "richesse", "patrimoine", "fonds"],
        "30-40%": ["banque", "compte", "crédit", "débit", "épargne", "prêt", "liquidité", "billets", "pièces", "portemonnaie"],
        "40-50%": ["or", "platine", "bijou", "trésor", "fortune", "héritage", "don", "précieux", "valeureux", "gemme"],
        "50-60%": ["salaire", "revenu", "paye", "allocation", "subvention", "bénéfice", "profit", "gain", "intérêt", "dividende"],
        "60-70%": ["numéraire", "liquidités", "espèces", "ressources", "moyens", "budget", "allocation", "capitaux", "avoirs", "actifs"],
        "70-80%": ["solde", "balance", "comptabilité", "financier", "flux", "bilan", "budget", "planification", "évaluation", "analyse"],
        "80-90%": ["liquide", "métal", "billet", "pièce", "physique", "change", "paiement", "échange", "transfert", "opération"],
        "90-99%": ["devise", "monnaie", "espèces", "fonds", "finances", "ressources", "actif", "capitaux", "patrimoine", "trésorerie"]
    },
    "rapidité": {
        "0-10%": ["marche", "flânerie", "balade", "repos", "pause", "calme", "tranquillité", "lenteur", "détente", "sommeil"],
        "10-20%": ["rythme", "mouvement", "vitesse", "course", "sprint", "fugue", "évasion", "poursuite", "trajectoire", "direction"],
        "20-30%": ["accélération", "agilité", "réflexe", "précipitation", "hâte", "empressement", "célérité", "vivacité", "promptitude", "diligence"],
        "30-40%": ["efficacité", "productivité", "performance", "compétence", "aptitude", "habileté", "capacité", "virtuosité", "maîtrise", "expertise"],
        "40-50%": ["instantané", "immédiat", "éclair", "foudroyant", "expéditif", "sonique", "supersonique", "turboréacteur", "vitesse lumière", "quantique"],
        "50-60%": ["réaction", "réponse", "retour", "résultat", "issue", "conclusion", "solution", "aboutissement", "fin", "achèvement"],
        "60-70%": ["urgence", "alerte", "critique", "priorité", "nécessité", "exigence", "impératif", "obligation", "commandement", "injonction"],
        "70-80%": ["élan", "impulsion", "force", "dynamisme", "énergie", "vigueur", "puissance", "intensité", "ardeur", "passion"],
        "80-90%": ["tachymètre", "chronomètre", "sablier", "horloge", "minuterie", "compteur", "timer", "calendrier", "agenda", "planning"],
        "90-99%": ["vélocité", "célérité", "promptitude", "vivacité", "allure", "hâte", "précipitation", "agilité", "empressement", "accélération"]
    },
    "communication": {
        "0-10%": ["silence", "isolement", "solitude", "retraite", "intimité", "secret", "discrétion", "réserve", "prudence", "calme"],
        "10-20%": ["geste", "mimique", "regard", "toucher", "sensation", "perception", "intuition", "impression", "sentiment", "émotion"],
        "20-30%": ["parole", "mot", "phrase", "message", "propos", "discours", "dialogue", "conversation", "échange", "discussion"],
        "30-40%": ["écrit", "texte", "document", "lettre", "mail", "note", "rapport", "article", "journal", "livre"],
        "40-50%": ["information", "nouvelle", "annonce", "bulletin", "rapport", "communiqué", "déclaration", "proclamation", "publication", "diffusion"],
        "50-60%": ["média", "presse", "radiodiffusion", "télévision", "internet", "réseau", "social", "multimédia", "numérique", "virtuel"],
        "60-70%": ["langage", "vocabulaire", "terminologie", "jargon", "argot", "lingo", "syntaxe", "grammaire", "orthographe", "prononciation"],
        "70-80%": ["entretien", "consultation", "séance", "réunion", "conférence", "symposium", "colloque", "forum", "débat", "panel"],
        "80-90%": ["signal", "symbole", "code", "signe", "indicateur", "alerte", "avertissement", "consigne", "directive", "instruction"],
        "90-99%": ["expression", "articulation", "enonciation", "prononciation", "exposition", "présentation", "illustration", "manifestation", "révélation", "affichage"]
    },
    "avatar": {
        "0-10%": ["réalité", "concret", "physique", "naturel", "matériel", "tangible", "palpable", "vivant", "organique", "biologique"],
        "10-20%": ["identité", "personnalité", "caractère", "nature", "essence", "être", "soi", "individu", "personne", "humain"],
        "20-30%": ["masque", "façade", "apparence", "semblant", "déguisement", "costume", "illusion", "fictif", "artificiel", "simulacre"],
        "30-40%": ["profil", "image", "icône", "symbole", "emblème", "représentation", "figure", "effigie", "signe", "marque"],
        "40-50%": ["alter ego", "double", "copie", "clone", "réplique", "duplication", "jumeau", "équivalent", "similitude", "analogie"],
        "50-60%": ["personnage", "héros", "protagoniste", "figure", "entité", "création", "construction", "fabrication", "invention", "conception"],
        "60-70%": ["virtuel", "numérique", "informatique", "cybernétique", "technologique", "électronique", "logiciel", "programme", "application", "interface"],
        "70-80%": ["transformation", "mutation", "métamorphose", "changement", "évolution", "transition", "conversion", "modulation", "révision", "réinvention"],
        "80-90%": ["projection", "extension", "expansion", "diffusion", "distribution", "dissemination", "partage", "communication", "expression", "manifestation"],
        "90-99%": ["incarnation", "embodiment", "personnification", "concrétisation", "réalisation", "materialisation", "manifestation", "expression", "émanation", "exemplification"]
    },
    "étoile": {
        "0-10%": ["obscurité", "ténèbres", "nuit", "ombre", "noirceur", "penombre", "obscurcissement", "eclipse", "voile", "occultation"],
        "10-20%": ["lune", "satellite", "astre", "lumière nocturne", "croissant", "pleine lune", "quartier", "gibbeuse", "éclipse lunaire", "maree"],
        "20-30%": ["planète", "corps céleste", "sphère", "globe", "orbite", "rotation", "révolution", "monde", "terre", "saturne"],
        "30-40%": ["galaxie", "voile lactée", "amas", "nébuleuse", "univers", "cosmos", "infinité", "espace", "vide spatial", "cosmologie"],
        "40-50%": ["soleil", "astre solaire", "source de lumière", "rayonnement", "éclat", "levée", "coucher", "solarité", "photosphère", "chromosphère"],
        "50-60%": ["constellation", "alignement", "configuration", "zodiaque", "signe astrologique", "big dipper", "orion", "cassiopeia", "scorpion", "balance"],
        "60-70%": ["comète", "météorite", "astéroïde", "corps errant", "chevelure", "queue", "orbite cométaire", "étoile filante", "impacteur", "nuage d'oort"],
        "70-80%": ["supernova", "nova", "explosion stellaire", "nébuleuse planétaire", "rémanente", "naine blanche", "trou noir", "pulsar", "quasar", "événement hypernova"],
        "80-90%": ["luminescence", "brillance", "scintillement", "clignotement", "rayonnement", "phosphorescence", "reflet", "mire", "éclat", "halo"],
        "90-99%": ["astronomie", "observation céleste", "télescope", "observatoire", "cartographie stellaire", "astrophysique", "cosmographie", "astrologie", "ciel étoilé", "voûte céleste"]
    },
    "parodie": {
        "0-10%": ["sérieux", "gravité", "formalité", "solennité", "rigueur", "exactitude", "précision", "authenticité", "fidélité", "exactitude"],
        "10-20%": ["littérature", "œuvre", "roman", "nouvelle", "poésie", "drame", "tragédie", "épopée", "récit", "conte"],
        "20-30%": ["critique", "satire", "ironie", "sarcastique", "moquerie", "raillerie", "cynisme", "mordant", "persiflage", "caricature"],
        "30-40%": ["humour", "comédie", "farce", "buffonnerie", "plaisanterie", "drôlerie", "ludique", "divertissement", "récréation", "amusant"],
        "40-50%": ["imitation", "mimétisme", "copie", "réplique", "simulation", "semblance", "emprunt", "pastiche", "réitération", "duplication"],
        "50-60%": ["exagération", "hyperbole", "outrance", "amplification", "surenchère", "déformation", "distorsion", "gonflement", "surdimension", "enflure"],
        "60-70%": ["sketch", "numéro", "cabaret", "stand-up", "monologue", "one-man-show", "performance", "spectacle", "scène", "théâtre"],
        "70-80%": ["détournement", "réappropriation", "transformation", "modification", "altération", "variation", "mutation", "changement", "conversion", "révision"],
        "80-90%": ["fantaisie", "invention", "créativité", "originalité", "imagination", "ingéniosité", "novateur", "singulier", "unique", "innovant"],
        "90-99%": ["burlesque", "grotesque", "loufoque", "absurde", "surréaliste", "bizarre", "étrange", "insolite", "incongru", "hilarant"]
    },
    "colère": {
        "0-10%": ["calme", "sérénité", "paix", "tranquillité", "placide", "douceur", "harmonie", "repos", "apaisement", "zen"],
        "10-20%": ["perturbation", "agitation", "nervosité", "inquiétude", "anxiété", "stress", "tension", "trouble", "affliction", "tourment"],
        "20-30%": ["irritation", "exaspération", "agacement", "mécontentement", "frustration", "déplaisir", "contrariété", "dispute", "querelle", "discorde"],
        "30-40%": ["fureur", "rage", "furie", "ire", "hargne", "véhémence", "violence", "tempête", "orage", "tumulte"],
        "40-50%": ["hostilité", "antagonisme", "animosité", "inimitié", "opposition", "rivalité", "conflit", "combat", "lutte", "affrontement"],
        "50-60%": ["amertume", "rancune", "ressentiment", "acrimonie", "aigreur", "malveillance", "dépit", "vengeance", "revanche", "malignité"],
        "60-70%": ["éclat", "explosion", "eruption", "bouillonnement", "sursaut", "révolte", "rébellion", "insurrection", "mutinerie", "soulèvement"],
        "70-80%": ["impulsivité", "impatience", "intolérance", "irascibilité", "emportement", "impétuosité", "volcanique", "explosif", "brusque", "précipité"],
        "80-90%": ["cri", "hurlement", "vocifération", "clameur", "rugissement", "braillement", "grondement", "tonnerre", "fracas", "clamour"],
        "90-99%": ["exaspération", "irritabilité", "agressivité", "piquante", "acerbicité", "brutalité", "ferocité", "ardeur", "intensité", "virulence"]
    },
    "paresse": {
        "0-10%": ["activité", "action", "travail", "effort", "énergie", "dynamisme", "vigueur", "assiduité", "industrie", "zèle"],
        "10-20%": ["mouvement", "mobilité", "exercice", "agitation", "occupation", "manœuvre", "opération", "fonctionnement", "performance", "productivité"],
        "20-30%": ["lenteur", "atermoiement", "délai", "procrastination", "hésitation", "différé", "retard", "pause", "ralentissement", "temporisation"],
        "30-40%": ["somnolence", "torpeur", "léthargie", "inertie", "assoupissement", "tranquillité", "repos", "détente", "relâche", "sieste"],
        "40-50%": ["indolence", "nonchalance", "mollesse", "fainéantise", "oisiveté", "apathie", "insouciance", "désintérêt", "indifférence", "langueur"],
        "50-60%": ["tranquillité", "calme", "paix", "repos", "sérénité", "placide", "quiétude", "relaxation", "décontraction", "aisance"],
        "60-70%": ["sédentarité", "immobilisme", "statisme", "inactivité", "stationnarité", "fixité", "stagnation", "repos", "désoeuvrement", "inoccupation"],
        "70-80%": ["rêverie", "contemplation", "méditation", "pensée", "réflexion", "introspection", "imagination", "songerie", "spéculation", "philosophie"],
        "80-90%": ["fatigue", "lassitude", "épuisement", "affaiblissement", "découragement", "abattement", "surmenage", "fatigué", "usé", "exténué"],
        "90-99%": ["lassitude", "fatigue", "défaitisme", "renoncement", "désillusion", "désintérêt", "découragement", "abdication", "soumission", "résignation"]
    },
    "bonus": {
        "0-10%": ["pénalité", "sanction", "amende", "punition", "malus", "désavantage", "obstacle", "entrave", "handicap", "frein"],
        "10-20%": ["base", "standard", "normal", "habituel", "ordinaire", "régulier", "courant", "moyen", "typique", "usuel"],
        "20-30%": ["addition", "supplément", "extension", "augmentation", "surplus", "excédent", "ajout", "extension", "expansion", "élargissement"],
        "30-40%": ["cadeau", "présent", "don", "offrande", "gratification", "faveur", "bienfait", "avantage", "libéralité", "générosité"],
        "40-50%": ["prime", "récompense", "gratification", "incitation", "stimulant", "encouragement", "motivation", "avantage", "perk", "bénéfice"],
        "50-60%": ["gain", "profit", "avantage", "intérêt", "bénéfice", "rendement", "revenu", "dividende", "fruit", "résultat"],
        "60-70%": ["promotion", "avancement", "progression", "ascension", "élévation", "amélioration", "optimisation", "enrichissement", "valorisation", "augmentation"],
        "70-80%": ["réduction", "remise", "rabais", "ristourne", "déduction", "abattement", "dégrèvement", "concession", "discount", "allègement"],
        "80-90%": ["loyauté", "fidélité", "attachement", "dévotion", "consécration", "allégeance", "adhesion", "engagement", "soutien", "solidarité"],
        "90-99%": ["extra", "supplémentaire", "additionnel", "complémentaire", "accrue", "étendu", "prolongé", "majoré", "enrichi", "amélioré"]
    },
    "flamme": {
        "0-10%": ["eau", "océan", "rivière", "pluie", "marais", "lac", "humidité", "gel", "froid", "glace"],
        "10-20%": ["terre", "pierre", "roche", "sable", "montagne", "volcan", "minéral", "argile", "cristal", "météorite"],
        "20-30%": ["bois", "forêt", "arbre", "branche", "feuille", "racine", "tronc", "flore", "végétation", "prairie"],
        "30-40%": ["lumière", "soleil", "lueur", "clair", "rayon", "éclat", "brillant", "phare", "lampe", "projecteur"],
        "40-50%": ["chaleur", "tiède", "chaud", "brûlant", "incandescent", "torride", "ardent", "canicule", "étuve", "sauna"],
        "50-60%": ["feu", "incendie", "embrasement", "bûcher", "brasier", "flammèche", "étincelle", "pyrotechnie", "combustion", "allumage"],
        "60-70%": ["passion", "désir", "amour", "ardeur", "enthousiasme", "fervor", "intensité", "vigueur", "élan", "zèle"],
        "70-80%": ["rouge", "orange", "jaune", "bleu", "violet", "couleur", "spectrum", "nuance", "teinte", "pigment"],
        "80-90%": ["fumée", "vapeur", "brouillard", "brume", "nuage", "exhalaison", "émanation", "poussière", "cendre", "suie"],
        "90-99%": ["allumer", "enflammer", "embraser", "calciner", "carboniser", "cremation", "rôtir", "chauffer", "incinérer", "consume"]
    },
    "ancien": {
        "0-10%": ["futur", "prospectif", "innovation", "avant-garde", "modernité", "technologie", "numérique", "futurisme", "nouveauté", "émergence"],
        "10-20%": ["récent", "nouveau", "actualité", "contemporain", "moderne", "actuel", "réforme", "innovant", "dernier", "fraîchement"],
        "20-30%": ["usé", "vieilli", "démodé", "passé", "obsolete", "révolu", "antiquité", "dépassé", "périmé", "vétuste"],
        "30-40%": ["tradition", "coutume", "héritage", "racine", "origine", "patrimoine", "folklore", "mémoire", "prédécesseur", "ancêtre"],
        "40-50%": ["classique", "historique", "légendaire", "mythique", "épique", "antique", "vintage", "retro", "timeless", "immortel"],
        "50-60%": ["document", "archive", "manuscrit", "chronique", "biographie", "généalogie", "annales", "vestige", "relique", "souvenir"],
        "60-70%": ["ruine", "vestige", "débris", "relique", "fossile", "artefact", "monument", "stèle", "pyramide", "temple"],
        "70-80%": ["civilisation", "dynastie", "empire", "royaume", "société", "culture", "peuple", "nation", "ethnie", "tribu"],
        "80-90%": ["préhistoire", "antiquité", "moyen-âge", "renaissance", "baroque", "rococo", "classicisme", "romantisme", "néoclassique", "gothique"],
        "90-99%": ["millénaire", "séculaire", "centenaire", "décennie", "éternel", "ageless", "intemporel", "perpétuel", "immuable", "persistant"]
    }
    // Ajouter ici les autres mots secrets et leurs associations
};

// Sélectionne un mot secret au hasard parmi les clés de l'objet associations
let currentSecretWord = selectRandomSecretWord();

function selectRandomSecretWord() {
    const keys = Object.keys(associations);
    return keys[Math.floor(Math.random() * keys.length)];
}

app.get('/new-game', (req, res) => {
    currentSecretWord = selectRandomSecretWord();
    console.log(`Nouveau mot secret sélectionné : ${currentSecretWord}`);
    res.json({ message: "Une nouvelle partie a commencée !", secretWord: currentSecretWord });
});

app.post('/guess', (req, res) => {
    const { word: submittedWord } = req.body;
    let temperature = 0;

    if (submittedWord === currentSecretWord) {
        temperature = 100; // Si le mot soumis est le mot secret, la température est de 100%
    } else {
        temperature = calculateTemperature(submittedWord, currentSecretWord); // Utiliser la logique actuelle pour calculer la température
    }

    res.json({ temperature, secretWord: currentSecretWord });
});

function calculateTemperature(submittedWord, secretWord) {
    const proximities = associations[secretWord];
    let temperature = 0;

    for (const [proximity, words] of Object.entries(proximities)) {
        if (words.includes(submittedWord)) {
            const proxRange = proximity.split("-");
            temperature = parseInt(proxRange[1]); // Utiliser la borne supérieure de chaque plage comme température
            break; // Quitter dès qu'une correspondance est trouvée
        }
    }

    // Si le mot soumis correspond au mot secret, considérer cela comme une correspondance à 100%
    if (submittedWord === secretWord) {
        temperature = 100;
    }

    return temperature;
}

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
