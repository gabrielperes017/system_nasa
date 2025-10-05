const planetData = {
  mercurio: "Mercúrio é o planeta mais próximo do Sol e tem temperaturas extremas.",
  venus: "Vênus é envolto por nuvens densas e é o planeta mais quente do sistema solar.",
  terra: "A Terra é o único planeta conhecido por abrigar vida e tem água em abundância.",
  marte: "Marte é o planeta vermelho e possui montanhas e vales imensos.",
  jupiter: "Júpiter é o maior planeta e possui uma enorme mancha de tempestade.",
  saturno: "Saturno é conhecido por seus anéis majestosos de gelo e poeira.",
  urano: "Urano gira de lado e tem uma coloração azul-esverdeada.",
  netuno: "Netuno é o planeta mais distante e tem ventos extremamente fortes."
};

document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("planet-query").value.toLowerCase().trim();
  const responseBox = document.getElementById("ai-response");

  responseBox.style.display = "block";
  responseBox.textContent = "";

  const response = planetData[query] || "Desculpe, não encontrei informações sobre esse planeta.";
  
  let i = 0;
  const typing = setInterval(() => {
    if (i < response.length) {
      responseBox.textContent += response[i];
      i++;
    } else {
      clearInterval(typing);
    }
  }, 30);
});
