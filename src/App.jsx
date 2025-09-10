import React from 'react';
import CartasList from './components/CartasList';

function App() {
  return (
    <div className="App bg-[url('/images/night.gif')] bg-cover bg-center attach: fixed w-full text-white h-[100%] w-[100] min-h-screen overflow-auto" style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <CartasList />
    </div>
  );
}

export default App;
