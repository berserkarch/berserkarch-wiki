---
title: berserk — Tool Manager
description: berserk is the offensive security tool manager built into BerserkArch. Manage your hacking toolkit, install from original sources, and build your own custom loadout.
---

`berserk` is the tool manager that ships pre-installed on every BerserkArch system. It handles installing, updating, and removing offensive security tools — pulling from their original sources so you always get the latest version: PyPI, crates.io, GitHub releases, RubyGems, npm, and pacman. It also manages a Docker container catalog for GUI tools and isolated environments.

You don't need to set anything up — on BerserkArch, `berserk` is ready to use out of the box.

---

## First steps

Run `berserk doctor` to confirm all backends are available, then `berserk sync` to pull the latest curated catalog:

```bash
berserk doctor    # check pipx, cargo, go, gem, npm are installed
berserk sync      # pull the latest tools catalog
```

From there, explore what's available:

```bash
berserk list                   # browse every tool in the catalog
berserk list -p                # list available profiles
berserk list -c                # list available categories
berserk list -d                # browse the Docker container catalog
berserk search bloodhound      # search by name, alias, category, or description
```

---

## Installing tools

Install a specific tool by name — aliases work too:

```bash
berserk install <tool>
berserk install <tool> <tool> <tool>   # multiple at once
```

Install an entire profile in one shot — run `berserk list -p` to see what's available:

```bash
berserk install --profile <name>
```

Install everything in a category — run `berserk list -c` to see what's available:

```bash
berserk install --category <name>
berserk install --category <name> --category <name>    # combine multiple
```

Install the full catalog:

```bash
berserk install --all
```

Not sure what you're getting? Preview first with `--dry-run`:

```bash
berserk install --profile <name> --dry-run
berserk install --all --dry-run
```

---

## Updating and removing

Keep everything current:

```bash
berserk update                       # update all backends at once
berserk update <tool>                # update a specific tool
berserk update --profile <name>
berserk update --backend cargo       # update only cargo-installed tools
```

Remove a tool:

```bash
berserk remove <tool>
berserk remove <tool> <tool>
```

---

## Searching and browsing

```bash
berserk search <query>                 # search across names, aliases, categories, descriptions
berserk search -c <category>           # filter by category
berserk search -p <profile>            # search within a profile
berserk search -i                      # only show installed tools
berserk search --available             # only show tools not yet installed
berserk search info <tool>             # show source, repo, and installer details for one tool
```

---

## Profiles and categories

Profiles are curated collections of tools grouped by use case — things like an OSCP loadout, an AD-attacks kit, or a web testing profile. Categories are finer-grained labels (recon, exploitation, lateral-movement, etc.) that tools are tagged with.

Use the CLI to see what's currently in the catalog:

```bash
berserk list -p      # all profiles with member counts
berserk list -c      # all categories
```

