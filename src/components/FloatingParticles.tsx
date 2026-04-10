import { motion } from "framer-motion";

const particles = [
  { size: 6, x: "10%", y: "15%", duration: 18, delay: 0, opacity: 0.4 },
  { size: 4, x: "85%", y: "10%", duration: 22, delay: 2, opacity: 0.3 },
  { size: 8, x: "70%", y: "40%", duration: 20, delay: 1, opacity: 0.25 },
  { size: 5, x: "25%", y: "60%", duration: 16, delay: 3, opacity: 0.35 },
  { size: 3, x: "50%", y: "20%", duration: 24, delay: 0.5, opacity: 0.2 },
  { size: 7, x: "90%", y: "70%", duration: 19, delay: 4, opacity: 0.3 },
  { size: 4, x: "15%", y: "80%", duration: 21, delay: 1.5, opacity: 0.25 },
  { size: 10, x: "40%", y: "30%", duration: 25, delay: 2.5, opacity: 0.15 },
  { size: 5, x: "60%", y: "85%", duration: 17, delay: 3.5, opacity: 0.3 },
  { size: 6, x: "35%", y: "50%", duration: 23, delay: 0.8, opacity: 0.2 },
];

const shapes = [
  { type: "ring", size: 40, x: "20%", y: "25%", duration: 30, delay: 0, opacity: 0.08 },
  { type: "ring", size: 60, x: "75%", y: "55%", duration: 35, delay: 2, opacity: 0.06 },
  { type: "diamond", size: 16, x: "80%", y: "15%", duration: 28, delay: 1, opacity: 0.12 },
  { type: "diamond", size: 12, x: "30%", y: "70%", duration: 26, delay: 3, opacity: 0.1 },
  { type: "cross", size: 14, x: "55%", y: "45%", duration: 32, delay: 1.5, opacity: 0.08 },
];

const FloatingParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    {/* Floating dots */}
    {particles.map((p, i) => (
      <motion.div
        key={`dot-${i}`}
        className="absolute rounded-full bg-primary"
        style={{
          width: p.size,
          height: p.size,
          left: p.x,
          top: p.y,
          opacity: p.opacity,
        }}
        animate={{
          y: [0, -30, 10, -20, 0],
          x: [0, 15, -10, 20, 0],
          scale: [1, 1.3, 0.8, 1.1, 1],
          opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.6, p.opacity * 1.2, p.opacity],
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
          y: [0, -20, 15, -10, 0],
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
            className="rounded-full border-2 border-primary"
            style={{ width: s.size, height: s.size }}
          />
        )}
        {s.type === "diamond" && (
          <div
            className="bg-accent rotate-45"
            style={{ width: s.size, height: s.size }}
          />
        )}
        {s.type === "cross" && (
          <div className="relative" style={{ width: s.size, height: s.size }}>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 h-full w-[2px] bg-primary -translate-x-1/2" />
          </div>
        )}
      </motion.div>
    ))}
  </div>
);

export default FloatingParticles;
