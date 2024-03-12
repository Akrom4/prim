import React, { useEffect, useState } from "react";
import CartButton from "./CartButton";

export default function Shop() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isFetchingCart, setIsFetchingCart] = useState(true);
  const [addingToCart, setAddingToCart] = useState([]);

  useEffect(() => {
    // Fetch videos
    fetch("/api/videos")
      .then((response) => response.json())
      .then((data) => {
        setVideos(data.videos || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setIsLoading(false);
      });

    // Fetch cart contents
    fetch("/api/cart")
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data.cart || []);
        setIsFetchingCart(false);
      })
      .catch((error) => {
        console.error("Error fetching cart contents:", error);
        setIsFetchingCart(false);
      });
  }, []);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handleAddToCart = (productId) => {
    setAddingToCart((prev) => [...prev, productId]);

    fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
      body: JSON.stringify({ productId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCartItems((prev) => [...prev, { ...data, id: productId }]);
        setAddingToCart((prev) => prev.filter((id) => id !== productId));
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
        setAddingToCart((prev) => prev.filter((id) => id !== productId));
      });
  };

  const isProductInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Formations vidéos Primavera P6
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {videos.map((video) => (
            <div key={video.id} className="group relative">
              <a
                href={`/videos/${video.id}`}
                className="block aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </a>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{video.title}</h3>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(video.price)}
                </p>
              </div>
              <div className="mt-6 flex justify-around items-center">
                {isFetchingCart ? (
                  <CartButton type="loading" isDisabled={true} />
                ) : addingToCart.includes(video.id) ? (
                  <CartButton type="adding" isDisabled={true}>
                    Adding...
                  </CartButton>
                ) : isProductInCart(video.id) ? (
                  <CartButton
                    type="accessCart"
                    onClick={() => (window.location.href = "/cart")}
                  >
                    Accéder au panier
                  </CartButton>
                ) : (
                  <CartButton
                    type="addToCart"
                    onClick={() => handleAddToCart(video.id)}
                  >
                    Ajouter au panier
                  </CartButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
