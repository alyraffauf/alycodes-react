---
title: Syncing EPP with power-profiles-daemon on modern laptops
date: 2024-01-30
description: Saving battery life & unlocking greater performance by syncing Intel & AMD CPU Energy Performance Preferences with system power profiles.
keywords: linux, power-profiles-daemon, battery life, fedora
cover: imgs/pp-to-epp.webp
tags:
  - "linux"
  - "power-profiles-daemon"
  - "amd"
  - "intel"
  - "python"
---

I was recently in the market for a laptop, and got a great deal on an Asus ROG Zephyrus G14 from Best Buy. It's a powerful machine, with an AMD Ryzen 7840HS processor, 16GB RAM, and an Nvidia RTX 4060, and, at first, seemed to work well enough under Linux, my preferred operating system. In the month-ish that I owned it, I discovered a wonderful community of folks actively working on developing and supporting [Linux on Asus laptops](https://asus-linux.org/), filling in the userspace gaps and patching the kernel as needed to deliver a somewhat workable experience.

After weeks of diving through forums, the asus-linux discord, and random bug trackers, I found one of the biggest issues on modern AMD laptops involves the `amd-pstate` driver's exposure of the processor's energy performance preference. EPP works like a far more intelligent and impactful version of old school CPU governors. The `amd-pstate` kernel driver [docs](https://docs.kernel.org/admin-guide/pm/amd-pstate.html) explain this further, but the gist is EPP is the key to getting the most performance _and_ the best battery life out of your laptop CPU.

The problem is that the version of `power-profiles-daemon` currently being shipped by most distros doesn't automatically adjust the EPP based on the user's stated performance profile, leading to increased battery usage, particularly at idle or when doing simple tasks. Power-profiles-daemon is unable to use the `amd-pstate` driver, so the setting never gets adjusted, leading to mismatched performance and cooling choices between `platform_profile` and `amd-pstate` on modern AMD laptops. Luckily, the community—particularly Marcin [@marcinx64](https://github.com/marcinx64)—have developed a simple Python [daemon](https://github.com/marcinx64) to automatically adjust the EPP based on the chosen power profile.

Unfortunately, after a series of hardware problems (severe IPS backlight bleed), an exchange, and standard Nvidia buggyness (at least on Linux) later, I ended up returning the Asus for a Lenovo Yoga 9i with an Intel Core i7 1360P, 16GB RAM, and integrated graphics. I know, totally different product category. Oh well. But as it turns out, the `intel-pstate` driver is also affected by the same issue in `power-profiles-daemon`, but no utility exists for Intel users. Luckily, the interfaces exposed by the kernel for controlling EPP are basically the same, so I've forked Marcin's utility to provide a [temporary solution](https://github.com/alychace/pp-to-epp) for Intel and AMD users alike.

There's an open [issue](https://gitlab.freedesktop.org/upower/power-profiles-daemon/-/issues/107) in `power-profiles-daemon` to allow it to leverage both `platform_profile` and `amd-pstate`/`intel-pstate` simultaneously to deliver the best performance or power savings possible. Until then, this daemon provides a solid workaround for pstate power control for GNU/Linux users. For my G14, and now my Yoga 9i, this means getting battery life in Fedora 39 that meets or exceeds Windows 11. It should also work under other distros that use systemd (sorry protest distros!) and power-profiles-daemon.

UPDATE: Should be fixed in the latest version of `power-profiles-daemon`. :)
