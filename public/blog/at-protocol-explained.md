---
title: "Understanding the AT Protocol: Bluesky's Foundation"
date: "2024-01-05"
tags: ["AT Protocol", "Bluesky", "Decentralization", "Social Media", "Federation"]
description: "Exploring the technical architecture behind Bluesky's decentralized social network"
---

# Understanding the AT Protocol: Bluesky's Foundation

With Twitter's changes pushing users to explore alternatives, Bluesky has emerged as a compelling option. But what makes it different isn't just the interface - it's the underlying AT Protocol.

## What is the AT Protocol?

The Authenticated Transfer Protocol (AT Protocol) is designed to be a foundation for decentralized social applications. Unlike Mastodon's ActivityPub, AT Protocol takes a different approach to federation.

## Key Concepts

### Personal Data Servers (PDS)
Your data lives on a Personal Data Server - think of it as your personal cloud for social data.

### Distributed Identity (DID)
Your identity isn't tied to a server. You can move between providers while keeping your identity and social graph.

### Lexicons
Structured schemas that define what different types of content look like across the network.

## Technical Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     PDS     │────│    BGS      │────│   App View  │
│  (Storage)  │    │(Firehose)   │    │ (Algorithm) │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Why This Matters

1. **Algorithmic Choice** - Apps can provide different algorithms for the same data
2. **True Portability** - Move between apps without losing followers
3. **Developer Innovation** - Build new social experiences on existing networks

## The Federation Model

Unlike email-style federation, AT Protocol uses a "big world" model where there's a shared view of the social graph, but multiple competing algorithmic views.

## Current State

As of early 2024, Bluesky is still centralized while they work out the protocols. But the foundation is being built for true decentralization.

The protocol specs are open, and I'm excited to see what developers build on this foundation.

## Resources

- [AT Protocol Docs](https://atproto.com/)
- [Bluesky Blog](https://blueskyweb.xyz/blog)
- [Protocol Specification](https://github.com/bluesky-social/atproto)