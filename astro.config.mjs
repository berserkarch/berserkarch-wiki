// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://wiki.berserkarch.org",

  // adapter: vercel(),
  integrations: [
    starlight({
      title: "Berserk Arch",
      customCss: ["./src/styles/custom.css"],
      head: [
        {
          tag: "script",
          content: `if (!localStorage.getItem('starlight-theme')) { localStorage.setItem('starlight-theme', 'dark'); }`,
        },
      ],
      logo: {
        src: "./src/assets/banner-logo.svg",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/berserkarch/",
        },
      ],
      sidebar: [
        {
          label: "Installation",
          items: [
            { label: "Requirements", slug: "installation/requirements" },
            {
              label: "Install on VirtualBox (Guest)",
              slug: "installation/virtualbox",
            },
            { label: "Install on VMware (Guest)", slug: "installation/vmware" },
            {
              label: "Installing the system",
              slug: "installation/install",
            },
          ],
        },
        {
          label: "Containers",
          items: [{ label: "Docker", slug: "containers/docker" }],
        },
        {
          label: "Tools and Profiles",
          items: [{ label: "Berserk", slug: "tools-and-profiles/berserk" }],
        },
        {
          label: "Keyboard Shortcuts",
          items: [
            { label: "HyprLand", slug: "keyboard-shortcuts/hyprland-keybinds" },
            { label: "OpenBox", slug: "keyboard-shortcuts/openbox-keybinds" },
            { label: "i3wm", slug: "keyboard-shortcuts/i3wm-keybinds" },
            { label: "tmux", slug: "keyboard-shortcuts/tmux-keybinds" },
          ],
        },
        {
          label: "ChangeLogs",
          items: [{ autogenerate: { directory: "changelogs" } }],
        },
      ],
    }),
  ],

  adapter: vercel(),
});
