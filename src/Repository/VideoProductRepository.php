<?php

namespace App\Repository;

use App\Entity\VideoProduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VideoProduct>
 *
 * @method VideoProduct|null find($id, $lockMode = null, $lockVersion = null)
 * @method VideoProduct|null findOneBy(array $criteria, array $orderBy = null)
 * @method VideoProduct[]    findAll()
 * @method VideoProduct[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VideoProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VideoProduct::class);
    }

    //    /**
    //     * @return VideoProduct[] Returns an array of VideoProduct objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('v.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?VideoProduct
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
