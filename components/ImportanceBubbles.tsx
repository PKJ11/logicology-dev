"use client";
import Image from "next/image";
import { motion, Variants, Transition } from "framer-motion";

export default function ImportanceBubbles() {
  // bubble & kid assets
  const bubbleImgs = [
    "https://ik.imagekit.io/pratik2002/BUBBLE%201.png?updatedAt=1757035882810",
    "https://ik.imagekit.io/pratik2002/BUBBLE%202.png?updatedAt=1757035882839",
    "https://ik.imagekit.io/pratik2002/BUBBLE%203.png?updatedAt=1757035883281",
    "https://ik.imagekit.io/pratik2002/BUBBLE%204.png?updatedAt=1757035883179",
  ];
  const kidImgs = [
    "https://ik.imagekit.io/pratik2002/KID%201.png?updatedAt=1757035882681",
    "https://ik.imagekit.io/pratik2002/KID%202.png?updatedAt=1757035882826",
    "https://ik.imagekit.io/pratik2002/KID%203.png?updatedAt=1757035882763",
    "https://ik.imagekit.io/pratik2002/KID%204.png?updatedAt=1757035886499",
  ];

  const baseItems = [
    {
      title: "Board Games & Card Games",
      text: "If you do not want your kids to spend too much time on screen",
    },
    {
      title: "Activity Books",
      text: "If you like the age old tradition of books fused with activities that keep the children's minds engaged and yours free",
    },
    {
      title: "Evaluation Packs",
      text: "Coming soon - Continuous comprehensive assessment of your child's progress in the world of Logic",
    },
    {
      title: "Learning Kits",
      text: "Hands-on learning materials that develop critical thinking through tactile experiences",
    },
  ];

  const items = baseItems.map((it, i) => ({
    ...it,
    bubble: bubbleImgs[i],
    kid: kidImgs[i],
  }));

  // same animation
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
    // gradient background like the other section
    <section className="w-full bg-brand-hero" id="offerings">
      <div className="lg:max-w-[80vw] mx-auto px-3 sm:px-5 py-12 sm:py-16 md:py-20">
        {/* white container */}
        <div className="rounded-[22px] bg-white p-6 sm:p-10 shadow-soft">
          <div className="text-center mb-4">
            <h2 className="headingstyle font-extrabold text-brand-teal mb-3 font-heading">
              Our Offerings for you
            </h2>
            <p className="text-lg sm:text-xl text-brand-tealDark/80 max-w-3xl mx-auto font-sans">
              You can choose from a wide variety of formats and engagement
              types.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mt-10">
            {items.map((it, idx) => (
              <div key={idx} className="flex flex-col items-center gap-5">
                {/* Animated bubble image */}
                <motion.div
                  className="relative"
                  variants={floatingVariants}
                  animate="float"
                >
                  <div className="relative" style={{ width: 300, height: 300 }}>
                    <Image
                      src={it.bubble}
                      alt={`bubble for ${it.title}`}
                      fill
                      className="object-contain w-[200px] h-[200px]
                            md:w-[250px] md:h-[250px]
                            lg:w-[320px] lg:h-[320px]
                            xl:w-[340px] xl:h-[340px]"
                    />
                  </div>
                </motion.div>

                {/* Kid image below bubble */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Image
                    src={it.kid}
                    alt={`illustration for ${it.title}`}
                    width={90}
                    height={90}
                    className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] object-contain"
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
