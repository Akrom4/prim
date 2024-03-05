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
        console.error('Error fetching video product details:', error);
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
        {/* Product image */}
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
              <img src={videoProduct.imageName} alt={videoProduct.title} className="object-cover object-center" />
            </div>
          </div>
          {/* Product details */}
          <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{videoProduct.title}</h1>
            <p className="mt-6 text-gray-500">{videoProduct.description}</p>
            <p className="mt-4 text-lg font-medium text-gray-900">{formatPrice(videoProduct.price)}</p>
            {/* Add any additional details or actions here */}
          </div>
        </div>
      </div>
    </div>
  );
}
