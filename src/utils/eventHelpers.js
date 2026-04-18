import {
  MapPin,
  MessageSquare,
  UserSearch,
  StickyNote,
  Clock,
  AlertCircle,
} from "lucide-react";

export const getEventIcon = (type) => {
  switch (type) {
    case "checkins":
      return { icon: MapPin, color: "text-blue-500", label: "Check-in" };
    case "messages":
      return { icon: MessageSquare, color: "text-green-500", label: "Mesaj" };
    case "sightings":
      return { icon: UserSearch, color: "text-purple-500", label: "Gözlem" };
    case "notes":
      return { icon: StickyNote, color: "text-amber-500", label: "Not" };
    case "tips":
      return { icon: AlertCircle, color: "text-red-500", label: "İhbar" };
    default:
      return { icon: Clock, color: "text-muted-foreground", label: "Olay" };
  }
};

export const getEventDescription = (
  ev,
  context = "general",
  contextName = "",
) => {
  const isPerson = context === "person";
  const isLocation = context === "location";

  switch (ev.type) {
    case "checkins":
      return isPerson
        ? `${ev.location} konumuna giriş yaptı.`
        : `${ev.personName} mekana giriş yaptı.`;

    case "messages":
      if (isPerson) {
        return ev.senderName === contextName
          ? `${ev.recipientName} kişisine mesaj gönderdi.`
          : `${ev.senderName} kişisinden mesaj aldı.`;
      }
      return `${ev.senderName} -> ${ev.recipientName} (Mesaj iletildi)`;

    case "sightings":
      if (isLocation)
        return `${ev.personName} ve ${ev.seenWith} burada görüldü.`;
      return `${ev.personName}, ${ev.seenWith} ile ${ev.location} civarında görüldü.`;

    case "notes": {
      const author =
        ev.authorName === contextName ? "Kendi adına" : ev.authorName;
      return `${author} bir not düştü: "${ev.note}"`;
    }

    case "tips":
      return isPerson
        ? "Şüpheli sıfatıyla ihbar edildi."
        : `${ev.suspectName} hakkında ihbar yapıldı.`;

    default:
      return ev.note || ev.text || ev.tip || "Aktivite kaydedildi.";
  }
};
