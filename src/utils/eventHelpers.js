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

export const getEventDescription = (ev) => {
  switch (ev.type) {
    case "checkins":
      return `${ev.personName} mekana giriş yaptı.`;
    case "messages":
      return `${ev.senderName} tarafından ${ev.recipientName} kişisine gönderildi.`;
    case "sightings":
      return `${ev.personName}, ${ev.seenWith} ile birlikte görüldü.`;
    default:
      return ev.note || ev.text || ev.tip || "Detay yok.";
  }
};
