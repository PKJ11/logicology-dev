import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
	return (
		<section className="section">
			<div className="container-padding">
				<div className="bg-brand-grayBg section-rounded overflow-hidden">
					<div className="grid md:grid-cols-2 gap-6 items-center">
						<div className="p-8 sm:p-12">
							<p className="text-brand-tealDark font-semibold">Empowering Minds</p>
							<h1 className="heading-xl mt-2">Through STEM Play and
								<span className="block">Logic-Based Learning</span>
							</h1>
							<p className="lead mt-4">At Logicology we endeavour to make learning fun so that children learn while the play.</p>
							<div className="mt-6">
								<Link href="#why" className="btn btn-dark">Learn more</Link>
							</div>
							<div className="mt-8 flex items-center gap-2 text-brand-tealDark">
								<span className="h-2 w-2 rounded-full bg-brand-tealDark"></span>
								<span className="h-2 w-2 rounded-full bg-brand-tealDark/30"></span>
								<span className="h-2 w-2 rounded-full bg-brand-tealDark/30"></span>
								<span className="h-2 w-2 rounded-full bg-brand-tealDark/30"></span>
							</div>
						</div>
						<div className="relative min-h-[320px] md:min-h-[520px]">
							<Image
								src="https://images.unsplash.com/photo-1588072433110-8776b48f0f0d?q=80&w=1600&auto=format&fit=crop"
								alt="Kids playing"
								fill
								className="object-cover"
								priority
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}