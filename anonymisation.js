const fs = require('fs');
const path = require('path');
const PDFParser = require("pdf2json");

// 1. Fonction d'anonymisation de sécurité
function anonymiserTexte(texte) {
    if (!texte) return "";
    let propre = texte.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL_CACHÉ]");
    propre = propre.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[IP_CACHÉE]");
    propre = propre.replace(/(password|passwd|token|key|secret)=\S+/gi, "$1=[SECRET_CACHÉ]");
    const regexBlocLong = /\b[a-zA-Z0-9\+\/=\._\-]{45,}\b/g;
    return propre.replace(regexBlocLong, "[BLOC_DE_CODE_SENSIBLE_CACHÉ]");
}

// Nettoyage des balises HTML structurelles
function nettoyerBalisesHTML(html) {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

// 2. FONCTION DE FILTRAGE OPTIMISÉE POUR L'ÉVALUATION RGESN
function extraireContenuUtileRGESN(texteBrut) {
    const lignes = texteBrut.split('\n');
    let texteFiltre = [];

    // Mots-clés cibles spécifiques aux critères d'évaluation RGESN et d'écoconception
    const conceptsRapport = [
        "rgesn", "critère", "écoconception", "éco-conception", "sobriété numérique",
        "pue", "wue", "bas carbone", "cookies", "tracking", "requêtes", "requête",
        "infrastructure", "hébergement", "hébergé", "souverain", "chiffrement", "tls", "https"
    ];

    lignes.forEach(ligne => {
        const ligneNettoyee = ligne.trim();
        const ligneMinuscule = ligneNettoyee.toLowerCase();

        if (ligneNettoyee.length < 5) return;

        // Détection de la pertinence de la ligne pour l'évaluation
        const estUtile = conceptsRapport.some(concept => ligneMinuscule.includes(concept));

        if (estUtile) {
            // Nettoyage final et anonymisation de sécurité
            const ligneAnonyme = anonymiserTexte(nettoyerBalisesHTML(ligneNettoyee));
            if (!texteFiltre.includes(ligneAnonyme)) {
                texteFiltre.push(ligneAnonyme);
            }
        }
    });

    return texteFiltre.join('\n');
}

// 3. Affichage du résultat final dans le terminal
function afficherDansLeTerminal(nomFichierDorigine, texteAAfficher) {
    if (!texteAAfficher || texteAAfficher.trim() === "") {
        console.log(`\n⚠️  [${nomFichierDorigine}] : Aucune donnée d'évaluation RGESN pertinente trouvée.`);
        return;
    }
    
    console.log(`\n======================================================================`);
    console.log(`📊 DONNÉES UTILES À L'ÉVALUATION RGESN POUR : ${nomFichierDorigine}`);
    console.log(`======================================================================`);
    console.log(texteAAfficher);
    console.log(`======================================================================\n`);
}

// 4. Traitement du fichier HTML
function traiterFichierHTML(fichier) {
    try {
        const contenuHTML = fs.readFileSync(fichier, 'utf8');
        const contenuUtile = extraireContenuUtileRGESN(contenuHTML);
        afficherDansLeTerminal(fichier, contenuUtile);
    } catch (err) {
        console.error(`❌ Erreur lors de la lecture du fichier HTML ${fichier} :`, err);
    }
}

// 5. Traitement du fichier PDF
function traiterFichierPDF(fichier) {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
        const texteBrut = pdfParser.getRawTextContent();
        const contenuUtile = extraireContenuUtileRGESN(texteBrut);
        afficherDansLeTerminal(fichier, contenuUtile);
    });
    pdfParser.loadPDF(fichier);
}

// ==========================================
// 6. LOGIQUE PRINCIPALE
// ==========================================
const fichiers = fs.readdirSync('./');
const fichiersAAnonymiser = fichiers.filter(f => f.toLowerCase().endsWith('.html') || f.toLowerCase().endsWith('.pdf'));

if (fichiersAAnonymiser.length === 0) {
    console.log("⚠️ Aucun fichier HTML ou PDF trouvé dans le dossier actuel.");
} else {
    fichiersAAnonymiser.forEach(fichier => {
        const extension = path.extname(fichier).toLowerCase();
        if (extension === '.html') traiterFichierHTML(fichier);
        if (extension === '.pdf') traiterFichierPDF(fichier);
    });
}