import React from "react";
import useModalStore from "../../store/useModalStore";
import { getEventIcon } from "../../utils/eventHelpers";

export default function EventDetailView({ event }) {
  const { label, icon: Icon, color } = getEventIcon(event.type);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-ui border border-border/50">
        <div className={`p-2 rounded-lg bg-background shadow-sm ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <h4 className="font-bold text-lg leading-none">{label} Kaydı</h4>
          <p className="text-xs text-muted-foreground mt-1">ID: {event.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-muted/20 border border-border/40 rounded-lg">
          <p className="text-[10px] uppercase font-black opacity-50 tracking-wider mb-1">
            Zaman
          </p>
          <p className="text-sm font-semibold">{event.timestamp}</p>
        </div>
        <div className="p-3 bg-muted/20 border border-border/40 rounded-lg">
          <p className="text-[10px] uppercase font-black opacity-50 tracking-wider mb-1">
            Konum
          </p>
          <p className="text-sm font-semibold">{event.location}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] uppercase font-black opacity-50 tracking-wider px-1">
          Ham Veri / Notlar
        </p>
        <div className="p-4 bg-background border border-border rounded-ui italic text-sm leading-relaxed shadow-inner">
          "
          {event.note ||
            event.text ||
            event.tip ||
            "Soruşturma notu bulunamadı."}
          "
        </div>
      </div>

      {event.urgency && (
        <div
          className={`text-center py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
            event.urgency === "high"
              ? "bg-red-500/10 border-red-500/20 text-red-500"
              : "bg-blue-500/10 border-blue-500/20 text-blue-500"
          }`}
        >
          Öncelik: {event.urgency}
        </div>
      )}
    </div>
  );
}

EventDetailView.open = (event) => {
  const { openModal } = useModalStore.getState();
  const { label } = getEventIcon(event.type);
  openModal(`${label} Analizi`, <EventDetailView event={event} />);
};
