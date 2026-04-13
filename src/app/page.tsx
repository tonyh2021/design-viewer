import { getAllBrands, getCategories } from "@/lib/brands";
import { BrandIndex } from "@/components/BrandIndex";

export default function Home() {
  const brands = getAllBrands();
  const categories = getCategories(brands);

  return <BrandIndex brands={brands} categories={categories} />;
}
