import { useEffect, useState } from 'react';
import cartasData from '../cartas.json';
import barajaEspanolaData from '../baraja_espanola_data.json';
import angelData from '../angel_data.json';
import { DECK_TYPES } from '../utils/deckUtils';

export default function useCartasData() {
  const [cartas, setCartas] = useState([]);

  useEffect(() => {
    if (cartasData && cartasData.cartas_oraculo) {
      const valueToNumberMap = {
        'as': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
        'seis': 6, 'siete': 7, 'sota': 10, 'caballero': 11, 'rey': 12
      };

      // Mapa para búsqueda rápida de baraja española
      const barajaEspanolaMap = new Map();
      barajaEspanolaData.forEach(card => {
        const tituloParts = card.titulo.toLowerCase().split(' de ');
        if (tituloParts.length > 1) {
          const palo = tituloParts[tituloParts.length - 1];
          barajaEspanolaMap.set(`${card.numero}-${palo}`, card);
        }
      });

      const processedCartas = cartasData.cartas_oraculo.map(carta => {
        if (carta.carta?.palo && carta.carta?.valor) {
          const barajaNumero = valueToNumberMap[carta.carta.valor];
          if (barajaNumero) {
            const spanishCard = barajaEspanolaMap.get(`${barajaNumero}-${carta.carta.palo}`);
            if (spanishCard) {
              return {
                ...carta,
                spanishKeyword: spanishCard.palabra_clave,
                spanishMeaning: spanishCard.significado,
                spanishMeaningInverted: spanishCard.invertida?.significado || null,
                titulo: spanishCard.titulo,
              };
            }
          }
        }
        return {
          ...carta,
          egyptianKeyword: carta.palabras_clave,
          egyptianKeywordInverted: carta.palabras_clave_al_reves,
        };
      });

      const processedAngelCartas = angelData.map(angelCard => ({
        numero: angelCard.numero,
        nombre: angelCard.titulo,
        significado: {
          derecho: angelCard.significado,
          reves: angelCard.invertido,
        },
        deckType: DECK_TYPES.ANGEL,
      }));

      setCartas([...processedCartas, ...processedAngelCartas]);
    }
  }, []);

  return cartas;
}
