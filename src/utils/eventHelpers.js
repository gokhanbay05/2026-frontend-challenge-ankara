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
      return { icon: MessageSquare, color: "text-green-500", label: "Message" };
    case "sightings":
      return { icon: UserSearch, color: "text-purple-500", label: "Sighting" };
    case "notes":
      return { icon: StickyNote, color: "text-amber-500", label: "Note" };
    case "tips":
      return { icon: AlertCircle, color: "text-red-500", label: "Tip" };
    default:
      return { icon: Clock, color: "text-muted-foreground", label: "Event" };
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
        ? `Checked into ${ev.location}.`
        : `${ev.personName} checked into the location.`;

    case "messages":
      if (isPerson) {
        return ev.senderName === contextName
          ? `Sent a message to ${ev.recipientName}.`
          : `Received a message from ${ev.senderName}.`;
      }
      return `${ev.senderName} -> ${ev.recipientName} (Message delivered)`;

    case "sightings":
      if (isLocation)
        return `${ev.personName} and ${ev.seenWith} were seen here.`;
      return `${ev.personName} was seen with ${ev.seenWith} around ${ev.location}.`;

    case "notes": {
      const author =
        ev.authorName === contextName ? "On their own behalf" : ev.authorName;
      return `${author} left a note: "${ev.note}"`;
    }

    case "tips":
      return isPerson
        ? "Reported as a suspect."
        : `A tip was submitted regarding ${ev.suspectName}.`;

    default:
      return ev.note || ev.text || ev.tip || "Activity recorded.";
  }
};
