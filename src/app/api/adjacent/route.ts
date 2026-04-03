import { streamText } from 'ai';
import { defaultModel } from '@/lib/ai-provider';
import { getOccupationBySlug, occupations, type Occupation } from '@/data/occupations';

function formatOccupation(occ: Occupation): string {
  return `**${occ.title}** (${occ.industryLabel})
- DRI: ${occ.dri}/100 (${occ.status} risk)
- Automation: ${occ.automationPct}%
- Rising Skills: ${occ.risingSkills.join(', ')}
- Declining Skills: ${occ.decliningSkills.join(', ')}
- Transition Paths: ${occ.transitionPaths.map(p => `${p.title} (DRI ${p.dri}, ${p.overlap}% overlap)`).join('; ')}
- Description: ${occ.description}`;
}

function formatAllOccupations(): string {
  return occupations.map(o => `- ${o.title} (${o.slug}): DRI ${o.dri}, ${o.industryLabel}`).join('\n');
}

export async function POST(req: Request) {
  const { slug } = await req.json();

  const occ = getOccupationBySlug(slug);
  if (!occ) {
    return new Response(JSON.stringify({ error: 'Occupation not found' }), { status: 404 });
  }

  const result = streamText({
    model: defaultModel,
    system: `You are The Career Geographer for the Displacement Index. Given this occupation and the full list of tracked occupations, identify 5 adjacent occupations ordered by: (1) skill overlap with the input occupation and (2) lower displacement risk. For each, explain the skill overlap percentage estimate and why it's more resilient. Format as a numbered list with occupation name, overlap %, displacement risk change, and one sentence on the transition path. Be specific and actionable. Only recommend occupations that have lower DRI scores than the input.`,
    prompt: `Find safer adjacent career paths for:\n\n${formatOccupation(occ)}\n\nAll tracked occupations:\n${formatAllOccupations()}`,
  });

  return result.toTextStreamResponse();
}
