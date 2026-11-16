import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type ElementTag = 'div' | 'section' | 'article' | 'header' | 'nav' | 'footer' | 'h1' | 'h2' | 'p' | 'span';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: ElementTag;
  className?: string;
  style?: React.CSSProperties;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = useMemo(() => motion.create(as), [as]);

  if (prefersReducedMotion) {
    const Tag = as;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
};
