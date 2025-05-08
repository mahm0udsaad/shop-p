export function convertFormToLandingPageData(productData: any) {
  // Convert features and benefits from string to array
  const features = productData.features ? productData.features.split("\n").filter(Boolean) : []

  const benefits = productData.benefits ? productData.benefits.split("\n").filter(Boolean) : []

  return {
    product: {
      name: productData.name || "",
      tagline: productData.tagline || "",
      description: productData.description || "",
      features,
      benefits,
      price: {
        currency: productData.price?.currency || "USD",
        monthly: productData.price?.monthly || null,
        yearly: productData.price?.yearly || null,
        discountNote: productData.price?.discountNote || "",
      },
      media: {
        images: (productData.media?.images || []).map((img: any) => img.src || img),
        video: productData.media?.video || "",
      },
      testimonials: productData.testimonials || [],
      callToAction: {
        text: productData.callToAction?.text || "Buy Now",
        url: productData.callToAction?.url || "#",
      },
      faq: productData.faq || [],
    },
    brand: {
      name: productData.brand?.name || "",
      logo: productData.brand?.logo || "",
      contactEmail: productData.brand?.contactEmail || "",
      socialLinks: {
        twitter: productData.brand?.socialLinks?.twitter || "",
        linkedin: productData.brand?.socialLinks?.linkedin || "",
        facebook: productData.brand?.socialLinks?.facebook || "",
      },
    },
    seo: {
      title: productData.seo?.title || "",
      description: productData.seo?.description || "",
      keywords: productData.seo?.keywords || [],
      image: productData.seo?.image || "",
    },
    theme: {
      primaryColor: productData.colors?.[0] || "#000000",
      secondaryColor: productData.colors?.[1] || "#ffffff",
    },
  }
}
