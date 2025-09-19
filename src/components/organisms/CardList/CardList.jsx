import React, { useState } from 'react';
import CardFilter from '../../molecules/CardFilter/CardFilter';
import CardGrid from '../../molecules/CardGrid/CardGrid';

const DECK_TYPES = {
  EGYPTIAN: 'egipcio',
  RIDER_WAITE: 'rider-waite',
  SPANISH: 'baraja-espanola',
  ANGEL: 'angel',
  FENESTRA: 'fenestra',
  SYMBOLON: 'symbolon'
};

const CardList = ({
  cartas = [],
  getFrontImageUrl,
  getBackImageUrl,
  getCardKeyword,
  getCardTitle,
  getCardMeaning,
  getArchetipe,
  className = '',
}) => {
  const [filtroPalo, setFiltroPalo] = useState('todos');
  const [busquedaNumeros, setBusquedaNumeros] = useState('');
  const [flippedCards, setFlippedCards] = useState([]);
  const [cardsPerRow, setCardsPerRow] = useState(5);
  const [selectedDeck, setSelectedDeck] = useState(DECK_TYPES.EGYPTIAN);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Function to get filtered cards based on search and filters
  const getFilteredCards = () => {
    // Get cards by number search first
    let filtered = obtenerCartasPorNumero();
    
    // Filter by palo if needed
    if (filtroPalo !== 'todos') {
      filtered = filtered.filter(carta => 
        carta.carta?.palo === filtroPalo
      );
    }
    
    return filtered;
  };

  // Function to get cards by number search
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

  // Handle card click to flip
  const handleCardClick = (index) => {
    setFlippedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) // Remove if already flipped
        : [...prev, index] // Add if not flipped
    );
  };

  // Handle palo filter change
  const handlePaloChange = (e) => {
    setFiltroPalo(e.target.value);
  };

  // Handle number search change
  const handleBusquedaNumerosChange = (e) => {
    setBusquedaNumeros(e.target.value);
  };

  // Handle cards per row change
  const handleCardsPerRowChange = (value) => {
    setCardsPerRow(value);
  };

  // Handle deck change
  const handleDeckChange = (newDeck) => {
    setSelectedDeck(newDeck);
    // Reset flipped cards when deck changes
    setFlippedCards([]);
  };

  // Get filtered cards
  const filteredCards = getFilteredCards();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <h1 className="text-gray-800 dark:text-white text-center mb-8 text-2xl lg:text-5xl font-light tracking-wider" style={{ fontFamily: 'Edu NSW ACT Cursive, sans-serif' }}>
          Oráculo de Cartas
        </h1>

        {/* Card Filter Component */}
        <CardFilter
          selectedDeck={selectedDeck}
          onDeckChange={handleDeckChange}
          filtroPalo={filtroPalo}
          onPaloChange={handlePaloChange}
          cardsPerRow={cardsPerRow}
          onCardsPerRowChange={handleCardsPerRowChange}
          busquedaNumeros={busquedaNumeros}
          onBusquedaNumerosChange={handleBusquedaNumerosChange}
        />

        {/* Card Grid Component */}
        <div className="pt-24">
          <CardGrid
            cards={filteredCards}
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
      </div>
    </div>
  );
};

export default CardList;
