const fs = require('fs');
const path = require('path');

// Read the original JSON file
const filePath = path.join(__dirname, 'cartas.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Update each card
const updatedCartas = data.cartas_oraculo.map(carta => ({
  ...carta,
  imagen_tarot: carta.imagen_tarot || "",
  carta: {
    ...carta.carta,
    imagen_baraja: carta.carta.imagen_baraja || ""
  }
}));

// Write the updated data back to the file
fs.writeFileSync(
  filePath,
  JSON.stringify({ cartas_oraculo: updatedCartas }, null, 2),
  'utf8'
);

console.log('Successfully updated all cards with imagen_tarot and imagen_baraja fields.');
