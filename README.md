# Oura Grafana

Automatically syncs Oura Ring sleep data to a PostgreSQL database for visualization in Grafana.

## Getting started

### Install dependencies

```bash
bun install
```

### Configure environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

- `OURA_PAT`: Your Oura API personal access token
- `DATABASE_URL`: PostgreSQL connection string

### Get Oura API token

1. Go to [Oura Cloud](https://cloud.ouraring.com/personal-access-tokens)
2. Create a new personal access token
3. Copy the token to your `.env` file

### Setup Neon database

1. Create a new database on [Neon](https://neon.tech/)
2. Copy the connection string to your `.env` file

## Usage

### Run locally

```bash
bun start
```

### GitHub Actions setup

Add secrets to your GitHub repository:

- `OURA_PAT`
- `DATABASE_URL`

The workflow runs daily at 12 PM UTC.
