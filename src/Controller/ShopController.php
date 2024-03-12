<?php // src/Controller/ShopController.php

namespace App\Controller;

use App\Entity\VideoProduct;
use App\Repository\VideoProductRepository;
use Doctrine\ORM\Mapping\Id;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


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
                'price' => $video->getPriceDisplay(),
                'description' => $video->getDescription(),
                'thumbnail' => $this->uploaderHelper->asset($video, 'imageFile'),
            ];
        }, $videos);

        return $this->json(['videos' => $data]);
    }

    #[Route('/videos', name: 'videos_index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('videos/index.html.twig', []);
    }

    #[Route('/videos/{id}', name: 'video_detail', methods: ['GET'])]
    public function detail(VideoProduct $videoProduct): Response
    {
        return $this->render('videos/detail.html.twig', [
            'videoId' => $videoProduct->getId(),
        ]);
    }

    #[Route('/api/videos/{id}', name: 'api_video_detail', methods: ['GET'])]
    public function apiVideoDetail(VideoProduct $videoProduct): JsonResponse
    {
        $videoDetail = [
            'id' => $videoProduct->getId(),
            'title' => $videoProduct->getTitle(),
            'price' => $videoProduct->getPriceDisplay(),
            'description' => $videoProduct->getDescription(),
            'image' => $this->uploaderHelper->asset($videoProduct, 'imageFile'),
        ];
        return $this->json($videoDetail);
    }
}
