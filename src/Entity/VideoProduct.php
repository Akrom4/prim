<?php

namespace App\Entity;

use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\VideoProductRepository;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Vich\UploaderBundle\Mapping\Annotation\UploadableField;

#[ORM\Entity(repositoryClass: VideoProductRepository::class)]
#[Vich\Uploadable]
class VideoProduct
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    
    private ?int $id = null;
    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function updateTimestamps(): void
    {
        if ($this->videoFile instanceof UploadedFile || $this->imageFile instanceof UploadedFile) {
            $this->updatedAt = new DateTimeImmutable('now');
        }
    }
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $price = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $videoName = null;

    #[UploadableField(mapping: 'video_product', fileNameProperty: 'videoName')]
    private ?File $videoFile = null;

    #[UploadableField(mapping: 'image_product', fileNameProperty: 'imageName')]
    private $imageFile;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $imageName;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?DateTimeImmutable $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(?string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getVideoName(): ?string
    {
        return $this->videoName;
    }

    public function setVideoName(?string $videoName): static
    {
        $this->videoName = $videoName;

        return $this;
    }
    public function setVideoFile(?File $videoFile = null): void
    {
        $this->videoFile = $videoFile;

        if (null !== $videoFile) {
            $this->updatedAt = new DateTimeImmutable();
        }
    }

    public function getVideoFile(): ?File
    {
        return $this->videoFile;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            $this->updatedAt = new DateTimeImmutable();
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageName(?string $imageName): void
    {
        $this->imageName = $imageName;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }
}
