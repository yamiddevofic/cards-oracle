import React from 'react';
import Card from '../../atoms/Card/Card';

const CardGrid = ({
  cards = [],
  flippedCards = [],
  hoveredCard = null,
  cardsPerRow = 5,
  deckType,
  onCardClick,
  onCardHover,
  getFrontImageUrl,
  getBackImageUrl,
  getCardKeyword,
  getCardTitle,
  getCardMeaning,
  getArchetipe,
  className = '',
}) => {
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

  return (
    <div className={`grid ${getGridClass()} gap-5 lg:gap-6 ${className}`}>
      {cards.map((card, index) => (
        <Card
          key={`${card.numero}-${index}`}
          card={card}
          isFlipped={flippedCards.includes(index)}
          isHovered={hoveredCard === index}
          orientation={card.orientacion || 'd'}
          deckType={deckType}
          onClick={() => onCardClick(index)}
          onMouseEnter={() => onCardHover(index)}
          onMouseLeave={() => onCardHover(null)}
          getFrontImageUrl={getFrontImageUrl}
          getBackImageUrl={getBackImageUrl}
          getCardKeyword={getCardKeyword}
          getCardTitle={getCardTitle}
          getCardMeaning={getCardMeaning}
          getArchetipe={getArchetipe}
          cardsPerRow={cardsPerRow}
        />
      ))}
    </div>
  );
};

export default CardGrid;
