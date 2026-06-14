import { useEffect, useRef, useState } from "react";

export default function CountUp({ end, duration = 2200 }) {
  const [value, setValue] = useState(1);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setHasAnimated(true);

        const startTime = performance.now();

        const animate = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);

          const currentValue = Math.floor(1 + (end - 1) * progress);

          setValue(currentValue);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setValue(end);
          }
        };

        requestAnimationFrame(animate);
      },
      {
        threshold: 0.4,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}
