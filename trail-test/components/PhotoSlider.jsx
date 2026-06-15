import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "../src/css/PhotoSlider.module.css";

import pic1 from "../src/assets/pic1.jpg";
import pic2 from "../src/assets/pic2.jpg";
import pic3 from "../src/assets/pic3.jpg";
import pic4 from "../src/assets/pic4.jpg";
import pic5 from "../src/assets/pic5.jpg";

import pic1_m from "../src/assets/pic1_m.png";
import pic2_m from "../src/assets/pic2_m.png";
import pic3_m from "../src/assets/pic3_m.png";
import pic4_m from "../src/assets/pic4_m.png";
import pic5_m from "../src/assets/pic5_m.png";

const photoSlides = [
  { desktop: pic1, mobile: pic1_m },
  { desktop: pic2, mobile: pic2_m },
  { desktop: pic3, mobile: pic3_m },
  { desktop: pic4, mobile: pic4_m },
  { desktop: pic5, mobile: pic5_m },
];

export default function PhotoSlider({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767.98px)");

    setIsMobile(media.matches);

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <section className={styles.photoSlider}>
      <div className={styles.photoSliderLayout}>
        <div />

        <div className={styles.photoSliderImageCol}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            speed={1000}
            loop
            className={styles.photoSliderSwiper}
          >
            {photoSlides.map((slide) => (
              <SwiperSlide key={slide.desktop}>
                <img
                  src={isMobile ? slide.mobile : slide.desktop}
                  alt=""
                  className={styles.photoSliderImage}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.photoSliderEdgeGradient} />
        </div>
      </div>

      <div className={styles.photoSliderTextOverlay}>
        <div className="container-fluid">
          <div className="row">
            <div className="offset-lg-2 col-lg-8 px-0">
              <div className={styles.photoSliderContent}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
