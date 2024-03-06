<?php
// src/Controller/CartController.php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\VideoProduct;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\VideoProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

class CartController extends AbstractController
{
    public function __construct(private UploaderHelper $uploaderHelper)
    {
        $this->uploaderHelper = $uploaderHelper;
    }

    #[Route('/cart', name: 'cart_index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('cart/index.html.twig', []);
    }

    #[Route('/api/cart', name: 'api_cart', methods: ['GET'])]
public function getCartContents(UserInterface $user): JsonResponse
{
    $cart = $user->getCart();
    if (!$cart) {
        return $this->json(['error' => 'Cart not found.'], JsonResponse::HTTP_NOT_FOUND);
    }

    $cartItems = $cart->getCartItems();
    $cartData = [];

    foreach ($cartItems as $item) {
        $videoProduct = $item->getVideo();
        if ($videoProduct) {
            $cartData[] = [
                'id' => $videoProduct->getId(),
                'title' => $videoProduct->getTitle(),
                'price' => $videoProduct->getPrice(),
                'thumbnail' => $this->uploaderHelper->asset($videoProduct, 'imageFile'),
            ];
        }
    }
    return $this->json(['cart' => $cartData]);
}

    #[Route('/api/cart/add', name: 'api_cart_add', methods: ['POST'])]
    public function addToCart(Request $request, EntityManagerInterface $em, Security $security): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = $security->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not found'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $cart = $user->getCart();
        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $productId = $data['productId'];
        $product = $em->getRepository(VideoProduct::class)->find($productId);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Add product to cart logic
        $cartItem = new CartItem();
        $cartItem->setVideo($product);
        $cart->addCartItem($cartItem);

        $em->persist($cartItem);
        $em->flush();

        return $this->json(['message' => 'Product added to cart successfully']);
    }
}
