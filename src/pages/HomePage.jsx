import React, { useEffect, useState } from 'react';
import CardList from '../components/organisms/CardList/CardList';
import cartasData from '../cartas.json';
import riderData from '../rider.json';
import barajaEspanolaData from '../baraja_espanola_data.json';
import angelData from '../angel_data.json';
import symbolonCartasData from '../symbolon_cartas_reducido.json';

const DECK_TYPES = {
  EGYPTIAN: 'egipcio',
  RIDER_WAITE: 'rider-waite',
  SPANISH: 'baraja-espanola',
  ANGEL: 'angel',
  FENESTRA: 'fenestra',
  SYMBOLON: 'symbolon'
};

const HomePage = () => {
  const [cartas, setCartas] = useState([]);

  // Cargar y procesar los datos de las cartas
  useEffect(() => {
    if (cartasData && cartasData.cartas_oraculo) {
      const valueToNumberMap = {
        'as': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
        'seis': 6, 'siete': 7, 'sota': 10, 'caballero': 11, 'rey': 12
      };

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
              };
            }
          }
        }
        return { ...carta, egyptianKeyword: carta.palabras_clave, egyptianKeywordInverted: carta.palabras_clave_al_reves };
      });

      const processedAngelCartas = angelData.map(angelCard => {
        return {
          numero: angelCard.numero,
          nombre: angelCard.titulo,
          significado: {
            derecho: angelCard.significado,
            reves: angelCard.invertido
          },
          deckType: DECK_TYPES.ANGEL
        };
      });

      setCartas([...processedCartas, ...processedAngelCartas]);
    }
  }, []);

  // Obtener la URL de la imagen del frente de la carta
  const getFrontImageUrl = (number, deckType) => {
    if (deckType === DECK_TYPES.SPANISH) {
      return `/images/baraja_espanola/${number}.jpg`;
    }
    return `/images/baraja_span/${number}.jpg`;
  };

  // Obtener la URL de la imagen del reverso de la carta
  const getBackImageUrl = (number, deckType) => {
    if (deckType === DECK_TYPES.RIDER_WAITE) {
      return `/images/tarot-rider-waite/${number}.png`;
    } else if (deckType === DECK_TYPES.ANGEL) {
      return `/images/cartas_angeles/${number}.jpg`;
    } else if (deckType === DECK_TYPES.FENESTRA) {
      return `/images/tarot_fenetra/${number}.webp`;
    } else if (deckType === DECK_TYPES.SYMBOLON) {
      return `/images/symbolon/${number}.jpg`;
    }
    return `/images/arcana_egipcio_kier/${number}.jpg`;
  };

  // Obtener la palabra clave de la carta
  const getCardKeyword = (carta, orientation) => {
    return orientation === 'd' ? carta.palabras_clave : carta.palabras_clave_al_reves;
  };

  // Obtener el título de la carta
  const getCardTitle = (carta, deckType) => {
    if (deckType === DECK_TYPES.EGYPTIAN) {
      return carta.nombre;
    } else if (deckType === DECK_TYPES.RIDER_WAITE) {
      const tarotCard = riderData.find(card => card.numero === carta.numero);
      return tarotCard?.titulo || carta.nombre;
    } else if (deckType === DECK_TYPES.SPANISH) {
      return carta.titulo || carta.nombre;
    } else if (deckType === DECK_TYPES.ANGEL) {
      const angelCard = angelData.find(card => card.numero === carta.numero);
      return angelCard?.titulo || carta.nombre;
    } else if (deckType === DECK_TYPES.SYMBOLON) {
      const symbolonCard = symbolonCartasData.find(card => card.numero === carta.numero);
      return symbolonCard?.titulo || carta.nombre;
    }
    return carta.nombre;
  };

  // Obtener el significado de la carta
  const getCardMeaning = (carta, orientation, deckType) => {
    if (deckType === DECK_TYPES.EGYPTIAN) {
      return orientation === 'd' 
        ? carta.significado?.derecho || 'No hay significado disponible.'
        : carta.significado?.reves || 'No hay significado disponible para esta posición.';
    } else if (deckType === DECK_TYPES.ANGEL) {
      const angelCard = angelData.find(card => card.numero === carta.numero);
      return orientation === 'd' 
        ? angelCard?.significado || 'No hay significado disponible.'
        : angelCard?.invertido || 'No hay significado disponible para esta posición.';
    } else if (deckType === DECK_TYPES.SYMBOLON) {
      const symbolonCard = symbolonCartasData.find(card => card.numero === carta.numero);
      return orientation === 'd' 
        ? `${symbolonCard.como_resultado}` || 'No hay significado disponible.'
        : `${symbolonCard?.como_problema}` || 'No hay significado disponible para esta posición.';
    } else if (deckType === DECK_TYPES.RIDER_WAITE || deckType === DECK_TYPES.FENESTRA) {
      const tarotCard = riderData.find(card => card.numero === carta.numero);
      if (tarotCard) {
        if (orientation === 'd') {
          const palabrasClave = tarotCard.palabras_clave || '';
          const descripcion = tarotCard.descripcion || '';
          return palabrasClave ? `${palabrasClave}\n\n${descripcion}` : descripcion;
        } else {
          if (tarotCard.invertida) {
            const palabrasClaveInv = tarotCard.invertida.palabras_clave || '';
            const significadoInv = tarotCard.invertida.significado || 'Significado invertido - Consulte literatura especializada';
            return palabrasClaveInv ? `${palabrasClaveInv}\n\n${significadoInv}` : significadoInv;
          }
          return 'Significado invertido - Consulte literatura especializada';
        }
      }
      return 'Significado no disponible para esta carta en el mazo seleccionado.';
    } else if (deckType === DECK_TYPES.SPANISH) {
      if (orientation === 'd') {
        return carta.spanishMeaning || 'No hay significado disponible.';
      } else {
        return carta.spanishMeaningInverted || 'Significado invertido - Consulte literatura especializada';
      }
    }
    return 'Significado no disponible para esta carta en el mazo seleccionado.';
  };

  // Obtener el arquetipo de la carta
  const getArchetipe = (carta, deckType) => {
    if (deckType === DECK_TYPES.SYMBOLON) {
      return symbolonCartasData.find(card => card.numero === carta.numero)?.arquetipo;
    }
    return '';
  };

  return (
    <CardList
      cartas={cartas}
      getFrontImageUrl={getFrontImageUrl}
      getBackImageUrl={getBackImageUrl}
      getCardKeyword={getCardKeyword}
      getCardTitle={getCardTitle}
      getCardMeaning={getCardMeaning}
      getArchetipe={getArchetipe}
    />
  );
};

export default HomePage;
