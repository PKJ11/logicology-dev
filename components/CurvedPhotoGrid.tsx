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
        <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] h-[200px] sm:h-[300px] lg:h-[500px] rounded-3xl overflow-hidden">
          <Image
            src={images[0]}
            alt="photo"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}
