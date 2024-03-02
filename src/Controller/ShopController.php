<?php // src/Controller/ShopController.php

namespace App\Controller;

use App\Repository\VideoProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;


class ShopController extends AbstractController
{
    public function __construct(private UploaderHelper $uploaderHelper)
    {
        $this->uploaderHelper = $uploaderHelper;
    }

    #[Route('/api/videos', name: 'api_videos', methods: ['GET'])]
    public function getVideos(VideoProductRepository $videoProductRepository): JsonResponse
    {
        $videos = $videoProductRepository->findAll();

        $data = array_map(function ($video) {
            return [
                'id' => $video->getId(),
                'title' => $video->getTitle(),
                'price' => $video->getPrice(),
                'description' => $video->getDescription(),
                'thumbnail' => $this->uploaderHelper->asset($video, 'imageFile'),
            ];
        }, $videos);

        return $this->json(['videos' => $data]);
    }
}
