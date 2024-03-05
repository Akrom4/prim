import React, { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";

import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Vidéos", href: "/videos" },
  { name: "Formations", href: "#" },
  { name: "Blog", href: "#" },
  { name: "À Propos", href: "#" },
];

const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ isLoggedIn, isEmailVerified }) {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  useEffect(() => {
    let timeoutId;

    if (feedbackMessage) {
      timeoutId = setTimeout(() => {
        setFeedbackMessage("");
        setFeedbackType("");
      }, 5000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [feedbackMessage]);

  const resendVerificationEmail = async () => {
    try {
      const response = await fetch("/resend-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Network response was not ok");
      }

      // Handle success
      setFeedbackMessage(
        data.success || "Verification email resent. Please check your inbox."
      );
      setFeedbackType("success");
    } catch (error) {
      // Handle error
      console.error("Error resending verification email:", error);
      setFeedbackMessage(
        error.message ||
          "An error occurred while resending the verification email."
      );
      setFeedbackType("error");
    }
    setTimeout(() => {
      setFeedbackMessage("");
      setFeedbackType("");
    }, 5000);
  };

  return (
    <Disclosure as="nav" className="bg-red-700">
      {({ open }) => (
        <>
          {/* Email validation bar */}
          {isLoggedIn && !isEmailVerified && (
            <div className="bg-yellow-500 text-black text-center p-2 flex flex-col items-center justify-center">
              <div>
                <span>Veuillez confirmer votre email.</span>
                <a
                  href="#"
                  id="resend-verification-link"
                  className="text-sm text-blue-600 hover:text-blue-800 underline ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    resendVerificationEmail();
                  }}
                >
                  Renvoyer un email
                </a>
              </div>
              {feedbackMessage && (
                <div
                  className={`mt-2 text-sm ${
                    feedbackType === "success"
                      ? "text-blue-500"
                      : "text-red-500"
                  }`}
                >
                  {feedbackMessage}
                </div>
              )}
            </div>
          )}
          {/* Navbar */}
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-red-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
                <div className="flex flex-shrink-0 items-center">
                  <a href="/home">
                    <img
                      className="h-8 w-auto"
                      src="https://prominos.fr/wp-content/uploads/2022/02/cropped-element-1-e1645303835963.png"
                      alt="Formation Primavera P6"
                    />
                  </a>
                </div>
                <div className="hidden ml-10 sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-red-950 text-white"
                            : "text-white hover:bg-red-800 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-2 sm:pr-2">
                {/* Shopping Cart Icon */}
                <div className="mr-1 sm:mr-4">
                  <a
                    href="#"
                    className="flex items-center text-white hover:bg-red-800 rounded-full p-1"
                  >
                    <ShoppingCartIcon className="h-8 w-8" aria-hidden="true" />
                  </a>
                </div>
                {/* Profile dropdown */}
                {isLoggedIn ? (
                  <Menu as="div" className="relative ml-1 sm:ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-red-800 text-sm">
                        <span className="sr-only">Open user menu</span>
                        <UserIcon
                          className="h-8 w-8 text-white bg-red-700 rounded-full hover:bg-red-800 hover:text-white"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-red-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Profil
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-red-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Vos vidéos
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/logout"
                              className={classNames(
                                active ? "bg-red-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Se déconnecter
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <>
                    <div>
                      <a
                        href="/login"
                        className="flex items-center text-white hover:bg-red-800 rounded-md px-3 py-2 text-sm font-medium group"
                      >
                        <UserIcon
                          className="h-8 w-8 bg-red-700 rounded-full p-1 group-hover:bg-red-800"
                          aria-hidden="true"
                        />
                        <span className="ml-2">Se connecter</span>
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
              </div>
              
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-red-900 text-white"
                      : "text-gray-300 hover:bg-red-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
