"use client"

import SiteFooter from '@/components/Footer'
import NavBar from '@/components/NavBar'
import ProductShowcase from '@/components/Productshowcasewith1product'
import React, { useEffect, useState } from 'react'


const page = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Only prompt if not authenticated
    if (!authenticated) {
      const username = window.prompt('Enter username:');
      const password = window.prompt('Enter password:');
      if (username === 'admin' && password === 'll@123') {
        setAuthenticated(true);
      } else {
        window.alert('Unauthorized. You will be redirected.');
        window.location.href = '/';
      }
    }
    // eslint-disable-next-line
  }, []);

  if (!authenticated) {
    return null;
  }

  return (
    <div>
      <NavBar />
      <ProductShowcase />
      <SiteFooter />
    </div>
  );
}

export default page
