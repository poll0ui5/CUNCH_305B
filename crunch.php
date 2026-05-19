<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Pré-audit</title>
</head>
<body>

  <input type="text" id="champ1" placeholder="Entité auditée"><br><br>
  <input type="text" id="champ2" placeholder="Contexte"><br><br>

  <button onclick="analyser()">Analyser</button>

  <div id="resultat"></div>

  <script>
    async function analyser() {
      const champ1 = document.getElementById("champ1").value;
      const champ2 = document.getElementById("champ2").value;

      const prompt = `Entité : ${champ1}\nContexte : ${champ2}\n\nFais une analyse de pré-audit.`;

      document.getElementById("resultat").innerText = "Analyse en cours…";

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "VOTRE_CLE_API",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      document.getElementById("resultat").innerText = data.content[0].text;
    }
  </script>

</body>
</html>