import { Gallery } from "@/components/Gallery";
import { metadata, countByCategory } from "@/lib/icons";

export default function Home() {
  return <Gallery icons={metadata} counts={countByCategory()} />;
}
