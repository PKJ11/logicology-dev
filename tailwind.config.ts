import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					teal: '#0A8A80',
					tealDark: '#0B3F44',
					coral: '#E45C48',
					gold: '#D7AD57',
					grayBg: '#F5F6F7'
				}
			},
			borderRadius: {
				'4xl': '2rem'
			},
			boxShadow: {
				soft: '0 10px 30px rgba(0,0,0,0.08)'
			}
		}
	},
	plugins: [],
}
export default config