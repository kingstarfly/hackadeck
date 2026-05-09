import { EventGalleryWall } from "@/components/gallery/event-gallery-wall";

type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;

  return <EventGalleryWall slug={slug} />;
}
