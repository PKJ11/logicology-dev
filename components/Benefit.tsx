import CurvedPhotoGrid from './CurvedPhotoGrid'
import Link from 'next/link'

export default function Benefit() {
	return (
		<section id="benefit" className="section">
			<div className="">
				<div className="bg-brand-coral text-white overflow-hidden">
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
								"https://ik.imagekit.io/pratik2002/ChatGPT%20Image%20Aug%2018,%202025,%2007_19_36%20AM.png?updatedAt=1755481819013"
							]}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}