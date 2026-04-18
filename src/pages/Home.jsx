import React, { useEffect, useMemo } from "react";
import useAppStore from "../store/useAppStore";
import PageLayout from "../components/layout/PageLayout";
import HorizontalCard from "../components/ui/HorizontalCard";
import SummaryCard from "../components/ui/SummaryCard";
import EventDetailView from "../components/views/EventDetailView";
import { getEventIcon, getEventDescription } from "../utils/eventHelpers";
import {
  StickyNote,
  MapPin,
  AlertCircle,
  UserSearch,
  Clock,
} from "lucide-react";

export default function Home() {
  const { events, isLoading, error, fetchData } = useAppStore();

  useEffect(() => {
    if (events.length === 0) fetchData();
  }, [fetchData, events.length]);

  const stats = useMemo(() => {
    if (events.length === 0) return null;
    return {
      total: events.length,
      lastLoc: events[events.length - 1].location,
    };
  }, [events]);

  return (
    <PageLayout loading={isLoading} error={error} onRetry={fetchData}>
      {/* Hero Section */}
      <div className="relative mb-12 rounded-ui overflow-hidden bg-primary text-primary-foreground p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
            Canlı Soruşturma
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Vaka: Podo Kayıp
          </h1>
          <p className="max-w-xl text-primary-foreground/70 italic font-medium leading-relaxed">
            Dijital ayak izlerini takip et, ipuçlarını birleştir ve gerçeği
            ortaya çıkar.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <SummaryCard
          title="Toplam Kanıt"
          value={stats?.total}
          icon={StickyNote}
          colorClass="text-blue-500"
        />
        <SummaryCard
          title="Son Bilinen Konum"
          value={stats?.lastLoc}
          icon={MapPin}
          colorClass="text-red-500"
        />
        <SummaryCard
          title="Vaka Önceliği"
          value="Kritik"
          icon={AlertCircle}
          colorClass="text-amber-500"
        />
        <SummaryCard
          title="Mevcut Durum"
          value="Aranıyor"
          icon={UserSearch}
          colorClass="text-primary"
        />
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
          <Clock className="text-primary" /> Olay Akışı
        </h3>
        <div className="relative border-l-2 border-primary/20 ml-6 pl-8 space-y-6 py-2">
          {events.map((ev, idx) => {
            const { icon: Icon, color, label } = getEventIcon(ev.type);
            return (
              <div key={idx} className="relative group">
                <div className="absolute -left-[45px] top-4 w-8 h-8 bg-background border border-border shadow-soft rounded-full flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                  <Icon size={18} className={color} />
                </div>
                <HorizontalCard
                  title={`${label}: ${ev.location}`}
                  description={getEventDescription(ev)}
                  buttonText="İNCELE"
                  onButtonClick={() => EventDetailView.open(ev)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
