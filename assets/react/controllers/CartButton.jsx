import React from 'react';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';

const CartButton = ({ type, onClick, isDisabled, children }) => {
  let buttonClass = '';
  let icon = null;

  switch (type) {
    case 'loading':
      buttonClass = 'flex items-center justify-center rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-white';
      children = 'Chargement...';
      break;
    case 'addToCart':
      buttonClass = 'flex items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800';
      icon = <ShoppingCartIcon className="h-6 w-6 mr-3" aria-hidden="true" />;
      break;
    case 'accessCart':
      buttonClass = 'flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600';
      icon = <CheckIcon className="h-6 w-6 mr-3" aria-hidden="true" />;
      children = 'Accéder au panier';
      break;
    default:
      buttonClass = 'flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white';
  }

  return (
    <button onClick={onClick} disabled={isDisabled} className={buttonClass}>
      {icon}
      {children}
    </button>
  );
};

export default CartButton;