import Link from "next/link";
import MediaLayout from "./MediaLayout";

export default function Benefit() {
  return (
    <section id="benefit" className="section">
      <div className="">
        <div className="bg-brand-coral text-white overflow-hidden py-7">
          {/* Flex container */}
          <div className="flex flex-col md:flex-row items-center">
            {/* Content on left for larger screens, top for mobile */}
            <div className="flex flex-col w-full md:w-1/2 p-8 sm:p-12 order-2 md:order-1 justify-end ">
              <p className="text-lg">How we </p>
              <h2 className="heading-lg">Help?</h2>
              <p className="mt-4 max-w-xl text-white/90">
                At Logicology we have a bouquet of products and subscriptions that help 
                your child develop Logical Reasoning and Critical Thinking Skills. 
                Choose from books, board games, online puzzles, worksheets or subscriptions.
              </p>
              <div className="mt-6">
                <Link href="#offerings" className="btn btn-light">Learn more</Link>
              </div>
            </div>

            {/* MediaLayout on right for larger screens, bottom for mobile */}
            <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center items-center py-6 md:py-0">
              <MediaLayout
                image="https://ik.imagekit.io/pratik2002/ChatGPT%20Image%20Aug%2018,%202025,%2007_19_36%20AM.png?updatedAt=1755481819013"
                videoSrc="https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}