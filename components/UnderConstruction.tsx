import Link from 'next/link'

export default function UnderConstruction({ title }: { title: string }) {
	return (
		<section className="min-h-[60vh] grid place-items-center bg-brand-grayBg">
			<div className="text-center p-10">
				<h1 className="heading-lg">{title}</h1>
				<p className="lead mt-2">This page is under construction. Check back soon.</p>
				<div className="mt-6">
					<Link className="btn btn-primary" href="/">Go Home</Link>
				</div>
			</div>
		</section>
	)
}