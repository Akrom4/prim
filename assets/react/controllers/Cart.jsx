import React, { useEffect, useState } from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/20/solid";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Use an object to track updating state of individual cart items
  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    setIsLoading(true);
    fetch("/api/cart")
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data.cart || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setIsLoading(false);
      });
  };

  const removeFromCart = (productId) => {
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));
    fetch("/api/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute("content"),
      },
      body: JSON.stringify({ productId }),
    })
      .then((response) => response.json())
      .then(() => {
        setCartItems((currentItems) =>
          currentItems.filter((item) => item.id !== productId)
        );
      })
      .catch((error) => console.error("Error removing item from cart:", error))
      .finally(() => {
        setUpdatingItems((prev) => {
          const newUpdatingItems = { ...prev };
          delete newUpdatingItems[productId];
          return newUpdatingItems;
        });
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 text-center">
          <p className="text-lg leading-6 font-medium text-gray-900">
            Votre panier est vide
          </p>
          <p className="mt-2 text-base leading-6 text-gray-500">
            Il semble que vous n'ayez pas encore choisi de vidéos.
          </p>
          <a
            href="/videos"
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none"
          >
            Découvrez nos vidéos
          </a>
        </div>
      </div>
    );
  }

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const calculateTotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Votre panier
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <a
                              href={item.href}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {item.title}
                            </a>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="absolute right-0 top-0">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={updatingItems[item.id]} // Disable the button if the item is being updated
                            className="text-gray-400 hover:text-gray-500"
                          >
                            {updatingItems[item.id] ? "" : <TrashIcon className="h-5 w-5" aria-hidden="true" />}
                            
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Votre commande
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Prix total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {formatPrice(calculateTotal(cartItems))}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-red-700 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Procéder au paiement
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
