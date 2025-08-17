import Image from 'next/image'

export default function CurvedPhotoGrid({ images, reverse = false }: { images: string[]; reverse?: boolean }) {
	return (
		<div className={`grid grid-cols-2 gap-4 p-6 sm:p-8 md:p-10 ${reverse ? 'order-2' : ''}`}>
			<div className="col-span-2 rounded-3xl overflow-hidden">
				<div className="relative h-48 sm:h-64 md:h-72">
					<Image src={images[0]} alt="photo" fill className="object-cover" />
				</div>
			</div>
			
		</div>
	)
}