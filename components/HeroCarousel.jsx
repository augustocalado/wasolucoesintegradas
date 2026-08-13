'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icons from '@/components/Icons';

const SLIDES = [
  {
    src: '/assets/images/iluminacao-teto.jpg',
    alt: 'Instalação de iluminação de teto em loja comercial pela WA Soluções Integradas',
  },
  {
    src: '/assets/images/balcao-computadores.jpg',
    alt: 'Ajuste de balcão com computadores em loja pela WA Soluções Integradas',
  },
  {
    src: '/assets/images/antenas-antifurto.jpg',
    alt: 'Instalação de antenas antifurto na saída da loja pela WA Soluções Integradas',
  },
];

const INTERVALO = 4000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVALO);
  }, [stopTimer]);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  const goTo = useCallback(
    (index) => {
      setCurrent((index + SLIDES.length) % SLIDES.length);
      startTimer();
    },
    [startTimer]
  );

  return (
    <div className="hero-carousel" onMouseEnter={stopTimer} onMouseLeave={startTimer}>
      <div className="hero-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {SLIDES.map((slide, i) => (
          <div className="hero-carousel-slide" key={slide.src}>
            <img
              src={slide.src}
              alt={slide.alt}
              className="hero-image"
              width="600"
              height="400"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel-nav carousel-prev"
        aria-label="Foto anterior"
        onClick={() => goTo(current - 1)}
      >
        <Icons name="chevron-left" size={22} />
      </button>
      <button
        type="button"
        className="carousel-nav carousel-next"
        aria-label="Próxima foto"
        onClick={() => goTo(current + 1)}
      >
        <Icons name="chevron-right" size={22} />
      </button>

      <div className="carousel-dots">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={`carousel-dot${i === current ? ' active' : ''}`}
            aria-label={`Ir para foto ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
