<?php

namespace App\Controller\Admin;

use App\Entity\VideoProduct;
use Vich\UploaderBundle\Form\Type\VichFileType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\Field;
use Vich\UploaderBundle\Form\Type\VichImageType;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class VideoProductCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return VideoProduct::class;
    }

    public function configureFields(string $pageName): iterable
    {
        $fields = [
            IdField::new('id')->hideOnForm(),
            TextField::new('title'),
            TextareaField::new('description'),
            MoneyField::new('price')->setCurrency('USD'),
        ];

        // Conditionally add fields based on the page
        if (Crud::PAGE_EDIT === $pageName || Crud::PAGE_NEW === $pageName) {
            $fields[] = Field::new('imageFile')
                ->setFormType(VichImageType::class)
                ->onlyOnForms(); // Show this field only on forms

            $fields[] = Field::new('videoFile')
                ->setFormType(VichFileType::class)
                ->onlyOnForms(); // Show this field only on forms
        } else {
            $fields[] = ImageField::new('imageName')
                ->setBasePath('/uploads/images')
                ->setLabel('Image')
                ->onlyOnIndex();

            $fields[] = ImageField::new('videoName')
                ->setBasePath('/uploads/videos')
                ->setLabel('Video')
                ->hideOnIndex();
        }

        return $fields;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Video Product')
            ->setEntityLabelInPlural('Video Products')
            ->setSearchFields(['title', 'description', 'price', 'videoName'])
            ->setDefaultSort(['id' => 'DESC']);
    }
}
