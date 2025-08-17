import Link from 'next/link'
import { FiInstagram, FiFacebook, FiTwitter, FiPhone } from 'react-icons/fi'

const SiteFooter = () => {
	return (
		<footer id="footer" className="">
			<div className="bg-brand-tealDark text-white">
				<div className="container-padding py-12">
					<div className="grid md:grid-cols-4 gap-10 items-start">
						<div className="flex items-center gap-3 md:col-span-1">
							<div className="h-12 w-12 rounded-full bg-white/10 grid place-items-center text-white font-bold">L</div>
							<div className="text-xl font-semibold">Logicology</div>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
							<div>
								<ul className="space-y-3 text-sm">
									<li><Link href="/about" className="hover:underline">About Us</Link></li>
									<li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
									<li><Link href="/shop" className="hover:underline">Shop</Link></li>
									<li><Link href="/collections" className="hover:underline">Collections</Link></li>
								</ul>
							</div>
							<div>
								<ul className="space-y-3 text-sm">
									<li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
									<li><Link href="/mission" className="hover:underline">Our Mission</Link></li>
								</ul>
							</div>
							<div>
								<p className="text-sm font-semibold">Follow us or contact</p>
								<div className="flex items-center gap-3 mt-3 text-lg">
									<Link aria-label="Instagram" href="#" className="bg-white/10 rounded-full p-2"><FiInstagram /></Link>
									<Link aria-label="Facebook" href="#" className="bg-white/10 rounded-full p-2"><FiFacebook /></Link>
									<Link aria-label="Twitter" href="#" className="bg-white/10 rounded-full p-2"><FiTwitter /></Link>
									<Link aria-label="Phone" href="#" className="bg-white/10 rounded-full p-2"><FiPhone /></Link>
								</div>
							</div>
						</div>
					</div>
					</div>
			</div>
			<div className="bg-slate-100 text-slate-600 text-center text-sm py-4">
				Copyright © by Logicology.com 2025. All rights reserved.
			</div>
		</footer>
	)
}

export default SiteFooter