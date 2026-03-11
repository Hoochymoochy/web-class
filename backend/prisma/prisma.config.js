import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: "postgres://2bc46eddcffc58eaa87d2453ce2d32555a4c8c16d13d95d8bb5e87d1e75e982b:sk_maBFzWD5ohhj_Od1YmScY@db.prisma.io:5432/postgres?sslmode=require",
  },
})