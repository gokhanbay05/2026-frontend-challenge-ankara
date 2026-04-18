import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import PageLayout from "../components/layout/PageLayout";
import HorizontalCard from "../components/ui/HorizontalCard";

export default function LocationDetail() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const { events, isLoading, error } = useAppStore();
  const navigate = useNavigate();

  const locationEvents = useMemo(() => {
    return events.filter((ev) => ev.location === decodedName);
  }, [events, decodedName]);

  const visitors = useMemo(() => {
    const visitorSet = new Set();
    locationEvents.forEach((ev) => {
      [
        ev.personName,
        ev.senderName,
        ev.recipientName,
        ev.seenWith,
        ev.authorName,
        ev.mentionedPeople,
        ev.suspectName,
      ].forEach((v) => v && visitorSet.add(v));
    });
    return Array.from(visitorSet);
  }, [locationEvents]);

  return (
    <PageLayout
      title={decodedName}
      description="Mekan Bazlı Olay ve Ziyaretçi Analizi"
      showBackButton={true}
      loading={isLoading}
      error={error}
    >
      <div className="space-y-12">
        <div className="bg-primary/5 border border-primary/20 rounded-ui p-8 text-center space-y-2">
          <h2 className="text-sm uppercase tracking-[0.2em] text-primary font-bold">
            Olay Yeri Analizi
          </h2>
          <p className="text-4xl font-black tracking-tight">{decodedName}</p>
          <p className="text-muted-foreground font-medium">
            Bu konumda toplam {locationEvents.length} kayıtlı faaliyet tespit
            edildi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight border-b border-border/40 pb-4">
              Tespit Edilen Kişiler ({visitors.length})
            </h3>
            <div className="flex flex-col gap-3">
              {visitors.map((visitor, idx) => (
                <HorizontalCard
                  key={idx}
                  title={visitor}
                  description="Kişi Dosyasına Git"
                  isCompact={true}
                  buttonText="PROFİL"
                  onButtonClick={() =>
                    navigate(`/person/${encodeURIComponent(visitor)}`)
                  }
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold tracking-tight border-b border-border/40 pb-4">
              Mekan Faaliyet Akışı
            </h3>
            <div className="space-y-4">
              {locationEvents.map((event, index) => (
                <div
                  key={index}
                  className="p-5 bg-muted/20 border border-border/50 rounded-ui space-y-2 transition-all hover:bg-muted/30"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                      {event.type.replace("s", "")}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground italic">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground font-medium">
                    {event.text ||
                      event.note ||
                      event.tip ||
                      "Aktivite kaydedildi."}
                  </p>
                  <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/20">
                    Kayıt ID: {event.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
