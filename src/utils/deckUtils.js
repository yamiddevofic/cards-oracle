import riderData from '../rider.json';
import angelData from '../angel_data.json';
import symbolonCartasData from '../symbolon_cartas_reducido.json';

export const DECK_TYPES = {
  EGYPTIAN: 'egipcio',
  RIDER_WAITE: 'rider-waite',
  SPANISH: 'baraja-espanola',
  ANGEL: 'angel',
  FENESTRA: 'fenestra',
  SYMBOLON: 'symbolon'
};

export const getFrontImageUrl = (number, deckType) => {
  if (deckType === DECK_TYPES.SPANISH) {
    return `/images/baraja_espanola/${number}.jpg`;
  }
  return `/images/baraja_span/${number}.jpg`;
};

export const getBackImageUrl = (number, deckType) => {
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

export const getCardTitleByDeck = (carta, selectedDeck) => {
  if (selectedDeck === DECK_TYPES.EGYPTIAN) {
    return carta.nombre;
  } else if (selectedDeck === DECK_TYPES.RIDER_WAITE) {
    const tarotCard = riderData.find(card => card.numero === carta.numero);
    return tarotCard?.titulo || carta.nombre;
  } else if (selectedDeck === DECK_TYPES.SPANISH) {
    return carta.titulo || carta.nombre;
  } else if (selectedDeck === DECK_TYPES.ANGEL) {
    const angelCard = angelData.find(card => card.numero === carta.numero);
    return angelCard?.titulo || carta.nombre;
  } else if (selectedDeck === DECK_TYPES.SYMBOLON) {
    const symbolonCard = symbolonCartasData.find(card => card.numero === carta.numero);
    return symbolonCard?.titulo || carta.nombre;
  }
  return carta.nombre;
};

export const getCardMeaningByDeck = (carta, orientation, selectedDeck) => {
  if (selectedDeck === DECK_TYPES.EGYPTIAN) {
    return orientation === 'd' 
      ? carta.significado?.derecho || 'No hay significado disponible.'
      : carta.significado?.reves || 'No hay significado disponible para esta posición.';
  } else if (selectedDeck === DECK_TYPES.ANGEL) {
    const angelCard = angelData.find(card => card.numero === carta.numero);
    return orientation === 'd' 
      ? angelCard?.significado || 'No hay significado disponible.'
      : angelCard?.invertido || 'No hay significado disponible para esta posición.';
  } else if (selectedDeck === DECK_TYPES.SYMBOLON) {
    const symbolonCard = symbolonCartasData.find(card => card.numero === carta.numero);
    return orientation === 'd' 
      ? `${symbolonCard?.significados_clave}\n${symbolonCard?.como_resultado}` || 'No hay significado disponible.'
      : `${symbolonCard?.como_problema}` || 'No hay significado disponible para esta posición.';
  } else if (selectedDeck === DECK_TYPES.RIDER_WAITE || selectedDeck === DECK_TYPES.FENESTRA) {
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
  } else if (selectedDeck === DECK_TYPES.SPANISH) {
    if (orientation === 'd') {
      return carta.spanishMeaning || 'No hay significado disponible.';
    } else {
      return carta.spanishMeaningInverted || 'Significado invertido - Consulte literatura especializada';
    }
  }
  return 'Significado no disponible para esta carta en el mazo seleccionado.';
};

export const getArchetipeByDeck = (carta, selectedDeck) => {
  if (selectedDeck === DECK_TYPES.SYMBOLON) {
    return symbolonCartasData.find(card => card.numero === carta.numero)?.arquetipo || '';
  }
  return '';
};
