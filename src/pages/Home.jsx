import React, { useEffect } from "react";
import useAppStore from "../store/useAppStore";
import PageLayout from "../components/layout/PageLayout";
import HorizontalCard from "../components/ui/HorizontalCard";

export default function Home() {
  const { events, isLoading, error, fetchData } = useAppStore();

  useEffect(() => {
    if (events.length === 0) {
      fetchData();
    }
  }, [fetchData, events.length]);

  const getEventDetails = (event) => {
    switch (event.type) {
      case "checkins":
        return {
          title: `Check-in: ${event.personName} @ ${event.location}`,
          description: event.note || "Ek bilgi yok",
        };
      case "messages":
        return {
          title: `Mesaj: ${event.senderName} -> ${event.recipientName}`,
          description: `"${event.text}" (Lokasyon: ${event.location})`,
        };
      case "sightings":
        return {
          title: `Gözlem: ${event.personName}, ${event.seenWith} ile görüldü`,
          description: `Lokasyon: ${event.location} | ${event.note || ""}`,
        };
      case "notes":
        return {
          title: `Kişisel Not: ${event.authorName} @ ${event.location}`,
          description: event.note || "Detay yok",
        };
      case "tips":
        return {
          title: `İhbar: Şüpheli ${event.suspectName} @ ${event.location}`,
          description: event.tip || "Detay yok",
        };
      default:
        return { title: "Bilinmeyen Olay", description: "" };
    }
  };

  return (
    <PageLayout
      title="Timeline: Olay Örgüsü"
      description="Podo'nun kayboluşuyla ilgili tüm kayıtların kronolojik sıralaması."
      loading={isLoading}
      error={error}
      onRetry={fetchData}
    >
      <div className="relative border-l-2 border-primary/30 ml-4 pl-6 space-y-4 py-4">
        {events.map((event, index) => {
          const { title, description } = getEventDetails(event);
          return (
            <div key={`${event.id}-${index}`} className="relative group">
              <div className="absolute -left-[31px] top-5 w-3 h-3 bg-background border-2 border-primary rounded-full group-hover:scale-150 group-hover:bg-primary transition-all duration-300" />

              <div className="mb-1 text-xs font-bold text-primary tracking-wider">
                {event.timestamp}
              </div>

              <HorizontalCard
                title={title}
                description={description}
                buttonText="İncele"
                bVariant="outline"
                onButtonClick={() => console.log("Detay:", event)}
              />
            </div>
          );
        })}

        {events.length === 0 && !isLoading && !error && (
          <div className="text-center py-10 opacity-50">
            Veritabanında hiçbir kayıt bulunamadı.
          </div>
        )}
      </div>
    </PageLayout>
  );
}
