import React from 'react';
import Select from '../../atoms/Select/Select';
import Input from '../../atoms/Input/Input';

const DECK_TYPES = {
  EGYPTIAN: 'egipcio',
  RIDER_WAITE: 'rider-waite',
  SPANISH: 'baraja-espanola',
  ANGEL: 'angel',
  FENESTRA: 'fenestra',
  SYMBOLON: 'symbolon'
};

const CardFilter = ({
  selectedDeck,
  onDeckChange,
  filtroPalo,
  onPaloChange,
  cardsPerRow,
  onCardsPerRowChange,
  busquedaNumeros,
  onBusquedaNumerosChange,
  className = '',
}) => {
  const deckOptions = [
    { value: DECK_TYPES.EGYPTIAN, label: 'Tarot Egipcio de Kier' },
    { value: DECK_TYPES.RIDER_WAITE, label: 'Tarot Rider-Waite' },
    { value: DECK_TYPES.FENESTRA, label: 'Tarot Fenestra' },
    { value: DECK_TYPES.ANGEL, label: 'Tarot de los Ángeles' },
    { value: DECK_TYPES.SYMBOLON, label: 'Tarot Symbolon' },
  ];

  const paloOptions = [
    { value: 'todos', label: 'Todos los palos' },
    { value: 'oros', label: 'Oros' },
    { value: 'copas', label: 'Copas' },
    { value: 'espadas', label: 'Espadas' },
    { value: 'bastos', label: 'Bastos' },
  ];

  const cardsPerRowOptions = [
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
  ];

  const handleDeckChange = (e) => {
    const newDeck = e.target.value;
    onDeckChange(newDeck);
    
    // Reset palo filter if changing to Rider-Waite or Spanish
    if (newDeck === DECK_TYPES.RIDER_WAITE || newDeck === DECK_TYPES.SPANISH) {
      onPaloChange({ target: { value: 'todos' } });
    }
  };

  return (
    <div className={`relative top-0 left-0 right-0 z-50 fixed m-5 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Select
            label="Seleccionar mazo:"
            name="deck"
            value={selectedDeck}
            onChange={handleDeckChange}
            options={deckOptions}
          />
        </div>
        
        <div>
          <Select
            label="Filtrar por palo:"
            name="palo"
            value={filtroPalo}
            onChange={onPaloChange}
            options={paloOptions}
          />
        </div>
        
        <div>
          <Select
            label="Cartas por fila:"
            name="cardsPerRow"
            value={cardsPerRow}
            onChange={(e) => onCardsPerRowChange(Number(e.target.value))}
            options={cardsPerRowOptions}
          />
        </div>
        
        <div>
          <Input
            label="Buscar por número (ej: 1, 2i, 3, 4i):"
            name="searchNumbers"
            value={busquedaNumeros}
            onChange={onBusquedaNumerosChange}
            placeholder="Ej: 1, 2i, 3, 4i"
          />
        </div>
      </div>
    </div>
  );
};

export default CardFilter;
