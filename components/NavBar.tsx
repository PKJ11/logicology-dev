"use client";

import Link from 'next/link'
import { useState } from 'react'
import { FiMenu, FiX, FiShoppingCart, FiSearch, FiLogIn } from 'react-icons/fi'

const navItems = [
	{ name: 'Home', href: '/' },
	{ name: 'Games', href: '/games' },
	{ name: 'Books', href: '/books' },
	{ name: 'Subscriptions', href: '/subscriptions' },
	{ name: 'About Us', href: '/about' },
]

export default function NavBar() {
	const [open, setOpen] = useState(false)
	return (
		<header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
			<div className="container-padding">
				<div className="flex items-center justify-between py-3">
					<div className="flex items-center gap-3">
						<Link href="/" className="flex items-center gap-2">
							<div className="h-9 w-9 rounded-full bg-brand-tealDark grid place-items-center text-white font-bold">L</div>
							<span className="font-semibold text-lg">Logicology</span>
						</Link>
					</div>
					<nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
						{navItems.map((item) => (
							<Link key={item.name} href={item.href} className="hover:text-brand-tealDark">
								{item.name}
							</Link>
						))}
					</nav>
					<div className="hidden md:flex items-center gap-5 text-slate-700">
						<Link href="/login" className="hover:text-brand-tealDark flex items-center gap-1"><FiLogIn /> <span>Login</span></Link>
						<Link href="/search" aria-label="Search" className="hover:text-brand-tealDark"><FiSearch /></Link>
						<Link href="/cart" aria-label="Cart" className="hover:text-brand-tealDark"><FiShoppingCart /></Link>
					</div>
					<button onClick={() => setOpen((s) => !s)} className="md:hidden text-2xl p-2" aria-label="Toggle menu">
						{open ? <FiX /> : <FiMenu />}
					</button>
				</div>
			</div>
			{open && (
				<div className="md:hidden border-t border-slate-200 bg-white">
					<div className="container-padding py-4 flex flex-col gap-4">
						{navItems.map((item) => (
							<Link key={item.name} href={item.href} onClick={() => setOpen(false)} className="py-1">
								{item.name}
							</Link>
						))}
						<div className="flex items-center gap-5 pt-2 text-slate-700">
							<Link href="/login" className="hover:text-brand-tealDark flex items-center gap-2"><FiLogIn /> <span>Login</span></Link>
							<Link href="/search" aria-label="Search" className="hover:text-brand-tealDark"><FiSearch /></Link>
							<Link href="/cart" aria-label="Cart" className="hover:text-brand-tealDark"><FiShoppingCart /></Link>
						</div>
					</div>
				</div>
			)}
		</header>
	)
}