import React from 'react';

const Card = ({
  card,
  isFlipped = false,
  isHovered = false,
  orientation = 'd',
  deckType,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
  getFrontImageUrl,
  getBackImageUrl,
  getCardKeyword,
  getCardTitle,
  getCardMeaning,
  getArchetipe,
  cardsPerRow = 5,
}) => {
  const frontImageUrl = getFrontImageUrl(card.numero, deckType);
  const backImageUrl = getBackImageUrl(card.numero, deckType);
  const keyword = getCardKeyword(card, orientation);

  return (
    <div
      className={`relative w-full aspect-[2/3] cursor-pointer group ${className}`}
      style={{ perspective: '1000px' }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-gpu ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full flex items-center justify-center p-1">
            <img 
              src={frontImageUrl} 
              alt={`Carta ${card.nombre || 'Sin nombre'}`}
              className={`w-full h-full object-contain ${orientation === 'i' ? 'rotate-180' : ''}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = backImageUrl;
              }}
            />
          </div>
          
          {/* Hover overlay for keywords (match original) */}
          <div className={`absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${isHovered && !isFlipped ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-white text-center text-xs font-bold mb-2">
              {orientation === 'i' ? '(Invertida)' : ''}
            </div>
            <div className={`text-white text-center font-medium ${cardsPerRow >= 5 ? 'text-[0.6rem]' : 'text-sm'}`}>
              
            </div>
            <div className={`text-gray-200 ${cardsPerRow >= 5 ? 'text-[0.6rem]' : 'text-sm'} overflow-auto`}>
              <h2 className={`font-bold ${cardsPerRow <= 4 ? 'text-2xl' : 'text-base'}`}>{card.numero}. {keyword}</h2>
              <p className="italic mb-2">Palabra clave: {card.spanishKeyword}</p>
              {(orientation === 'd' ? (card.spanishMeaning || 'No hay significado disponible para Baraja Española') : (card.spanishMeaningInverted || 'Significado invertido no disponible para Baraja Española')).split('\n\n').map((paragraph, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>           
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          style={{ 
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            <img 
              src={backImageUrl} 
              alt="Reverso de la carta"
              className={`w-full h-full ${(deckType === 'rider-waite' || deckType === 'egipcio' || deckType === 'symbolon' || deckType === 'angel') ? 'object-contain' : 'object-cover'} ${orientation === 'i' ? 'rotate-180' : ''}`}
            />
          </div>

          {/* Hover overlay for meaning (match original) */}
          <div className={`absolute overflow-auto inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center transition-opacity duration-300 ${isHovered && isFlipped ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full text-white text-center pt-10 py-2 px-2">
              <h3 className={`font-bold mb-2 ${cardsPerRow >= 5 ? 'text-xs font-bold' : 'text-base'}`}>
                {getCardTitle(card)} {orientation === 'i' ? '(Invertida)' : ''}
              </h3>
              {deckType === 'symbolon' && (
                <p className="text-gray-200 font-bold text-[.8rem]">{getArchetipe(card)}</p>
              )}
              <div className={`mt-2 text-gray-200 ${cardsPerRow >= 5 ? 'text-[0.6rem]' : 'text-sm'}`}>
                {getCardMeaning(card, orientation).split('\n\n').map((paragraph, i) => (
                  <p key={i} className=''>
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
};

export default Card;
