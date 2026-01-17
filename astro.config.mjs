// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
	site: "https://wiki.berserkarch.org",
	integrations: [
		starlight({
			title: 'Berserk Arch',
			customCss: ['./src/styles/custom.css'],
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
						{ label: 'Install on VMware (Guest)', slug: 'installation/vmware' },
						{ label: 'Installing the system', slug: 'installation/installation' },
					],
				},
				{
					label: 'Containers',
					items: [
						{ label: 'Docker', slug: 'containers/docker' },
					],
				},
				{
					label: 'Troubleshoot and Management',
					items: [
						{ label: 'Btweak', slug: 'troubleshoot-and-management/btweak' },
					],
				},
				{
					label: 'ChangeLogs',
					autogenerate: { directory: 'changelogs' },
				},
			],
		}),
	],
	adapter: vercel(),
});