You can also define your own — see [Crafting your own toolkit](#crafting-your-own-toolkit).

---

## Docker containers

`berserk` ships a curated container catalog alongside the tool catalog. Run containers directly from the catalog without needing to remember image names or flags:

```bash
berserk list -d                              # browse the container catalog
berserk search <query>                       # search containers by name
berserk run <name>                           # run a container (replaces current process)
berserk run <name> -t                        # open in a new kitty terminal window
berserk run <name> -f "--rm --name foo"      # inject extra docker run flags
```

Volume paths under `~/berserk/` are created automatically before the container launches. Run `berserk --docker-clean` to stop all containers, remove all images, and wipe the local volume data.

---

## Crafting your own toolkit

The entire catalog is yours to extend. berserk reads from `/usr/share/berserk` by default (override with `--config <dir>`), and everything in that directory is plain YAML you can edit or add to. You can build profiles for specific engagements, add tools that aren't in the catalog, define your own categories, and wire up containers for your workflow.

### Adding your own profile

Open `/usr/share/berserk/profiles/profiles.yaml` and add your entry:

```yaml
profiles:
  - name: iot-assessment
    description: "IoT and firmware engagement loadout"

  - name: full-engagement
    description: "Everything I need on a red team op"
    includes: [ad-attacks, web, post-exploitation, credentials, recon]
```

A profile can include other profiles via `includes` — all members are resolved automatically. Install it with:

```bash
berserk install --profile iot-assessment
```

### Adding your own categories

Open `/usr/share/berserk/categories.yaml` and add your labels:

```yaml
categories:
  - name: iot
    description: "IoT and embedded device testing"
  - name: firmware
    description: "Firmware analysis and extraction"
```

### Adding your own tools

Create a new YAML file under `/usr/share/berserk/packages/` — for example `packages/my-tools.yaml`. All files in that directory are merged automatically:

```yaml
tools:
  - name: mytool
    description: "Short description"
    installer: pipx
    repo: author/mytool
    category: [firmware, iot]
    profiles: [iot-assessment]

  - name: anothertool
    description: "Another tool"
    installer: cargo
    package: anothertool
    category: [recon]
    profiles: [iot-assessment]
    aliases: [at]
```

#### Installer quick reference

| Installer | What it uses | Key fields |
|---|---|---|
| `pipx` | Python/PyPI | `repo: author/project` or `package: pypi-name` |
| `go` | Go modules | `repo: projectdiscovery/nuclei/v3/cmd/nuclei` |
| `cargo` | Rust/crates.io | `package: crate-name` (defaults to `name`) |
| `gem` | RubyGems | `package: gem-name` (defaults to `name`) |
| `npm` | npm | `package: npm-name` (defaults to `name`) |
| `binary` | GitHub releases | `repo: owner/repo` + `asset_pattern: linux-amd64` |
| `system` | pacman / apt | `arch_package: pkgname` and/or `debian_package: pkgname` |
| `custom` | Shell commands | `steps: [cmd1, cmd2, ...]` |

#### Common optional fields

| Field | Effect |
|---|---|
| `description` | One-line description shown in `list` and `search` |
| `category` | List of categories — must exist in `categories.yaml` |
| `profiles` | List of profiles — must exist in `profiles.yaml` |
| `aliases` | Alternative install names (e.g. `nxc` for `netexec`) |
| `depends.arch` | pacman packages to install before this tool |
| `depends.debian` | apt packages to install before this tool (also Kali/Parrot) |
| `python_version` | pipx only — pin the Python version |

#### One entry per installer type

```yaml
tools:
  # pipx — Python tool from PyPI or a GitHub repo
  - name: mytool
    installer: pipx
    repo: author/mytool
    category: [exploitation]
    profiles: [my-profile]

  # go — installed via go install
  - name: gobin
    installer: go
    repo: author/gobin/cmd/gobin
    category: [recon]

  # cargo — Rust crate
  - name: rusttool
    installer: cargo
    package: rusttool
    category: [recon]

  # gem — Ruby gem
  - name: rubytool
    installer: gem
    package: rubytool
    category: [exploitation]
    aliases: [rt]

  # binary — static release downloaded from GitHub
  - name: mytool-client
    installer: binary
    repo: author/mytool
    asset_pattern: mytool-client_linux
    category: [c2]

  # system — pacman or apt
  - name: systool
    installer: system
    arch_package: systool
    debian_package: systool
    category: [recon]

  # custom — arbitrary shell steps
  - name: my-internal-tool
    installer: custom
    steps:
      - "git clone https://github.com/myorg/tool /opt/tool"
      - "cd /opt/tool && make install"
```

### Adding your own containers

Create a YAML file under `/usr/share/berserk/containers/`. Categories referenced must exist in `categories.yaml`.

```yaml
- name: my-kali
  description: "Custom Kali with my config baked in"
  category: ["linux-cli"]
  command: "docker pull myuser/kali-custom"
  run: "docker run -it --rm --network host -v ~/berserk/containers/kali:/root/data myuser/kali-custom /bin/bash"
  runtime_comments:
    - "- Data persists at ~/berserk/containers/kali between sessions"
```

---

## Configuration

The config file lives at `/usr/share/berserk/config.yaml`. All keys are optional — omit anything you don't need.

```yaml
github_token: ""           # set this to avoid GitHub API rate limits when using binary installer
install_dir: /usr/local/bin
parallel: true             # install multiple tools at once
verbose: false             # stream installer output to terminal
docker_data_dir: ~/berserk
```

| Key | Effect |
|---|---|
| `github_token` | GitHub personal access token — raises the download rate limit from 60 to 5000 req/h. `$GITHUB_TOKEN` in the environment overrides this. |
| `install_dir` | Where downloaded binaries land. berserk uses `sudo` if the directory isn't user-writable. |
| `parallel` | Run installs and updates concurrently. System package manager calls are still serialized to avoid lock conflicts. |
| `verbose` | Show raw output from pip, cargo, go, etc. instead of capturing it. Useful for debugging a failing install. |
| `docker_data_dir` | Root path for container volume mounts. The `--docker-clean` flag deletes `<docker_data_dir>/{docker,containers}`. |

**Global flags** (pass on any command):

```bash
berserk --config /path/to/myconfig install netexec   # use a different config directory
berserk -y install --profile recon                   # skip pacman/apt confirmation prompts
NO_COLOR=1 berserk list                              # disable ANSI colors
```

---

## How berserk tracks what's installed

Every successful install is recorded in `~/.local/state/berserk/installed.yaml`. This is how `search --installed` and `search --available` know what's on your system — rather than relying on a `$PATH` lookup, which doesn't work for tools whose installed binary name doesn't match the package name.

If you installed a tool before berserk knew about it, PATH lookup works as a fallback.

System fallback installs (tools not in the catalog, installed via pacman/apt) are not tracked — berserk doesn't claim ownership of your OS packages.

---

## Installing berserk on another system

berserk comes pre-installed on BerserkArch. For Kali, Parrot, or any Arch-based system:

**Prerequisites — Arch Linux**
```bash
sudo pacman -Syy rust cargo nodejs npm ruby git python-pipx go pkgconf openssl base-devel cmake make --noconfirm
```

**Prerequisites — Kali Linux**
```bash
sudo apt install golang-go cargo pipx gem ruby-dev make openssl libssl-dev -y
```

**Install**
```bash
git clone https://github.com/thehackersbrain/berserk
cd berserk
make install
berserk sync
```
