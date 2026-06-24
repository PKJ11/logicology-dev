"use client";
import HeroSlider from "./HeroSlider";

export default function Hero() {
  return (
    <section className="section my-10">
      <div className="container-padding">
        <div className="section-rounded relative overflow-hidden">
          <HeroSlider />
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
      `}</style>
    </section>
  );
}
