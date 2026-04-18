import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import PageLayout from "../components/layout/PageLayout";
import HorizontalCard from "../components/ui/HorizontalCard";
import Button from "../components/ui/Button";
import { MessageCircle, User, Activity } from "lucide-react";
import MessageThreadView from "../components/views/MessageThreadView";
import EventDetailView from "../components/views/EventDetailView";
import { getEventIcon } from "../utils/eventHelpers";
import { getEventDescription } from "../utils/eventHelpers";

export default function PersonDetail() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const { events, isLoading, error } = useAppStore();

  const personEvents = useMemo(() => {
    return events.filter((ev) => {
      const allNamesInEvent = [
        ev.personName,
        ev.senderName,
        ev.recipientName,
        ev.seenWith,
        ev.authorName,
        ev.mentionedPeople,
        ev.suspectName,
      ].join(", ");

      return allNamesInEvent.includes(decodedName);
    });
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
      description="Şüpheli Profil ve İlişki Analizi"
      showBackButton={true}
      loading={isLoading}
      error={error}
    >
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-all" />
            <div className="relative bg-background border border-border/50 p-8 rounded-ui flex flex-col items-center text-center shadow-soft">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${decodedName}`}
                alt={decodedName}
                className="w-40 h-40 bg-muted rounded-full border-4 border-background shadow-xl mb-6"
              />
              <h2 className="text-3xl font-black tracking-tight">
                {decodedName}
              </h2>
              <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                <Activity size={12} /> {personEvents.length} Kayıtlı İz
              </div>
            </div>
          </div>

          {contacts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                <MessageCircle size={16} /> İletişim Ağı
              </h3>
              <div className="grid gap-2">
                {contacts.map((contact, idx) => (
                  <Button
                    key={idx}
                    variant="secondary"
                    className="w-full justify-between py-2 px-4 hover:border-primary/50"
                    onClick={() => handleOpenChat(contact)}
                  >
                    <span className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact}`}
                        className="w-8 h-8 rounded-full bg-background border"
                        alt=""
                      />
                      <span className="font-bold">{contact}</span>
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/3 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
            <User size={16} /> Dosya Geçmişi
          </h3>

          <div className="relative border-l-2 border-border/50 ml-4 pl-8 space-y-8">
            {personEvents.map((ev, index) => {
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
                      @{ev.location}
                    </span>
                  </div>

                  <HorizontalCard
                    title={`${label}: ${ev.location}`}
                    description={getEventDescription(ev, "person", decodedName)}
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
