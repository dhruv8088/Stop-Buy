import { Store } from '@/utils/Store';
import Head from 'next/head'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu } from '@headlessui/react';
import DropdownLink from './DropdownLink';

const Layout = ({children}) => {
    const {state,dispatch} = useContext(Store);
    const { cart } = state;
    const { status, data: session } = useSession();
    const [cartItemsCount, setCartItemsCount] = useState(0);
    useEffect(() => {
      setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
    }, [cart.cartItems]);
   
    const logoutClickHandler = () => {
      Cookies.remove('cart');
      dispatch({ type: 'CART_RESET' });
      signOut({ callbackUrl: '/login' });
    };
    
  return (
    <>
      <Head>
        <title>E-commerce website</title>
      </Head>
      <ToastContainer position="bottom-center" limit={1} />

<div className='flex min-h-screen flex-col '>
        <header>
            <nav className='flex h-12 items-center px-4 justify-end shadow-md'>
                <Link href="/" className='text-lg font-bold'>
                    STOP-Buy
                </Link>
                <Link href="/cart" className="p-2">Cart
                {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className="p-2">
                   Login
                </Link>
              )}
            </nav>
        </header>
        <main className='container a-auto mt-4 px=4'>
        {children}
        </main>
       <footer className='flex h-10 justify-center items-center shadow-inner fixed inset-x-0 bottom-0'>
        Copyright @2023 BUY-Stop
       </footer> 
       </div>
    </>
  )
}

export default Layout