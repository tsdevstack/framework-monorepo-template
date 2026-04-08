# {{PROJECT_NAME}}

TypeScript microservices monorepo built with [tsdevstack](https://tsdevstack.dev).

## Getting Started

```bash
# Sync framework config (generates docker-compose, kong, secrets)
npx tsdevstack sync

# Start everything in dev mode
npm run dev
```

## Project Structure

```
apps/           — Microservices (NestJS backends, Next.js frontends, SPAs)
packages/       — Shared libraries
infrastructure/ — Kong gateway, Terraform (generated)
.tsdevstack/    — Framework configuration
```

## Commands

### Development

```bash
npm run dev              # Start all services in parallel
npm run build            # Build everything (libs first, then apps)
npm run tsc              # Type-check all workspaces
npm run lint             # Lint all workspaces
npm run test             # Run all tests
```

### Framework

```bash
npx tsdevstack sync                       # Regenerate local config
npx tsdevstack add-service                # Scaffold a new service
npx tsdevstack add-bucket-storage         # Add an object storage bucket
npx tsdevstack add-messaging-topic        # Add a pub/sub messaging topic
npx tsdevstack register-detached-worker   # Register a BullMQ worker
npx tsdevstack --help                     # See all commands
```

### Per-service commands

```bash
npm run build -w <service-name>
npm run lint -w <service-name>
npm run tsc -w <service-name>
npm run test -w <service-name>
```

## Documentation

Guides and API reference at **[tsdevstack.dev](https://tsdevstack.dev)**.
Source and issues at **[github.com/tsdevstack](https://github.com/tsdevstack)**.

## Community

Join the Discord: [discord.gg/2EMFkqc8QR](https://discord.gg/2EMFkqc8QR)
