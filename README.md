# {{PROJECT_NAME}}

TypeScript microservices monorepo built with [tsdevstack](https://tsdevstack.dev).

## Getting Started

```bash
# Start local infrastructure (databases, Redis, Kong gateway)
docker compose up -d

# Start all services in dev mode
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

```bash
# Development
npm run dev              # Start all services in parallel
npm run build            # Build everything (libs first, then apps)
npm run tsc              # Type-check all workspaces
npm run lint             # Lint all workspaces
npm run test             # Run all tests

# Framework
npx tsdevstack sync             # Regenerate local config (docker-compose, kong, secrets)
npx tsdevstack add-service      # Scaffold a new service
npx tsdevstack generate-secrets # Generate local development secrets
npx tsdevstack generate-kong    # Regenerate Kong gateway config
npx tsdevstack --help           # See all commands
```

## Per-Service Commands

```bash
npm run build -w <service-name>
npm run lint -w <service-name>
npm run tsc -w <service-name>
npm run test -w <service-name>
```