<?php

namespace App\Service;

use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\User;
use App\Entity\VideoProduct;
use Doctrine\ORM\EntityManagerInterface;

class CartService
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function getCart(User $user): Cart
    {
        $cart = $this->entityManager->getRepository(Cart::class)->findOneBy(['user' => $user]);

        if (!$cart) {
            $cart = new Cart();
            $cart->setUser($user);
            $this->entityManager->persist($cart);
            $this->entityManager->flush();
        }

        return $cart;
    }

    public function addVideoToCart(VideoProduct $video, User $user): void
    {
        $cart = $this->getCart($user);
        $cartItem = $this->entityManager->getRepository(CartItem::class)->findOneBy(['cart' => $cart, 'video' => $video]);

        if (!$cartItem) {
            $cartItem = new CartItem();
            $cartItem->setCart($cart);
            $cartItem->setVideo($video);
            $this->entityManager->persist($cartItem);
        }

        $this->entityManager->flush();
    }

    public function removeVideoFromCart(VideoProduct $video, User $user): void
    {
        $cart = $this->getCart($user);
        $cartItem = $this->entityManager->getRepository(CartItem::class)->findOneBy(['cart' => $cart, 'video' => $video]);

        if ($cartItem) {
            $this->entityManager->remove($cartItem);
            $this->entityManager->flush();
        }
    }

    public function clearCart(User $user): void
    {
        $cart = $this->getCart($user);
        foreach ($cart->getCartItems() as $item) {
            $this->entityManager->remove($item);
        }
        $this->entityManager->flush();
    }

    public function getCartItems(User $user): array
    {
        $cart = $this->getCart($user);
        return $cart->getCartItems()->toArray();
    }
}
