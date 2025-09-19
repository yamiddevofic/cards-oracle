import React, { useEffect, useState } from 'react';
import cartasData from '../cartas.json';
import riderData from '../rider.json';
import barajaEspanolaData from '../baraja_espanola_data.json';
import angelData from '../angel_data.json';
import symbolonCartasData from '../symbolon_cartas_reducido.json';
import CardFilter from './molecules/CardFilter/CardFilter';
import CardGrid from './molecules/CardGrid/CardGrid';

// Deck types
const DECK_TYPES = {
  EGYPTIAN: 'egipcio',
  RIDER_WAITE: 'rider-waite',
  SPANISH: 'baraja-espanola',
  ANGEL: 'angel',
  FENESTRA: 'fenestra',
  SYMBOLON: 'symbolon'
};

// Obtener la URL de la imagen del frente de la carta (baraja española)
const getFrontImageUrl = (number, deckType) => {
  if (deckType === DECK_TYPES.SPANISH) {
    return `/images/baraja_espanola/${number}.jpg`;
  }
  return `/images/baraja_span/${number}.jpg`;
};

// Obtener la URL de la imagen del reverso de la carta según el mazo seleccionado
const getCardKeyword = (carta, orientation) => {
  return orientation === 'd' ? carta.palabras_clave : carta.palabras_clave_al_reves;
};

const getBackImageUrl = (number, deckType) => {
  if (deckType === DECK_TYPES.RIDER_WAITE) {
    return `/images/tarot-rider-waite/${number}.png`;
  } else if (deckType === DECK_TYPES.ANGEL) {
    return `/images/cartas_angeles/${number}.jpg`;
  } else if (deckType === DECK_TYPES.FENESTRA) {
    return `/images/tarot_fenetra/${number}.webp`; // Imagen de carta de Fenestra
  } else if (deckType === DECK_TYPES.SYMBOLON) {
    return `/images/symbolon/${number}.jpg`;
  }
  // Default to Egyptian deck
  return `/images/arcana_egipcio_kier/${number}.jpg`;
};

