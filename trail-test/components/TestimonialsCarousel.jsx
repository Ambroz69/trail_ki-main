import useEmblaCarousel from "embla-carousel-react";

function TestimonialsCarousel({ testimonials }) {
  const [emblaRef] = useEmblaCarousel({
    align: "center",
    loop: false,
    dragFree: false,
  });

  return (
    <div className="overflow-hidden px-4" ref={emblaRef}>
      <div className="flex gap-4">
        {testimonials.map((item, index) => (
          <div key={index} className="flex-[0_0_82%] min-w-0">
            <TestimonialCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
