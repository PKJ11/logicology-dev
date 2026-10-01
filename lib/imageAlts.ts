// Descriptive alt text for the illustration images used across the site.
// Images that contain headline text repeat that text here so search engines can read it.
const ALTS: Record<string, string> = {
  "CHILDREN-THINK-THEY-ARE-PALYING.png":
    "Children think they're playing. Parents know they're learning. Kids playing a Logicology game",
  "WE-ARE-NOT-TOY-COMPANY-NEW.png":
    "We are not a toy company. We are a learning company that made learning fun",
  "COMMUNITY.png": "Join the Logicology community of parents raising thinkers",
  "FOLD-4.1-COMMUNITY-IMAGE.png": "Parents and kids in the Logicology community",
  "CONTACT-US-IMAGE.png": "Contact Logicology for orders, schools and bulk purchases",
  "CONTACT-US-SECTION-IMAGE.png": "Contact Logicology for orders, schools and bulk purchases",
  "LOGICOLAND-PAGE-FOLD-2-IMAGE.png": "Child solving logic puzzles in a Logicoland puzzle book",
  "LOGICOLAND-HERO-IMAGE.png": "Logicoland logic puzzle books for kids",
  "FROM-CLASS-ROOM-TO-LIVING-ROOM.png":
    "From classrooms to living rooms: children playing Prime Time, the prime number board game",
  "FACTOR-IN-FUN.png": "Factor in fun: Prime Time math board game cards for learning factors",
  "INNOVATION.png": "Innovation at its core: patent-pending Prime Time math board game",
  "PRIME-TIME-FOLD-2-IMAGE.png": "Kids playing a Logicology math card game at a table",
  "primetime_imag1.png": "Prime Time math board game for kids box",
  "allbooks.JPG": "All five Logicoland logic puzzle books for kids",
};

export function altForImage(src: string, fallback = "Logicology learning game for kids"): string {
  const file = decodeURIComponent(src.split("?")[0].split("/").pop() ?? "");
  return ALTS[file] ?? fallback;
}
