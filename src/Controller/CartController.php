<?php
// src/Controller/CartController.php

namespace App\Controller;

use App\Entity\CartItem;
use App\Entity\VideoProduct;
use App\Service\CartService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;


class CartController extends AbstractController
{
    public function __construct(private CartService $cartService, private UploaderHelper $uploaderHelper)
    {
        $this->cartService = $cartService;
        $this->uploaderHelper = $uploaderHelper;
    }

    #[Route('/cart/add/{id}', name: 'cart_add', methods: ['POST'])]
    public function addToCart(Request $request, VideoProduct $videoProduct): JsonResponse
    {
        if (!$this->isCsrfTokenValid('add-to-cart', $request->request->get('_token'))) {
            return $this->json(['message' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
        }

        $user = $this->getUser();
        if (!$user || !$user->isVerified()) {
            return $this->json(['message' => 'This action requires a verified user.'], Response::HTTP_UNAUTHORIZED);
        }

        $this->cartService->addVideoToCart($videoProduct, $user);

        return $this->json(['message' => 'Video added to cart']);
    }

    #[Route('/cart/remove/{id}', name: 'cart_remove', methods: ['POST'])]
    public function removeFromCart(Request $request, VideoProduct $videoProduct): JsonResponse
    {
        if (!$this->isCsrfTokenValid('remove-from-cart', $request->request->get('_token'))) {
            return $this->json(['message' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
        }

        $user = $this->getUser();
        if (!$user || !$user->isVerified()) {
            return $this->json(['message' => 'This action requires a verified user.'], Response::HTTP_UNAUTHORIZED);
        }

        $this->cartService->removeVideoFromCart($videoProduct, $user);

        return $this->json(['message' => 'Video removed from cart']);
    }

    #[Route('/cart/clear', name: 'cart_clear', methods: ['POST'])]
    public function clearCart(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || !$user->isVerified()) {
            return $this->json(['message' => 'This action requires a verified user.'], Response::HTTP_UNAUTHORIZED);
        }

        $this->cartService->clearCart($user);

        return $this->json(['message' => 'Cart cleared successfully.']);
    }

    #[Route('/cart/items', name: 'cart_items', methods: ['GET'])]
    public function getCartItems(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || !$user->isVerified()) {
            return $this->json(['message' => 'This action requires a verified user.'], Response::HTTP_UNAUTHORIZED);
        }

        $cartItems = $this->cartService->getCartItems($user);

        $data = array_map(function (CartItem $cartItem) {
            $video = $cartItem->getVideo();
            return [
                'cartItemId' => $cartItem->getId(),
                'videoId' => $video->getId(),
                'title' => $video->getTitle(),
                'price' => $video->getPrice(),
                'thumbnail' => $this->uploaderHelper->asset($video, 'imageFile'),
            ];
        }, $cartItems);

        return $this->json(['items' => $data]);
    }
}
