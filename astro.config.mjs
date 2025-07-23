// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Berserk Arch',
			logo: {
				src: './src/assets/banner-logo.svg',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/berserkarch/' }],
			sidebar: [
				{
					label: 'Installation',
					items: [
						{ label: 'Requirements', slug: 'installation/requirements' },
						{ label: 'Install on VirtualBox (Guest)', slug: 'installation/virtualbox' },
						{ label: 'Installing the system', slug: 'installation/installation' },
					],
				},
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'Changelogs',
					autogenerate: { directory: 'changelogs' },
				},
			],
		}),
	],
});
