/*
	Installed from https://reactbits.dev/ts/tailwind/
*/

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Music, BookOpen, Users, Mountain, Calendar, Home, Bell, Heart, Megaphone, Clock, BarChart2 } from 'lucide-react';

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  icon?: React.ReactNode; // Ajouté pour l'icône
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MOBILE_BREAKPOINT = 768;

// Détection de l'appareil mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= MOBILE_BREAKPOINT;
};

// Détection du support tactile
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const PRIMARY_COLORS = [
  '#1e3a8a', // Bleu marine
  '#f97316', // Orange
  '#EE6239', // Corail
  '#62BF92', // Menthe
];

// Palette de couleurs pour le glow par carte (et bordure RGB)
const GLOW_COLORS = [
  'rgba(30,58,138,0.25)',   // Bleu marine
  'rgba(249,115,22,0.25)', // Orange
  'rgba(238,98,57,0.25)',  // Corail
  'rgba(98,191,146,0.25)', // Menthe
];
const GLOW_RGB = [
  '30,58,138',   // Bleu marine
  '249,115,22',  // Orange
  '238,98,57',   // Corail
  '98,191,146',  // Menthe
];

const cardData: BentoCardProps[] = [
  // Participants (gauche)
  {
    color: PRIMARY_COLORS[0],
    title: "Trouve enfin des événements qui te parlent",
    description: "Des recommandations selon ta foi et tes centres d'intérêts.",
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-primary-blue/5 text-primary-blue shadow-sm">
        <Calendar size={24} />
      </span>
    ),
  },
  {
    color: PRIMARY_COLORS[1],
    title: "Ne passe plus à côté de ce que Dieu t'a réservé",
    description: "Reste informé en temps réel, où que tu sois.",
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-orange-50 text-orange-700 shadow-sm">
        <Bell size={24} />
      </span>
    ),
  },
  {
    color: PRIMARY_COLORS[2],
    title: "Vis ta foi, partage-la, sans compromis",
    description: "Participe à des événements porteurs de sens, connecte-toi à d'autres croyants.",
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-rose-50 text-rose-700 shadow-sm">
        <Heart size={24} />
      </span>
    ),
  },
  // Organisateurs (droite)
  {
    color: PRIMARY_COLORS[3],
    title: "Donne à ton événement la visibilité qu'il mérite",
    description: "Touche une audience ciblée, engagée et en quête d'expériences comme la tienne.",
    icon: (
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-[#62BF92]/10 text-[#62BF92] shadow-sm">
        <Megaphone size={24} />
      </span>
    ),
  },
  {
    color: PRIMARY_COLORS[0],
    title: "Gagne du temps sur toute l'organisation",
    description: "Billetterie, rappels, communication : tout est automatisé.",
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-orange-50 text-orange-700 shadow-sm">
        <Clock size={24} />
      </span>
    ),
  },
  {
    color: PRIMARY_COLORS[1],
    title: "Mieux connaître, mieux impacter",
    description: "Suis les inscriptions, retours et profils pour bâtir une communauté engagée.",
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-primary-blue/5 text-primary-blue shadow-sm">
        <BarChart2 size={24} />
      </span>
    ),
  },
];

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      if (particle && particle.parentNode) {
        gsap.to(particle, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "back.in(1.7)",
          onComplete: () => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          },
        });
      }
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        if (cardRef.current && clone) {
          cardRef.current.appendChild(clone);
          particlesRef.current.push(clone);

          gsap.fromTo(
            clone,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
          );

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: "none",
            repeat: -1,
            yoyo: true,
          });

          gsap.to(clone, {
            opacity: 0.3,
            duration: 1.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt && element) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt && element) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableMagnetism && element) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt && element) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism && element) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = '#1e3a8a', // Correction 2 : remplacer tout usage résiduel de DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll(".card");

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        cards.forEach((card) => {
          (card as HTMLElement).style.setProperty("--glow-intensity", "0");
        });
        return;
      }

      const { proximity, fadeDistance } =
        calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(
          cardElement,
          e.clientX,
          e.clientY,
          glowIntensity,
          spotlightRadius,
        );
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll(".card").forEach((card) => {
        (card as HTMLElement).style.setProperty("--glow-intensity", "0");
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-2 p-3 max-w-[120rem] select-none relative w-full"
    style={{ 
      fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)",
      width: "100%"
    }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default function MagicBento({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false, // Désactivé par défaut comme original
  glowColor = '#1e3a8a',
  clickEffect = true,
  enableMagnetism = false, // Désactivé par défaut comme original
}: BentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Garder toutes les animations desktop intactes, seulement adapter pour mobile
  const shouldDisableAnimations = disableAnimations;
  const shouldDisableTilt = !enableTilt;
  const shouldDisableMagnetism = !enableMagnetism;
  const shouldDisableStars = !enableStars;
  const shouldDisableSpotlight = !enableSpotlight;

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --border-color: #E5E7EB;
            --background-dark: #fff;
          }
          .card--border-glow {
            position: relative;
            z-index: 0;
          }
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            border-radius: inherit;
            background: radial-gradient(
              var(--glow-radius, 5px) circle at var(--glow-x, 50%) var(--glow-y, 50%),
              var(--glow-color, rgba(132,0,255,0.25)) 0%,
              transparent 80%
            );
            opacity: var(--glow-intensity, 0);
            transition: opacity 0.3s;
            z-index: 0;
            filter: blur(12px);
          }
          .card--border-glow:hover::after {
            opacity: 1;
          }
          
          .card {
            background: #fff !important;
            border: 3px solid;
            border-color: #E5E7EB;
            transition: border-color 0.2s;
            position: relative;
            z-index: 1;
            overflow: visible;
            will-change: box-shadow, border-color;
            transform-style: flat;
            contain: layout paint;
            backface-visibility: hidden;
            perspective: none;
            /* Amélioration pour mobile seulement */
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          
          /* Effet de feedback tactile sur mobile seulement */
          @media (hover: none) and (pointer: coarse) {
            .card:active {
              transform: scale(0.98);
              transition: transform 0.1s ease-out;
            }
            
            /* S'assurer que toutes les cartes sont interactives */
            .card {
              pointer-events: auto !important;
              touch-action: manipulation !important;
              -webkit-tap-highlight-color: transparent !important;
              user-select: none;
            }
            
            /* Forcer l'interactivité pour les cartes problématiques */
            .card-responsive .card:nth-child(2),
            .card-responsive .card:nth-child(5) {
              pointer-events: auto !important;
              touch-action: manipulation !important;
              position: relative !important;
              z-index: 10 !important;
              overflow: visible !important;
              transform: translateZ(0) !important; /* Force hardware acceleration */
            }
          }

          
          .card-responsive {
            grid-template-columns: 1fr;
            width: 90%;
            margin: 0 auto;
            padding: 0.5rem;
          }
          
          @media (min-width: 600px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 2fr);
            }
            
            .card-responsive .card:nth-child(3) {
              grid-column: span 2;
              grid-row: span 2;
            }
            
            .card-responsive .card:nth-child(4) {
              grid-column: 1 / span 2;
              grid-row: 2 / span 2;
            }
            
            .card-responsive .card:nth-child(6) {
              grid-column: 4;
              grid-row: 3;
            }
          }
          
          .card--border-glow:hover {
            border-color: rgba(var(--glow-border-rgb, 229,231,235), 1);
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
          
          .particle-container:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          @media (max-width: 599px) {
            .bento-section {
              max-width: 100% !important;
              width: 100% !important;
              padding: 0.5rem !important;
            }
            
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
              width: 100% !important;
              margin: 0 !important;
              padding: 0.25rem !important;
              gap: 0.5rem;
            }
            
            .card-responsive .card {
              width: 100%;
              min-height: 160px;
              padding: 0.75rem;
            }
            
            /* Réorganisation de l'ordre sur mobile */
            .card-responsive .card:nth-child(1) {
              grid-row: 2;
              grid-column: 1;
            }
            
            .card-responsive .card:nth-child(2) {
              grid-row: 2;
              grid-column: 2;
            }
            
            .card-responsive .card:nth-child(3) {
              grid-row: 1;
              grid-column: 1 / -1;
              min-height: 180px;
            }
            
            .card-responsive .card:nth-child(4) {
              grid-row: 3;
              grid-column: 1 / -1;
              min-height: 180px;
            }
            
            .card-responsive .card:nth-child(5) {
              grid-row: 4;
              grid-column: 1;
            }
            
            .card-responsive .card:nth-child(6) {
              grid-row: 4;
              grid-column: 2;
            }
            
            .card-responsive .card__title {
              font-size: 1rem;
              line-height: 1.2;
              font-weight: 500;
            }
            
            .card-responsive .card__description {
              font-size: 0.75rem;
              line-height: 1.3;
            }
            
            /* Titres plus grands pour les cartes pleine largeur */
            .card-responsive .card:nth-child(3) .card__title,
            .card-responsive .card:nth-child(4) .card__title {
              font-size: 1.375rem !important;
              line-height: 1.2;
              font-weight: 500 !important;
              margin-bottom: 0.5rem !important;
            }
            
            /* Descriptions plus grandes pour les cartes pleine largeur - Mobile */
            .card-responsive .card:nth-child(3) .card__description,
            .card-responsive .card:nth-child(4) .card__description {
              font-size: 0.875rem !important;
              line-height: 1.4;
            }
          }
          
          /* Titres plus grands pour les cartes pleine largeur - Desktop aussi */
          .card:nth-child(3) .card__title,
          .card:nth-child(4) .card__title {
            font-size: 1.5rem !important;
            line-height: 1.2;
            font-weight: 500 !important;
            margin-bottom: 0.5rem !important;
          }
          
          /* Descriptions plus grandes pour les cartes pleine largeur - Desktop */
          .card:nth-child(3) .card__description,
          .card:nth-child(4) .card__description {
            font-size: 1rem !important;
            line-height: 1.4;
            }
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => {
            const baseClassName = `card flex flex-col h-full flex-shrink-0 gap-2 relative min-h-[200px] w-full max-w-full p-5 rounded-md border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] active:shadow-lg active:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
              enableBorderGlow ? "card--border-glow" : ""
            }`;

            const cardStyle = {
              backgroundColor: '#fff', // fond blanc
              // La couleur de la bordure est dynamique via CSS var
              '--glow-border-rgb': GLOW_RGB[index % GLOW_RGB.length],
              color: '#1e293b', // texte noir
              '--glow-color': GLOW_COLORS[index % GLOW_COLORS.length],
              '--glow-x': '50%',
              '--glow-y': '50%',
              '--glow-intensity': '0',
              '--glow-radius': '5px', // halo ultra-minuscule
            } as React.CSSProperties;

            if (!shouldDisableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={GLOW_COLORS[index % GLOW_COLORS.length].replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, '$1,$2,$3')}
                  enableTilt={shouldDisableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={shouldDisableMagnetism}
                >
                  <div className="card__header flex items-center justify-between">
                    {/* Afficher l'icône Lucide */}
                    <span className="card__icon text-neutral-black">{card.icon}</span>
                  </div>
                  <div className="card__content flex flex-col mt-auto">
                    <h3
                    className={`card__title font-medium text-lg m-0 font-poppins text-neutral-black`}
                    >
                      {card.title}
                    </h3>
                    <p
                    className={`card__description text-sm leading-5 opacity-90 font-poppins text-neutral-black`}
                    >
                      {card.description}
                    </p>
                  </div>
                </ParticleCard>
              );
            }

            return (
            // Ici je veux que le contenue card__header et card__content n'est plus de gap ou de padding ou de magrin entre eux.
              <div
                key={index}
                className={baseClassName}
                style={cardStyle}
                ref={(el) => {
                  if (!el) return;

                  const handleMouseMove = (e: MouseEvent) => {
                    if (shouldDisableAnimations) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    if (!shouldDisableTilt) {
                      const rotateX = ((y - centerY) / centerY) * -10;
                      const rotateY = ((x - centerX) / centerX) * 10;

                      gsap.to(el, {
                        rotateX,
                        rotateY,
                        duration: 0.1,
                        ease: "power2.out",
                        transformPerspective: 1000,
                      });
                    }

                    if (!shouldDisableMagnetism) {
                      const magnetX = (x - centerX) * 0.05;
                      const magnetY = (y - centerY) * 0.05;

                      gsap.to(el, {
                        x: magnetX,
                        y: magnetY,
                        duration: 0.3,
                        ease: "power2.out",
                      });
                    }
                  };

                  const handleMouseLeave = () => {
                    if (shouldDisableAnimations) return;

                    if (!shouldDisableTilt) {
                      gsap.to(el, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.3,
                        ease: "power2.out",
                      });
                    }

                    if (!shouldDisableMagnetism) {
                      gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                      });
                    }
                  };

                  const handleClick = (e: MouseEvent) => {
                    if (!clickEffect || shouldDisableAnimations) return;

                    // Éviter les conflits sur les appareils tactiles
                    if (isTouchDevice()) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const maxDistance = Math.max(
                      Math.hypot(x, y),
                      Math.hypot(x - rect.width, y),
                      Math.hypot(x, y - rect.height),
                      Math.hypot(x - rect.width, y - rect.height),
                    );

                    const ripple = document.createElement("div");
                    ripple.style.cssText = `
                      position: absolute;
                      width: ${maxDistance * 2}px;
                      height: ${maxDistance * 2}px;
                      border-radius: 50%;
                      background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                      left: ${x - maxDistance}px;
                      top: ${y - maxDistance}px;
                      pointer-events: none;
                      z-index: 1000;
                    `;

                    el.appendChild(ripple);

                    gsap.fromTo(
                      ripple,
                      {
                        scale: 0,
                        opacity: 1,
                      },
                      {
                        scale: 1,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => ripple.remove(),
                      },
                    );
                  };

                  // Event handlers tactiles pour tous les appareils
                  const handleTouchStart = (e: TouchEvent) => {
                    // Empêcher la propagation pour éviter les conflits
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // S'assurer que cette carte spécifique est animée
                    gsap.killTweensOf(el);
                    gsap.to(el, {
                      scale: 0.98,
                      duration: 0.1,
                      ease: "power2.out",
                    });
                  };

                  const handleTouchEnd = (e: TouchEvent) => {
                    // Empêcher la propagation pour éviter les conflits
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Retour à l'état normal pour cette carte spécifique
                    gsap.killTweensOf(el);
                    gsap.to(el, {
                      scale: 1,
                      duration: 0.3,
                      ease: "power2.out",
                    });
                  };

                  // Ajouter les event listeners
                  el.addEventListener("mousemove", handleMouseMove);
                  el.addEventListener("mouseleave", handleMouseLeave);
                  el.addEventListener("click", handleClick);
                  
                  // Ajouter les event listeners tactiles pour tous les appareils
                  el.addEventListener('touchstart', handleTouchStart, { passive: false });
                  el.addEventListener('touchend', handleTouchEnd, { passive: false });
                  


                  // Cleanup function
                  return () => {
                    el.removeEventListener("mousemove", handleMouseMove);
                    el.removeEventListener("mouseleave", handleMouseLeave);
                    el.removeEventListener("click", handleClick);
                    el.removeEventListener('touchstart', handleTouchStart);
                    el.removeEventListener('touchend', handleTouchEnd);
                  };
                }}
              >
                <div className="card__header flex items-center justify-between">
                  {/* Afficher l'icône Lucide */}
                  <span className="card__icon text-neutral-black">{card.icon}</span>
                </div>
                {/* Ici je veux que le contenue se dispose naturellement vers le bas. */}
                <div className="card__content flex flex-col mt-auto">
                  <h3
                    className={`card__title font-medium text-lg m-0 font-poppins text-neutral-black ${textAutoHide ? "text-clamp-1" : ""}`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`card__description text-sm leading-5 opacity-90 font-poppins text-neutral-black ${textAutoHide ? "text-clamp-2" : ""}`}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};
