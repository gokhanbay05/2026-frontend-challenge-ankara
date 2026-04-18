import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import PageLayout from "../components/layout/PageLayout";
import HorizontalCard from "../components/ui/HorizontalCard";
import Button from "../components/ui/Button";
import { Users, Activity, MapPin } from "lucide-react";
import EventDetailView from "../components/views/EventDetailView";
import { getEventIcon } from "../utils/eventHelpers";

export default function LocationDetail() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const { events, isLoading, error } = useAppStore();
  const navigate = useNavigate();

  // 1. Bu lokasyondaki olayları filtrele
  const locationEvents = useMemo(() => {
    return events.filter((ev) => ev.location === decodedName);
  }, [events, decodedName]);

  // 2. Lokasyondaki benzersiz ziyaretçileri çıkar
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
      ].forEach((v) => {
        if (v) v.split(",").forEach((n) => visitorSet.add(n.trim()));
      });
    });
    return Array.from(visitorSet);
  }, [locationEvents]);

  // Lokasyon odaklı açıklama metinleri
  const getLocationContextDescription = (ev) => {
    switch (ev.type) {
      case "checkins":
        return `${ev.personName} bu konuma giriş yaptı.`;
      case "messages":
        return `${ev.senderName} kişisinden ${ev.recipientName} kişisine mesaj iletildi.`;
      case "sightings":
        return `${ev.personName} ve ${ev.seenWith} burada yan yana görüldü.`;
      case "notes":
        return `${ev.authorName} mekanla ilgili bir not düştü: "${ev.note}"`;
      case "tips":
        return `${ev.suspectName} hakkında bu konumdan ihbar yapıldı.`;
      default:
        return "Aktivite kaydedildi.";
    }
  };

  return (
    <PageLayout
      title={decodedName}
      description="Lokasyon Bazlı Faaliyet ve Ziyaretçi Analizi"
      showBackButton={true}
      loading={isLoading}
      error={error}
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* SOL PANEL: Mekan Özeti ve Ziyaretçiler */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-all" />
            <div className="relative bg-background border border-border/50 p-8 rounded-ui flex flex-col items-center text-center shadow-soft">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4 border-2 border-primary/20">
                <MapPin size={40} className="text-primary" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">
                {decodedName}
              </h2>
              <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                <Activity size={12} /> {locationEvents.length} Toplam Kayıt
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
              <Users size={16} /> Tespit Edilen Kişiler
            </h3>
            <div className="grid gap-2">
              {visitors.map((visitor, idx) => (
                <Button
                  key={idx}
                  variant="secondary"
                  className="w-full justify-start py-2 px-4"
                  onClick={() =>
                    navigate(`/person/${encodeURIComponent(visitor)}`)
                  }
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${visitor}`}
                      className="w-8 h-8 rounded-full bg-background border"
                      alt=""
                    />
                    <span className="font-bold">{visitor}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ PANEL: Mekan Timeline */}
        <div className="w-full lg:w-2/3 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
            <Activity size={16} /> Mekan İzleri
          </h3>

          <div className="relative border-l-2 border-border/50 ml-4 pl-8 space-y-8">
            {locationEvents.map((ev, index) => {
              const { icon: Icon, color, label } = getEventIcon(ev.type);
              return (
                <div key={index} className="relative">
                  <div className="absolute -left-[49px] top-4 w-10 h-10 bg-background border-2 border-border rounded-full flex items-center justify-center z-10 shadow-sm">
                    <Icon size={20} className={color} />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded">
                      {ev.timestamp}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Kayıt ID: {ev.id}
                    </span>
                  </div>

                  <HorizontalCard
                    title={`${label} Kaydı`}
                    description={getLocationContextDescription(ev)}
                    buttonText="KANIT"
                    onButtonClick={() => EventDetailView.open(ev)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
