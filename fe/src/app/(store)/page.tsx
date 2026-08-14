import React from 'react';
import { HeroSection } from '../../components/store/hero';
import { ShopByAge } from '../../components/store/shop-by-age';
import { ShopByCategory } from '../../components/store/shop-by-category';
import { FeaturedCollections } from '../../components/store/featured-collections';
import { ShopTheLook } from '../../components/store/shop-the-look';
import { InstagramFeed } from '../../components/store/instagram-feed';
import { BrandStory } from '../../components/store/brand-story';
import { apiFetch } from '../../lib/api';
import { Product } from '../../types';

export const revalidate = 60; // Refresh every minute

async function getProductsData() {
  try {
    const [featured, newArrivals] = await Promise.all([
      apiFetch<Product[]>('/products/featured'),
      apiFetch<Product[]>('/products/new-arrivals'),
    ]);
    return { featured: featured || [], newArrivals: newArrivals || [] };
  } catch (err) {
    console.error('Failed fetching products for homepage:', err);
    return { featured: [], newArrivals: [] };
  }
}

export default async function HomePage() {
  const { featured, newArrivals } = await getProductsData();

  return (
    <div>
      <HeroSection />
      <ShopByAge />
      <ShopByCategory />
      <FeaturedCollections featuredProducts={featured} newArrivals={newArrivals} />
      <ShopTheLook />
      <InstagramFeed />
      <BrandStory />
    </div>
  );
}
