"use client";
import Image from "next/image";
import { motion, Variants, Transition } from "framer-motion";

export default function ImportanceBubbles() {
  const items = [
    {
      color: "#1F9C8F",
      img: "https://ik.imagekit.io/pratik2002/ChatGPT%20Image%20Aug%2018,%202025,%2006_29_49%20AM.png?updatedAt=1755479245741",
      text: "If you do not want your kids to spend too much time on screen",
      title: "Board Games & Card Games"
    },
    {
      color: "#D7AD57",
      img: "https://ik.imagekit.io/pratik2002/ChatGPT%20Image%20Aug%2018,%202025,%2006_31_59%20AM.png?updatedAt=1755479197487",
      text: "If you like the age old tradition of books fused with activities that keep the children's minds engaged and yours free",
      title: "Activity Books"
    },
    {
      color: "#E45C48",
      img: "https://ik.imagekit.io/pratik2002/ChatGPT%20Image%20Aug%2018,%202025,%2006_29_56%20AM.png?updatedAt=1755479216126",
      text: "Coming soon - Continuous comprehensive assessment of your child's progress in the world of Logic",
      title: "Evaluation Packs"
    },
    {
      color: "#0D5C5C",
      img: "https://ik.imagekit.io/pratik2002/ChatGPT%20Image%20Aug%2018,%202025,%2006_29_52%20AM.png?updatedAt=1755479231450",
      text: "Hands-on learning materials that develop critical thinking through tactile experiences",
      title: "Learning Kits"
    }
  ];

  // Properly typed animation variants
  const floatingVariants: Variants = {
    float: {
      y: ["0%", "-10%", "0%", "5%", "0%"],
      x: ["0%", "3%", "0%", "-3%", "0%"],
      rotate: ["0deg", "2deg", "0deg", "-2deg", "0deg"],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      } as Transition,
    },
  };

  return (
    <section className="section mt-10" id="offerings">
      <div className="container-padding">
        <div className="bg-white section-rounded border border-slate-200">
          <div className="px-6 sm:px-10 md:px-14 py-10 md:py-14 text-center">
            <h3 className="heading-md">
              Our Offerings for <span className="text-slate-900">you.</span>
            </h3>
            <p className="lead mt-2">
              You can choose from a wide variety of formats and engagement types
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mt-10">
              {items.map((it, idx) => (
                <div key={idx} className="flex flex-col items-center gap-5">
                  {/* Animated Bubble with text inside */}
                  <motion.div 
                    className="relative"
                    variants={floatingVariants}
                    animate="float"
                  >
                    <div
                      className="
                        rounded-full text-white flex flex-col items-center justify-center p-4
                        text-center shadow-sm relative
                      "
                      style={{
                        width: 165,
                        height: 165,
                        backgroundColor: it.color,
                      }}
                    >
                      <h4 className="font-bold text-sm mb-1">{it.title}</h4>
                      <p className="text-xs leading-tight">{it.text}</p>
                    </div>
                    {/* tail */}
                    <div
                      className="
                        absolute -bottom-3 left-1/2 -translate-x-1/2
                        w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px]
                        border-l-transparent border-r-transparent
                      "
                      style={{ borderTopColor: it.color }}
                    />
                  </motion.div>

                  {/* Larger Kid image below bubble with subtle animation */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Image
                      src={it.img}
                      alt="child illustration"
                      width={120}
                      height={120}
                      className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain"
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}