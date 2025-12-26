# Oura Grafana

Syncs Oura Ring sleep data to a PostgreSQL database for visualization in Grafana.

## Usage

### Prerequisites

- [Bun](https://bun.com/)
- [Docker](https://www.docker.com/)

### Setup

#### Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

#### Get Oura API token

1. Go to [Oura Cloud](https://cloud.ouraring.com/personal-access-tokens)
2. Create a new personal access token
3. Copy the token to your `.env` file

#### Setup Neon database

1. Create a new database on [Neon](https://neon.tech/)
2. Copy the connection string to your `.env` file

### Run locally

Install dependencies:

```bash
bun install
```

Run the sync script:

```bash
bun start
```

### GitHub Actions setup

Add secrets to your GitHub repository:

- `OURA_PAT`
- `DATABASE_URL`

The workflow runs daily at 9 AM UTC.

## License

This project is licensed under the terms of the [MIT](https://choosealicense.com/licenses/mit/) license.