const CartasList = () => {
  const [cartas, setCartas] = useState([]);
  const [filtroPalo, setFiltroPalo] = useState('todos');
  const [busquedaNumeros, setBusquedaNumeros] = useState('');
  const [flippedCards, setFlippedCards] = useState([]);
  const [cardsPerRow, setCardsPerRow] = useState(7);
  const [selectedDeck, setSelectedDeck] = useState(DECK_TYPES.EGYPTIAN);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Grid configuration based on cards per row
  const getGridClass = () => {
    const gridClasses = {
      3: 'grid-cols-2 md:grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
      7: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7',
      8: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
    };
    
    return gridClasses[cardsPerRow] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };
  
  // Function to handle card click
  const handleCardClick = (index) => {
    setFlippedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) // Remove if already flipped
        : [...prev, index] // Add if not flipped
    );
  };

  useEffect(() => {
    if (cartasData && cartasData.cartas_oraculo) {
      const valueToNumberMap = {
        'as': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
        'seis': 6, 'siete': 7, 'sota': 10, 'caballero': 11, 'rey': 12
      };

      // Crear un mapa para una búsqueda rápida de cartas de baraja española
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

  // Función para obtener cartas según los números ingresados
  const obtenerCartasPorNumero = () => {
    if (!busquedaNumeros.trim()) {
      // Return a single copy of each card with default orientation 'd'
      return [...cartas].map(carta => ({ ...carta, orientacion: 'd' }));
    }

    const entradas = busquedaNumeros
      .split(',')
      .map((entrada) => entrada.trim().toLowerCase())
      .filter((entrada) => entrada !== '');

    const resultado = entradas
      .map((entrada) => {
        const numero = parseInt(entrada.replace(/[di]/, '').trim());
        const orientacion = entrada.includes('i') ? 'i' : 'd';
        const carta = cartas.find((c) => c.numero === numero);
        return carta ? { ...carta, orientacion } : null;
      })
      .filter((carta) => carta !== null);

    return resultado;
  };

  // Función para obtener el título de la carta según el mazo seleccionado
  const getCardTitle = (carta) => {
    if (selectedDeck === DECK_TYPES.EGYPTIAN) {
      return carta.nombre;
    } else if (selectedDeck === DECK_TYPES.RIDER_WAITE) {
      // For Rider-Waite deck, use the title from rider.json
      if (riderData && Array.isArray(riderData)) {
        const tarotCard = riderData.find(card => card.numero === carta.numero);
        return tarotCard?.titulo || carta.nombre;
      }
      return carta.nombre;
    } else if (selectedDeck === DECK_TYPES.SPANISH) {
      // For Spanish deck, use the title from baraja_espanola_data.json (which is already mapped to carta.titulo)
      return carta.titulo || carta.nombre;
    } else if (selectedDeck === DECK_TYPES.ANGEL) {
      const angelCard = angelData.find(card => card.numero === carta.numero);
      return angelCard?.titulo || carta.nombre;
    } else if (selectedDeck === DECK_TYPES.SYMBOLON) {
      const symbolonCard = symbolonCartasData.find(card => card.numero === carta.numero);
      return symbolonCard?.titulo || carta.nombre;
    }
    return carta.nombre; // Fallback
  };

  // Función para obtener el significado de la carta según el mazo seleccionado
  const getCardMeaning = (carta, orientation) => {
    if (selectedDeck === DECK_TYPES.EGYPTIAN) {
      // Para el mazo egipcio, siempre usamos el significado de cartas.json
      return orientation === 'd' 
        ? carta.significado?.derecho || 'No hay significado disponible.'
        : carta.significado?.reves || 'No hay significado disponible para esta posición.';
    } else if (selectedDeck === DECK_TYPES.ANGEL) {
      // For Angel deck, use the data from angel_data.json
      const angelCard = angelData.find(card => card.numero === carta.numero);
      return orientation === 'd' 
        ? angelCard?.significado || 'No hay significado disponible.'
        : angelCard?.invertido || 'No hay significado disponible para esta posición.';
    } else if (selectedDeck === DECK_TYPES.SYMBOLON) {
      const symbolonCard = symbolonCartasData.find(card => card.numero === carta.numero);
      return orientation === 'd' 
        ? `Significado clave: ${symbolonCard.significados_clave}\nComo resultado: ${symbolonCard.como_resultado}` || 'No hay significado disponible.'
        : `Como problema: ${symbolonCard.como_problema}\nComo forma de solucionar problema: ${symbolonCard.como_forma_de_solucionar_problema}` || 'No hay significado disponible para esta posición.';
    } else if (selectedDeck === DECK_TYPES.RIDER_WAITE || selectedDeck === DECK_TYPES.FENESTRA) { // Aplicar lógica Rider-Waite a Fenestra
      // For Rider-Waite deck, use the data from rider.json
      if (riderData && Array.isArray(riderData)) {
        const tarotCard = riderData.find(card => card.numero === carta.numero);
        
        if (tarotCard) {
          if (orientation === 'd') {
            const palabrasClave = tarotCard.palabras_clave || '';
            const descripcion = tarotCard.descripcion || '';
            return palabrasClave ? `${palabrasClave}\n\n${descripcion}` : descripcion;
          } else {
            // Return reversed meaning if available
            if (tarotCard.invertida) {
              const palabrasClaveInv = tarotCard.invertida.palabras_clave || '';
              const significadoInv = tarotCard.invertida.significado || 'Significado invertido - Consulte literatura especializada';
              return palabrasClaveInv ? `${palabrasClaveInv}\n\n${significadoInv}` : significadoInv;
            }
            return 'Significado invertido - Consulte literatura especializada';
          }
        }
      }
      
      return 'Significado no disponible para esta carta en el mazo seleccionado.';
    } else if (selectedDeck === DECK_TYPES.SPANISH) {
      // For Spanish deck, directly use the pre-processed spanishMeaning and spanishMeaningInverted
      if (orientation === 'd') {
        return carta.spanishMeaning || 'No hay significado disponible.';
      } else {
        return carta.spanishMeaningInverted || 'Significado invertido - Consulte literatura especializada';
      }
    }
    // Fallback for any unhandled deck types (though ideally all should be handled)
    return 'Significado no disponible para esta carta en el mazo seleccionado.';
  };

  const getArchetipe = (carta) => {
    if (selectedDeck === DECK_TYPES.SYMBOLON) {
      return symbolonCartasData.find(card => card.numero === carta.numero)?.arquetipo;
    }
    return '';
  };


  // Filtrar por texto y palo
  const cartasFiltradas = obtenerCartasPorNumero()
    .filter((carta, index, self) => {
      // Remove duplicates by checking if we've seen this card number before
      const isFirstOccurrence = index === self.findIndex(c => c.numero === carta.numero);
      return isFirstOccurrence;
    })
    .filter((carta) => {
      if (!busquedaNumeros.trim()) {
        carta.orientacion = 'd';
      }
      
      // Check if carta.carta exists and has palo property
      const cartaPalo = carta.carta?.palo || '';
      // Only apply palo filter if deck is Egyptian or Spanish
      const coincidePalo = (filtroPalo === 'todos') || (cartaPalo === filtroPalo);
      
      return coincidePalo;
    });

  return (
    <div className="min-h-screen bg-hidden bg-hidden">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <h1 className="text-gray-800 dark:text-white text-center mb-8 text-2xl lg:text-5xl font-light tracking-wider" style={{ fontFamily: 'Edu NSW ACT Cursive, sans-serif' }}>
          Oráculo de Cartas
        </h1>

        {/* Filtros */}
        <CardFilter
          selectedDeck={selectedDeck}
          onDeckChange={(newDeck) => {
            // CardFilter passes event or value depending on usage; normalize here
            const value = typeof newDeck === 'string' ? newDeck : newDeck?.target?.value;
            if (!value) return;
            setSelectedDeck(value);
            if (value === DECK_TYPES.RIDER_WAITE || value === DECK_TYPES.SPANISH) {
              setFiltroPalo('todos');
            }
          }}
          filtroPalo={filtroPalo}
          onPaloChange={(e) => setFiltroPalo(e.target.value)}
          cardsPerRow={cardsPerRow}
          onCardsPerRowChange={(val) => setCardsPerRow(Number(val))}
          busquedaNumeros={busquedaNumeros}
          onBusquedaNumerosChange={(e) => setBusquedaNumeros(e.target.value)}
        />

        {/* Lista de Cartas */}
        <div className="pt-10">
          <CardGrid
            cards={cartasFiltradas}
            flippedCards={flippedCards}
            hoveredCard={hoveredCard}
            cardsPerRow={cardsPerRow}
            deckType={selectedDeck}
            onCardClick={handleCardClick}
            onCardHover={setHoveredCard}
            getFrontImageUrl={getFrontImageUrl}
            getBackImageUrl={getBackImageUrl}
            getCardKeyword={getCardKeyword}
            getCardTitle={getCardTitle}
            getCardMeaning={getCardMeaning}
            getArchetipe={getArchetipe}
          />
        </div>
        
        {cartasFiltradas.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-300 py-16 px-6 bg-white dark:bg-gray-800 rounded-xl mt-8 shadow-sm">
            <div className="text-5xl mb-4">🔮</div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron cartas</h3>
            <p className="text-gray-500 dark:text-gray-400">Intenta ajustar los filtros de búsqueda.</p>
          </div>
        )}
      </div>

      <style jsx>
        {`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        /* Custom Scrollbar for Meaning */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CartasList;