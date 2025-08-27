import Image from 'next/image'

export default function CurvedPhotoGrid({
  images,
  reverse = false,
}: {
  images: string[]
  reverse?: boolean
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 p-6 sm:p-8 md:p-10 ${
        reverse ? 'order-2' : ''
      }`}
    >
      <div className="col-span-2 flex justify-center">
        <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] h-auto rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <div className="relative w-full h-0 pb-[100%]"> {/* Square aspect ratio container */}
            <Image
              src={images[0]}
              alt="photo"
              fill
              className="object-contain p-2" // Changed to object-contain and added padding
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 500px"
            />
          </div>
        </div>
      </div>
    </div>
  )
}