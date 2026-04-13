import { getAllBrands, getBrand, getBrandDesignMd, getBrandHtml } from "@/lib/brands";
import { BrandDetail } from "@/components/BrandDetail";
import { BrandHeader } from "@/components/BrandHeader";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllBrands().map((b) => ({ brand: b.slug }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const designMd = getBrandDesignMd(slug);
  const previewHtml = getBrandHtml(slug, "preview.html");
  const previewDarkHtml = getBrandHtml(slug, "preview-dark.html");

  return (
    <>
      <BrandHeader
        name={brand.name}
        description={brand.description}
        avatar={brand.avatar}
      />
      <BrandDetail
        designMd={designMd}
        previewHtml={previewHtml}
        previewDarkHtml={previewDarkHtml}
      />
    </>
  );
}
