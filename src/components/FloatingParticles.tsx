import { motion } from "framer-motion";

const orbs = [
  { size: 180, x: "5%", y: "8%", duration: 22, delay: 0, color: "bg-primary/15", blur: 60 },
  { size: 120, x: "75%", y: "5%", duration: 26, delay: 3, color: "bg-accent/12", blur: 50 },
  { size: 200, x: "60%", y: "45%", duration: 30, delay: 1, color: "bg-primary/10", blur: 80 },
  { size: 140, x: "10%", y: "65%", duration: 24, delay: 5, color: "bg-accent/8", blur: 55 },
  { size: 100, x: "85%", y: "80%", duration: 28, delay: 2, color: "bg-primary/12", blur: 45 },
];

const particles = [
  { size: 10, x: "12%", y: "18%", duration: 14, delay: 0, opacity: 0.6 },
  { size: 7, x: "88%", y: "12%", duration: 18, delay: 1.5, opacity: 0.5 },
  { size: 12, x: "65%", y: "35%", duration: 16, delay: 0.8, opacity: 0.45 },
  { size: 8, x: "30%", y: "55%", duration: 12, delay: 2.5, opacity: 0.55 },
  { size: 6, x: "50%", y: "22%", duration: 20, delay: 0.3, opacity: 0.35 },
  { size: 9, x: "92%", y: "65%", duration: 15, delay: 4, opacity: 0.5 },
  { size: 7, x: "18%", y: "78%", duration: 17, delay: 1, opacity: 0.4 },
  { size: 14, x: "42%", y: "28%", duration: 22, delay: 2, opacity: 0.3 },
  { size: 8, x: "58%", y: "82%", duration: 13, delay: 3, opacity: 0.5 },
  { size: 10, x: "38%", y: "48%", duration: 19, delay: 0.5, opacity: 0.35 },
  { size: 5, x: "72%", y: "90%", duration: 16, delay: 1.2, opacity: 0.45 },
  { size: 11, x: "8%", y: "40%", duration: 21, delay: 3.5, opacity: 0.4 },
];

const shapes = [
  { type: "ring", size: 70, x: "18%", y: "20%", duration: 28, delay: 0, opacity: 0.15, borderWidth: 2 },
  { type: "ring", size: 100, x: "78%", y: "50%", duration: 34, delay: 2, opacity: 0.1, borderWidth: 3 },
  { type: "ring", size: 50, x: "45%", y: "75%", duration: 26, delay: 4, opacity: 0.12, borderWidth: 2 },
  { type: "diamond", size: 24, x: "82%", y: "12%", duration: 22, delay: 1, opacity: 0.2 },
  { type: "diamond", size: 18, x: "25%", y: "68%", duration: 20, delay: 3, opacity: 0.18 },
  { type: "diamond", size: 14, x: "55%", y: "38%", duration: 24, delay: 5, opacity: 0.15 },
  { type: "cross", size: 20, x: "60%", y: "42%", duration: 30, delay: 1.5, opacity: 0.12 },
  { type: "cross", size: 16, x: "15%", y: "52%", duration: 26, delay: 3.5, opacity: 0.14 },
  { type: "hexagon", size: 28, x: "70%", y: "25%", duration: 32, delay: 2.5, opacity: 0.12 },
  { type: "hexagon", size: 20, x: "35%", y: "85%", duration: 28, delay: 0.5, opacity: 0.1 },
];

const FloatingParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    {/* Large glowing orbs */}
    {orbs.map((orb, i) => (
      <motion.div
        key={`orb-${i}`}
        className={`absolute rounded-full ${orb.color}`}
        style={{
          width: orb.size,
          height: orb.size,
          left: orb.x,
          top: orb.y,
          filter: `blur(${orb.blur}px)`,
        }}
        animate={{
          y: [0, -40, 20, -30, 0],
          x: [0, 25, -15, 30, 0],
          scale: [1, 1.2, 0.9, 1.15, 1],
        }}
        transition={{
          duration: orb.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: orb.delay,
        }}
      />
    ))}

    {/* Bright floating dots */}
    {particles.map((p, i) => (
      <motion.div
        key={`dot-${i}`}
        className="absolute rounded-full"
        style={{
          width: p.size,
          height: p.size,
          left: p.x,
          top: p.y,
          opacity: p.opacity,
          background: i % 3 === 0
            ? "hsl(var(--accent))"
            : i % 2 === 0
              ? "hsl(var(--primary) / 0.8)"
              : "hsl(var(--primary))",
          boxShadow: `0 0 ${p.size * 2}px ${p.size / 2}px hsl(var(--primary) / 0.3)`,
        }}
        animate={{
          y: [0, -40, 15, -25, 0],
          x: [0, 20, -12, 25, 0],
          scale: [1, 1.4, 0.7, 1.2, 1],
          opacity: [p.opacity, p.opacity * 1.6, p.opacity * 0.5, p.opacity * 1.3, p.opacity],
        }}
        transition={{
          duration: p.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: p.delay,
        }}
      />
    ))}

    {/* Floating shapes */}
    {shapes.map((s, i) => (
      <motion.div
        key={`shape-${i}`}
        className="absolute"
        style={{ left: s.x, top: s.y, opacity: s.opacity }}
        animate={{
          y: [0, -25, 18, -15, 0],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: s.duration,
          repeat: Infinity,
          ease: "linear",
          delay: s.delay,
        }}
      >
        {s.type === "ring" && (
          <div
            className="rounded-full border-primary"
            style={{ width: s.size, height: s.size, borderWidth: s.borderWidth || 2, borderStyle: "solid", borderColor: "hsl(var(--primary))" }}
          />
        )}
        {s.type === "diamond" && (
          <div
            className="rotate-45"
            style={{ width: s.size, height: s.size, background: "hsl(var(--accent))" }}
          />
        )}
        {s.type === "cross" && (
          <div className="relative" style={{ width: s.size, height: s.size }}>
            <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2" style={{ background: "hsl(var(--primary))" }} />
            <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2" style={{ background: "hsl(var(--primary))" }} />
          </div>
        )}
        {s.type === "hexagon" && (
          <svg width={s.size} height={s.size} viewBox="0 0 28 28">
            <polygon
              points="14,1 26,7.5 26,20.5 14,27 2,20.5 2,7.5"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </motion.div>
    ))}
  </div>
);

export default FloatingParticles;
