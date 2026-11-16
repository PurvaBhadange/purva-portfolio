import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface AnimatedCharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0" aria-hidden="true">
        {char === ' ' ? '\u00A0' : char}
      </span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 text-[#D7E2EA]"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const totalChars = text.length;
  let charCounter = 0;

  return (
    <p ref={containerRef} className={className} style={style}>
      {words.map((word, wordIndex) => {
        const wordChars = word.split('');
        const isLastWord = wordIndex === words.length - 1;
        const wordElements = (
          <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIndex) => {
              const start = charCounter / totalChars;
              const end = (charCounter + 1) / totalChars;
              charCounter++;
              return (
                <AnimatedChar
                  key={`char-${wordIndex}-${charIndex}`}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </span>
        );

        if (!isLastWord) {
          charCounter++; // account for the space character
          return (
            <React.Fragment key={`frag-${wordIndex}`}>
              {wordElements}{' '}
            </React.Fragment>
          );
        }

        return wordElements;
      })}
    </p>
  );
};
