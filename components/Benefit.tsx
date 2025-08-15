import CurvedPhotoGrid from './CurvedPhotoGrid'
import Link from 'next/link'

export default function Benefit() {
	return (
		<section id="benefit" className="section mt-10">
			<div className="container-padding">
				<div className="bg-brand-coral text-white section-rounded overflow-hidden">
					<div className="grid md:grid-cols-2 items-center">
						<div className="p-8 sm:p-12 order-2 md:order-1">
							<p className="text-lg">How you</p>
							<h2 className="heading-lg">Benefit?</h2>
							<p className="mt-4 max-w-xl text-white/90">At Logicology we endeavour to make learning fun so that children learn while the play.</p>
							<div className="mt-6">
								<Link href="#importance" className="btn btn-light">Learn more</Link>
							</div>
						</div>
						<CurvedPhotoGrid
							reverse
							images={[
								'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?q=80&w=1600&auto=format&fit=crop',
								'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop',
								'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1200&auto=format&fit=crop',
							]}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}