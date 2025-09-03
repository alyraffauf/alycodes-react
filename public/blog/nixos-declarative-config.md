---
title: "NixOS: Declarative System Configuration"
date: "2024-01-10"
tags: ["NixOS", "Linux", "DevOps", "Functional", "Configuration"]
description: "Why I switched to NixOS and how declarative configuration changed my workflow"
---

# NixOS: Declarative System Configuration

After years of managing dotfiles and system configurations across multiple machines, I discovered NixOS - and it completely changed how I think about system administration.

## What is NixOS?

NixOS is a Linux distribution built on the Nix package manager. Everything - packages, services, system configuration - is declared in Nix expressions.

## My Configuration Structure

```nix
{
  # System configuration
  networking.hostName = "workstation";
  services.openssh.enable = true;

  # User packages
  users.users.aly.packages = with pkgs; [
    firefox
    vscode
    git
  ];
}
```

## Benefits I've Experienced

1. **Reproducible environments** - My entire system config is in git
2. **Rollbacks** - Easy to revert if something breaks
3. **Multiple environments** - Dev/prod configs are just different expressions
4. **Atomic upgrades** - All or nothing system updates

## The Learning Curve

I won't lie - Nix has a steep learning curve. The functional language takes getting used to, and debugging can be challenging.

But once it clicks, you realize you can never go back to imperative system management.

## Resources

- [NixOS Manual](https://nixos.org/manual)
- [Nix Pills](https://nixos.org/guides/nix-pills/)
- My dotfiles: [git.aly.codes/nixos-config](https://git.aly.codes/nixos-config)