import React, { useEffect, useMemo } from "react";
import useAppStore from "../store/useAppStore";
import PageLayout from "../components/layout/PageLayout";
import HorizontalCard from "../components/ui/HorizontalCard";
import SummaryCard from "../components/ui/SummaryCard";
import EventDetailView from "../components/views/EventDetailView";
import { getEventIcon, getEventDescription } from "../utils/eventHelpers";
import PodoMaskot from "../assets/PodoAIVoiceWrite.png";
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
      <div className="relative mb-12 rounded-ui overflow-hidden bg-primary text-primary-foreground p-8 md:p-12 shadow-2xl group">
        <div className="relative z-10 space-y-4">
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
            Live Investigation
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Case: Missing Podo
          </h1>
          <p className="max-w-xl text-primary-foreground/70 italic font-medium leading-relaxed">
            Follow the digital footprints, put the clues together and uncover
            the truth.
          </p>
        </div>

        <div className="absolute right-[-10px] bottom-[-10px] z-0 w-52 md:w-80 pointer-events-none select-none">
          <img
            src={PodoMaskot}
            alt="Podo Mascot"
            className="w-full h-full object-contain drop-shadow-[-15px_15px_40px_rgba(0,0,0,0.5)] transform -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <SummaryCard
          title="Total Evidence"
          value={stats?.total}
          icon={StickyNote}
          colorClass="text-blue-500"
        />
        <SummaryCard
          title="Last Known Location"
          value={stats?.lastLoc}
          icon={MapPin}
          colorClass="text-red-500"
        />
        <SummaryCard
          title="Case Priority"
          value="Critical"
          icon={AlertCircle}
          colorClass="text-amber-500"
        />
        <SummaryCard
          title="Current Status"
          value="Wanted"
          icon={UserSearch}
          colorClass="text-primary"
        />
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
          <Clock className="text-primary" /> Event Timeline
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
                  buttonText="INSPECT"
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
