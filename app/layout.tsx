import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'Logicology',
	description: 'Empowering Minds Through STEM Play and Logic-Based Learning',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	)
}