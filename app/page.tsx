import { db } from '../lib/db';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const rows = await db.record.findMany({ take: 50, orderBy: { id: 'desc' } });
  const count = await db.record.count();
  async function create(form: FormData) {
    'use server';
    if (!process.env.VALIDATION_WRITE_KEY || form.get('key') !== process.env.VALIDATION_WRITE_KEY) throw Error('Forbidden');
    const value = String(form.get('value') ?? '');
    if (!value || value.length > 80 || await db.record.count() >= 1000) throw Error('Fixture limit');
    await db.record.create({ data: { value } });
    revalidatePath('/');
  }
  return <main style={{ padding: 32, maxWidth: 720, margin: 'auto' }}>
    <h1>SQLite 배포 검증</h1>
    <p>플랫폼 소유의 임시 검증 앱입니다. 개인 자료를 입력하지 마세요.</p>
    <p>저장된 기록: <strong>{count}</strong></p>
    <p>환경변수: {process.env.VALIDATION_MARKER ?? 'initial'}</p>
    <p>앱 버전: revision-two</p>
    <form action={create}>
      <label>검증 키 <input name="key" type="password" required /></label>{' '}
      <label>검증 값 <input name="value" maxLength={80} required /></label>{' '}
      <button type="submit">기록 저장</button>
    </form>
    <ul>{rows.map(row => <li key={row.id}>{row.value}</li>)}</ul>
  </main>;
}
