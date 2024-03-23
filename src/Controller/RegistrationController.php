<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Security\EmailVerifier;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use Symfony\Component\Mime\Address;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;

class RegistrationController extends AbstractController
{
    private EmailVerifier $emailVerifier;

    public function __construct(EmailVerifier $emailVerifier)
    {
        $this->emailVerifier = $emailVerifier;
    }

    #[Route('/register', name: 'app_register')]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): Response
    {
        
        $user = new User();
        
        $form = $this->createForm(RegistrationFormType::class, $user);
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            // encode the plain password
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );

            $entityManager->persist($user);
            $entityManager->flush();

            // generate a signed url and email it to the user
            $this->emailVerifier->sendEmailConfirmation(
                'app_verify_email',
                $user,
                (new TemplatedEmail())
                    ->from(new Address('noreply@akrom.xyz', 'noreply'))
                    ->to($user->getEmail())
                    ->subject('Please Confirm your Email')
                    ->htmlTemplate('registration/confirmation_email.html.twig')
            );
            // do anything else you need here, like send an email

            return $this->redirectToRoute('app_home');
        }
        
        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, TranslatorInterface $translator, UserRepository $userRepository): Response
    {
        $id = $request->query->get('id');

        if (null === $id) {
            return $this->redirectToRoute('app_register');
        }

        $user = $userRepository->find($id);

        if (null === $user) {
            return $this->redirectToRoute('app_register');
        }

        // validate email confirmation link, sets User::isVerified=true and persists
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $translator->trans($exception->getReason(), [], 'VerifyEmailBundle'));

            return $this->redirectToRoute('app_register');
        }

        // @TODO Change the redirect on success and handle or remove the flash message in your templates
        $this->addFlash('success', 'Your email address has been verified.');

        return $this->redirectToRoute('app_home');
    }

    #[Route('/resend-verification-email', name: 'resend_verification_email')]
    public function resendVerificationEmail(Request $request, CsrfTokenManagerInterface $csrfTokenManager): JsonResponse
    {
        $token = new CsrfToken('resend_verification_email', $request->headers->get('X-CSRF-TOKEN'));
        if (!$csrfTokenManager->isTokenValid($token)) {
            return new JsonResponse(['error' => 'Invalid CSRF token.'], Response::HTTP_FORBIDDEN);
        }

        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'You must be logged in to resend the verification email.'], Response::HTTP_UNAUTHORIZED);
        }

        if ($user->isVerified()) {
            return new JsonResponse(['notice' => 'Your email is already verified.'], Response::HTTP_BAD_REQUEST);
        }

        $cache = new FilesystemAdapter();
        $cacheKey = sprintf('resend_verification_email_%s', $user->getId());
        $rateLimit = 300; // seconds

        // Attempt to retrieve the cache item
        $cacheItem = $cache->getItem($cacheKey);
        if ($cacheItem->isHit() && (time() - $cacheItem->get()) < $rateLimit) {
            // If the cache item exists and the current time is within the rate limit window, prevent resending
            return new JsonResponse(['error' => 'Please wait before resending the verification email.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        // If the rate limit has passed or the cache item doesn't exist, proceed with sending the email
        $this->emailVerifier->sendEmailConfirmation(
            'app_verify_email',
            $user,
            (new TemplatedEmail())
                ->from(new Address('noreply@akrom.xyz', 'noreply'))
                ->to($user->getEmail())
                ->subject('Please Confirm your Email')
                ->htmlTemplate('registration/confirmation_email.html.twig')
        );

        // Update the cache with the current time as the last email sent timestamp
        $cacheItem->set(time());
        $cache->save($cacheItem);

        return new JsonResponse(['success' => 'Verification email resent. Please check your inbox.']);
    }



    #[Route('/email-not-verified', name: 'app_email_not_verified')]
    public function emailNotVerified(): Response
    {
        // Render the email_not_verified.html.twig template
        return $this->render('registration/email_not_verified.html.twig');
    }
}
