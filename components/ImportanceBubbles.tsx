"use client";
import Image from "next/image";
import { motion, Variants, Transition } from "framer-motion";

export default function ImportanceBubbles() {
  // your bubble & kid assets
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

  // content (same as before)
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

  // attach bubble & kid images by index
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
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" } as Transition,
    },
  };

  return (
    <section className="w-full bg-white mt-10" id="offerings">
      <div className="lg:max-w-[80vw] lg:mx-auto px-6 sm:px-10 md:px-14 py-10 md:py-14">
        <div className="bg-white rounded-4xl border border-slate-200 p-6 sm:p-10 md:p-14">
          <div className="text-center">
            <h3 className="heading-md">
              Our Offerings for <span className="text-slate-900">you.</span>
            </h3>
            <p className="lead mt-2">
              You can choose from a wide variety of formats and engagement types
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mt-10">
              {items.map((it, idx) => (
                <div key={idx} className="flex flex-col items-center gap-5">
                  {/* Animated bubble image with text overlay */}
                  <motion.div className="relative" variants={floatingVariants} animate="float">
                    <div className="relative" style={{ width: 165, height: 165 }}>
                      {/* Bubble PNG */}
                      <Image
                        src={it.bubble}
                        alt={`bubble for ${it.title}`}
                        fill
                        className="object-contain"
                        sizes="165px"
                        priority={false}
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
                      width={120}
                      height={120}
                      className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain"
                      priority={false}
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
