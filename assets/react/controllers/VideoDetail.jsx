import React, { useState, useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function VideoDetail({ videoId }) {
  const [videoProduct, setVideoProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  useEffect(() => {
    const fetchVideoProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/videos/${videoId}`);
        const data = await response.json();
        setVideoProduct(data);
      } catch (error) {
        console.error("Error fetching video product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoProduct();
  }, [videoId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!videoProduct) {
    return <div>Video product not found.</div>;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:col-span-3 lg:row-end-1">
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={videoProduct.image}
                alt={videoProduct.title}
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Product details */}
          <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-4 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {videoProduct.title}
                </h1>
              </div>
            </div>

            <p className="mt-6 text-gray-500">{videoProduct.description}</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <a
                href={videoProduct.href}
                className="relative cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >
                Ajouter au panier<span className="sr-only">, {videoProduct.name}</span>
              </a>
              <a
                href={videoProduct.buyNowHref}
                className="relative cursor-pointer	 flex items-center justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                Acheter {formatPrice(videoProduct.price)} <span className="sr-only">, {videoProduct.name}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
