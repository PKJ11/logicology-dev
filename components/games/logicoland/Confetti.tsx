export default function Confetti() {
  const confettiColors = ['#3B82F6', '#8B5CF6', '#10B981', '#FBBF24', '#F97316', '#EC4899'];

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {Array.from({ length: 100 }).map((_, i) => {
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const size = Math.random() * 12 + 6;
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 2;
        const duration = Math.random() * 3 + 2;

        return (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${left}vw`,
              top: '-20px',
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: '50%',
              animationDelay: `${animationDelay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}