// 1. OUVRIR/FERMER LE CHAT
function toggleChat() {
    const chat = document.getElementById('chatWindow');
    if (chat) chat.classList.toggle('hidden');
}

// 2. ENVOYER UN MESSAGE ET RÉPONSE IA
function envoyerMessageChat() {
    const input = document.getElementById('userMsg');
    const content = document.getElementById('chatContent');
    
    if (input && input.value.trim() !== "") {
        const messageVal = input.value;
        // Ajout message utilisateur
        content.innerHTML += `<p class="bg-emerald-100 p-2 rounded-lg text-right ml-8 shadow-sm">${messageVal}</p>`;
        input.value = ""; // Vide le champ

        // Simulation réponse IA
        setTimeout(() => {
            content.innerHTML += `<p class="bg-white p-2 rounded-lg border border-slate-100 mr-8 shadow-sm">J'ai bien reçu : "${messageVal}".</p>`;
            content.scrollTop = content.scrollHeight;
        }, 600);
    }
}

// 3. LANCER L'ANALYSE
function afficherResultats() {
    const form = document.getElementById('formPage');
    const results = document.getElementById('resultsPage');
    
    if (form && results) {
        form.classList.add('hidden'); // Cache le formulaire
        results.classList.remove('hidden'); // Montre le score
        window.scrollTo(0, 0);

        // Simulation IA qui s'ouvre toute seule
        setTimeout(() => {
            const chat = document.getElementById('chatWindow');
            if (chat && chat.classList.contains('hidden')) {
                toggleChat();
                document.getElementById('chatContent').innerHTML += `
                    <div class="bg-amber-50 p-2 rounded-lg border border-amber-100 mt-2 text-amber-900 shadow-sm">
                        <strong>IA :</strong> Analyse terminée. Il manque quelques détails sur l'hébergement.
                    </div>`;
            }
        }, 2000);
    }
}

// 4. RETOUR ET SUPPRESSION HISTORIQUE
function retourMenu() {
    const form = document.getElementById('formPage');
    const results = document.getElementById('resultsPage');
    const chatContent = document.getElementById('chatContent');
    
    if (form && results) {
        results.classList.add('hidden');
        form.classList.remove('hidden');
        window.scrollTo(0, 0);

        // --- NETTOYAGE COMPLET ---
        if (chatContent) {
            chatContent.innerHTML = `<p class="bg-white p-2 rounded-lg shadow-sm border border-slate-100 italic">Bonjour ! Je peux vous aider sur les 30 critères. Que voulez-vous savoir ?</p>`;
        }
    }
}
