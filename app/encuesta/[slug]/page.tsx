import { notFound } from 'next/navigation';
import { getInstitucionActiva } from '@/lib/supabase-server';
import { Encuesta } from '@/components/encuesta/Encuesta';

// Se resuelve en cada request (lee Supabase). Slug inexistente o inactivo => 404 (SPEC §10).
export const dynamic = 'force-dynamic';

export default async function EncuestaPage({ params }: { params: { slug: string } }) {
  const institucion = await getInstitucionActiva(params.slug);
  if (!institucion) notFound();
  return <Encuesta slug={institucion.slug} tipo={institucion.tipo} />;
}
