export function getPostgresConnectionString(raw: string): string {
  try {
    const url = new URL(raw);
    for (const parameter of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) {
      url.searchParams.delete(parameter);
    }
    return url.toString();
  } catch {
    return raw;
  }
}

export function getDatabaseUrl(): string {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.SUPABASE_DB_URL || "";
}
