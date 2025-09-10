import React, { useEffect, useState } from 'react';
import cartasData from '../cartas.json';
import tarotDescriptions from '../tarot_descriptions.json';
import riderData from '../rider.json';
import barajaEspanolaData from '../baraja_espanola_data.json';
import angelData from '../angel_data.json';

// Deck types
const DECK_TYPES = {
  EGYPTIAN: 'egipcio',
  RIDER_WAITE: 'rider-waite',
  SPANISH: 'baraja-espanola',
  ANGEL: 'angel'
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
  } else if (deckType === DECK_TYPES.SPANISH) {
    return `/images/baraja_espanola/back.jpg`; // Placeholder for Spanish deck back image
  } else if (deckType === DECK_TYPES.ANGEL) {
    return `/images/cartas_angeles/${number}.jpg`;
  }
  // Default to Egyptian deck
  return `/images/arcana_egipcio_kier/${number}.jpg`;
};

const CartasList = () => {
  const [cartas, setCartas] = useState([]);
  const [filtroPalo, setFiltroPalo] = useState('todos');
  const [busquedaNumeros, setBusquedaNumeros] = useState('');
  const [flippedCards, setFlippedCards] = useState([]);
  const [cardsPerRow, setCardsPerRow] = useState(4);
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
      return cartas.map(carta => ({ ...carta, orientacion: 'd' }));
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
      }
      else if (selectedDeck === DECK_TYPES.RIDER_WAITE) {
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

  // Filtrar por texto y palo
  const cartasFiltradas = obtenerCartasPorNumero().filter((carta) => {
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
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Seleccionar mazo:</label>
              <select
                value={selectedDeck}
                onChange={(e) => {
                  setSelectedDeck(e.target.value);
                  // Reset palo filter if changing to Rider-Waite or Spanish
                  if (e.target.value === DECK_TYPES.RIDER_WAITE || e.target.value === DECK_TYPES.SPANISH) {
                    setFiltroPalo('todos');
                  }
                }}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value={DECK_TYPES.EGYPTIAN}>Tarot Egipcio de Kier</option>
                <option value={DECK_TYPES.RIDER_WAITE}>Tarot Rider-Waite</option>
                <option value={DECK_TYPES.ANGEL}>Tarot de los Ángeles</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Filtrar por palo:</label>
              <select
                value={filtroPalo}
                onChange={(e) => setFiltroPalo(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="todos">Todos los palos</option>
                <option value="oros">Oros</option>
                <option value="copas">Copas</option>
                <option value="espadas">Espadas</option>
                <option value="bastos">Bastos</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Cartas por fila:</label>
              <select
                value={cardsPerRow}
                onChange={(e) => setCardsPerRow(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
              </select>
            </div>
            
            
          </div>
          
          <div className="mt-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Buscar por número (ej: 1, 2i, 3, 4i):</label>
            <input
              type="text"
              value={busquedaNumeros}
              onChange={(e) => setBusquedaNumeros(e.target.value)}
              placeholder="Ej: 1, 2i, 3, 4i"
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de Cartas */}
        <div className={`grid ${getGridClass()} gap-5 lg:gap-6`}>
          {cartasFiltradas.map((carta, index) => {
            const isFlipped = flippedCards.includes(index);

            // Obtener detalles de la carta Rider-Waite si el mazo seleccionado es Rider-Waite
            let riderCardDetails = null;
            if (selectedDeck === DECK_TYPES.RIDER_WAITE) {
              riderCardDetails = riderData.find(card => card.numero === carta.numero);
            }

            return (
              <div
                key={`${carta.numero}-${index}`}
                className="relative w-full aspect-[2/3] cursor-pointer group"
                style={{
                  perspective: '1000px'
                }}
                onClick={() => handleCardClick(index)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className={`relative w-full h-full transition-transform duration-700 transform-gpu ${isFlipped ? 'rotate-y-180' : ''}`}
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Front of Card - Minimalist design */}
                  <div 
                    className="absolute w-full h-full backface-hidden rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="w-full h-full flex items-center justify-center p-1">
                      <img 
                        src={getFrontImageUrl(carta.numero, selectedDeck)} 
                        alt={`Carta ${carta.nombre || 'Sin nombre'}`}
                        className={`w-full h-full object-contain ${carta.orientacion === 'i' ? 'rotate-180' : ''}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getBackImageUrl(carta.numero, selectedDeck); // Fallback to back image if front fails
                        }}
                      />
                    </div>
                    
                    {/* Hover overlay for keywords */}
                    <div className={`absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${hoveredCard === index && !isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="text-white text-center text-xs font-bold mb-2">
                        {carta.orientacion === 'i' ? '(Invertida)' : ''}
                      </div>
                      <div className={`text-white text-center font-medium ${cardsPerRow >= 5 ? 'text-[0.6rem]' : 'text-sm'}`}>
                        
                      </div>
                      <div className={`text-gray-200 ${cardsPerRow >= 5 ? 'text-[0.6rem]' : 'text-sm'} overflow-auto`}>
                        <h2 className={`font-bold ${cardsPerRow <= 4 ? 'text-2xl' : 'text-base'}`}>{carta.numero}. {getCardKeyword(carta, carta.orientacion)}</h2>
                        <p className="italic mb-2">Palabra clave: {carta.spanishKeyword}</p>
                        {(carta.orientacion === 'd' ? (carta.spanishMeaning || 'No hay significado disponible para Baraja Española') : (carta.spanishMeaningInverted || 'Significado invertido no disponible para Baraja Española')).split('\n\n').map((paragraph, i) => (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {paragraph}
                          </p>
                        ))}
                      </div>           
                    </div>
                  </div>

                  {/* Back of Card - Matching front style */}
                  <div 
                    className="absolute w-full h-full backface-hidden rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                    style={{ 
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center p-1">
                      <img
                        src={getBackImageUrl(carta.numero, selectedDeck)}
                        alt="Reverso de la carta"
                        className={`w-full h-full ${selectedDeck === DECK_TYPES.RIDER_WAITE || selectedDeck === DECK_TYPES.EGYPTIAN ? 'object-contain' : 'object-cover'} ${carta.orientacion === 'i' ? 'rotate-180' : ''}`}
                      />
                    </div>
                    
                    {/* Hover overlay for meaning */}
                    <div className={`absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center transition-opacity duration-300 ${hoveredCard === index && isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="w-full text-white text-center py-4 px-3">
                        <h3 className={`font-bold mb-2 ${cardsPerRow >= 5 ? 'text-xs' : 'text-base'}`}>
                          {getCardTitle(carta)} {carta.orientacion === 'i' ? '(Invertida)' : ''}
                        </h3>
                        <div className={`text-gray-200 ${cardsPerRow >= 5 ? 'text-[0.6rem]' : 'text-sm'}`}>
                          {getCardMeaning(carta, carta.orientacion).split('\n\n').map((paragraph, i) => (
                            <p key={i} className={i > 0 ? 'mt-2' : ''}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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