export default function ImportanceBubbles() {
	const items = [
		{ color: '#1F9C8F' },
		{ color: '#D7AD57' },
		{ color: '#E45C48' },
		{ color: '#0D5C5C' },
	]
	return (
		<section className="section mt-10">
			<div className="container-padding">
				<div className="bg-white section-rounded border border-slate-200">
					<div className="px-6 sm:px-10 md:px-14 py-10 md:py-14 text-center">
						<h3 className="heading-md">Why is it <span className="text-slate-900">Important?</span></h3>
						<p className="lead mt-2">At Logicology we endeavour to make learning fun so that children learn while the play.</p>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
							{items.map((it, idx) => (
								<div key={idx} className="flex flex-col items-center gap-3">
									<div className="relative">
										<div className="rounded-full" style={{ width: 140, height: 140, backgroundColor: it.color }} />
										<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent" style={{ borderTopColor: it.color }} />
									</div>
									<p className="text-sm max-w-[160px] text-slate-600">At Logicology we endeavour to make learning fun so that children learn while the play.</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}