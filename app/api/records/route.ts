import { db } from '../../../lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  return Response.json({ count: await db.record.count(), records: await db.record.findMany({ take: 50, orderBy: { id: 'desc' } }),
    marker: process.env.VALIDATION_MARKER ?? '', hostname: process.env.HOSTNAME ?? '' });
}
export async function POST(request: Request) {
  if (!process.env.VALIDATION_WRITE_KEY || request.headers.get('x-validation-key') !== process.env.VALIDATION_WRITE_KEY) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  if (typeof body.value !== 'string' || body.value.length > 80 || await db.record.count() >= 1000) {
    return Response.json({ error: 'Fixture limit' }, { status: 400 });
  }
  const row = await db.record.create({ data: { value: body.value } });
  return Response.json({ id: row.id }, { status: 201 });
}
