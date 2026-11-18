import { MetadataRoute } from "next";
import { NUMBER_ONE_YEARS } from "@/lib/number-ones";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://songdle.es";
  const currentDate = new Date();
  
  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tres-pistas`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/cinco-pistas`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/como-jugar`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/heardle-espanol`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre-songdle`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/numeros-1-los-40`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...NUMBER_ONE_YEARS.map((year) => ({
      url: `${baseUrl}/numeros-1-los-40/${year}`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}

