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

const photoSlides = [pic1, pic2, pic3, pic4, pic5];

export default function PhotoSlider({
    children
}) {
  return (
    <section className={styles.photoSlider}>
      <div className={styles.photoSliderLayout}>
        {/* Empty 35% column */}
        <div />

        {/* 65% image column */}
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
            {photoSlides.map((src) => (
              <SwiperSlide key={src}>
                <img
                  src={src}
                  alt=""
                  className={styles.photoSliderImage}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.photoSliderEdgeGradient} />
        </div>
      </div>

      {/* TEXT OVERLAY */}
      <div className={styles.photoSliderTextOverlay}>
        <div className="container-fluid">
          <div className="row">
            <div className="offset-lg-2 col-lg-8 px-0">
              <div className={styles.photoSliderContent}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}