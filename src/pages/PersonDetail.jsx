import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import PageLayout from "../components/layout/PageLayout";
import HorizontalCard from "../components/ui/HorizontalCard";
import Button from "../components/ui/Button";
import { MessageCircle } from "lucide-react";
import MessageThreadView from "../components/views/MessageThreadView";

export default function PersonDetail() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const { events, isLoading, error } = useAppStore();

  const personEvents = useMemo(() => {
    return events.filter((ev) =>
      [
        ev.personName,
        ev.senderName,
        ev.recipientName,
        ev.seenWith,
        ev.authorName,
        ev.mentionedPeople,
        ev.suspectName,
      ].includes(decodedName),
    );
  }, [events, decodedName]);

  const contacts = useMemo(() => {
    const contactSet = new Set();
    personEvents.forEach((ev) => {
      if (ev.type === "messages") {
        if (ev.senderName === decodedName) contactSet.add(ev.recipientName);
        if (ev.recipientName === decodedName) contactSet.add(ev.senderName);
      }
    });
    return Array.from(contactSet);
  }, [personEvents, decodedName]);

  const handleOpenChat = (contactName) => {
    const thread = personEvents.filter(
      (ev) =>
        ev.type === "messages" &&
        ((ev.senderName === decodedName && ev.recipientName === contactName) ||
          (ev.senderName === contactName && ev.recipientName === decodedName)),
    );
    MessageThreadView.open(thread, decodedName, contactName);
  };

  return (
    <PageLayout
      title={decodedName}
      description="Soruşturma Dosyası ve İlişki Analizi"
      showBackButton={true}
      loading={isLoading}
      error={error}
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-muted/20 p-6 rounded-ui border border-border/50 flex flex-col items-center text-center">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${decodedName}`}
              alt={decodedName}
              className="w-32 h-32 bg-background rounded-full shadow-soft border-4 border-primary/20 mb-4"
            />
            <h2 className="text-2xl font-bold">{decodedName}</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {personEvents.length} Kayıt Bulundu
            </p>
          </div>

          {contacts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-border/40 pb-2">
                İletişim Kurduğu Kişiler
              </h3>
              <div className="flex flex-col gap-2">
                {contacts.map((contact, idx) => (
                  <Button
                    key={idx}
                    variant="secondary"
                    className="w-full justify-between py-3"
                    onClick={() => handleOpenChat(contact)}
                  >
                    <span className="flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact}`}
                        className="w-6 h-6 rounded-full bg-background"
                        alt={contact}
                      />
                      {contact}
                    </span>
                    <MessageCircle size={16} className="text-primary" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-border/40 pb-2 mb-6">
            Zaman Çizelgesi & Kanıtlar
          </h3>
          <div className="relative border-l-2 border-border/50 ml-2 pl-6 space-y-6">
            {personEvents.map((event, index) => {
              let title = "";
              let desc = "";

              if (event.type === "checkins") {
                title = "Lokasyon Check-in";
                desc = event.note || "Mevcudiyet bildirildi.";
              } else if (event.type === "messages") {
                title =
                  event.senderName === decodedName
                    ? `Mesaj Gönderildi`
                    : `Mesaj Alındı`;
                desc = `İlgili kişi: ${event.senderName === decodedName ? event.recipientName : event.senderName}`;
              } else if (event.type === "sightings") {
                title = "Gözlem Kaydı";
                desc = `${event.seenWith} ile birlikte görüldü. Not: ${event.note}`;
              } else if (event.type === "notes") {
                title =
                  event.authorName === decodedName
                    ? "Kişisel Not Düştü"
                    : "Hakkında Not Alındı";
                desc = event.note;
              } else if (event.type === "tips") {
                title = "İsimsiz İhbar";
                desc = `Şüpheli durum bildirildi: ${event.tip}`;
              }

              return (
                <div key={index} className="relative group">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 bg-muted border border-border rounded-full group-hover:scale-125 group-hover:bg-primary transition-all duration-300" />
                  <div className="text-[11px] font-bold text-primary mb-1 uppercase tracking-tighter">
                    {event.timestamp} @ {event.location}
                  </div>
                  <HorizontalCard
                    title={title}
                    description={desc}
                    isCompact={true}
                    bVariant="ghost"
                    buttonText={event.type.replace("s", "").toUpperCase()}
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
