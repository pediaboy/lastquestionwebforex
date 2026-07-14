import { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import blogData from "@/data/blog.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/tentang",
    "/vip",
    "/gratis",
    "/analisa",
    "/faq",
    "/blog",
    "/kontak",
  ].map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const blogRoutes = (blogData as { slug: string }[]).map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
