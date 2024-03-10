import React, { useEffect, useState } from "react";

export default function Shop() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800"></div>
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

  const handleAddToCart = (productId) => {
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
        alert("Product added to cart!");
        // Here, you might want to trigger a re-fetch of the cart items or update a global state/context if you have one
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
        alert("Failed to add product to cart.");
      });
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Formations vidéos Primavera P6
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {videos.map((video) => (
            <div key={video.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={`/videos/${video.id}`}>
                      {" "}
                      <span aria-hidden="true" className="absolute inset-0" />
                      {video.title}
                    </a>
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(video.price)}
                </p>
              </div>
              <div className="mt-6 flex justify-around items-center">
                <button
                  onClick={() => handleAddToCart(video.id)}
                  className="relative cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                >
                  Ajouter au panier
                  <span className="sr-only">, {video.title}</span>
                </button>
                <a
                  href={video.buyNowHref}
                  className="relative cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
                >
                  Acheter<span className="sr-only">, {video.name}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
