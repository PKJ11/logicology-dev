import CurvedPhotoGrid from './CurvedPhotoGrid'
import Link from 'next/link'

export default function WhyImportant() {
	return (
		<section id="why" className="section mt-10">
			<div className="container-padding">
				<div className="bg-[#D8AE4F] text-[#3F2F14] section-rounded overflow-hidden">
					<div className="grid md:grid-cols-2 items-center">
						<CurvedPhotoGrid
							images={[
								'https://images.unsplash.com/photo-1610093083925-8ef2cbaa2ee5?q=80&w=1600&auto=format&fit=crop',
								'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
								'https://images.unsplash.com/photo-1541534401786-2077eed87a72?q=80&w=1200&auto=format&fit=crop',
							]}
						/>
						<div className="p-8 sm:p-12">
							<p className="text-lg">Why is it</p>
							<h2 className="heading-lg text-[#3F2F14]">Important?</h2>
							<p className="mt-4 max-w-xl">At Logicology we endeavour to make learning fun so that children learn while the play.</p>
							<div className="mt-6">
								<Link href="#benefit" className="btn bg-[#7E5C2E] text-white hover:bg-[#6f4f24]">Learn more</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}