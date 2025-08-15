import CurvedPhotoGrid from './CurvedPhotoGrid'
import Link from 'next/link'

export default function Community() {
	return (
		<section className="section mt-10">
			<div className="container-padding">
				<div className="bg-brand-teal text-white section-rounded overflow-hidden">
					<div className="grid md:grid-cols-2 items-center">
						<CurvedPhotoGrid
							images={[
								'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
								'https://images.unsplash.com/photo-1526662951004-8280bbdf2dd1?q=80&w=1200&auto=format&fit=crop',
								'https://images.unsplash.com/photo-1460164511696-c3d1e6333d2b?q=80&w=1200&auto=format&fit=crop',
							]}
						/>
						<div className="p-8 sm:p-12">
							<p className="text-lg">Join the</p>
							<h2 className="heading-lg">Community</h2>
							<p className="mt-4 max-w-xl text-white/90">At Logicology we endeavour to make learning fun so that children learn while the play.</p>
							<div className="mt-6">
								<Link href="#footer" className="btn btn-light">Learn more</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}