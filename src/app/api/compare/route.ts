import { streamText } from 'ai';
import { defaultModel } from '@/lib/ai-provider';
import { getOccupationBySlug, occupations, type Occupation } from '@/data/occupations';

function formatOccupation(occ: Occupation): string {
  return `**${occ.title}** (${occ.industryLabel})
- DRI: ${occ.dri}/100 (${occ.status} risk)
- Trend: ${occ.trend} (${occ.trendDelta > 0 ? '+' : ''}${occ.trendDelta} this quarter)
- Automation: ${occ.automationPct}%
- Median Salary: $${occ.medianSalary.toLocaleString()}
- Jobs at Risk: ${(occ.jobsAtRisk / 1000).toFixed(0)}K
- Replacement Timeline: ${occ.replacementTimeline}
- Factors: Task Repeatability ${occ.factors.taskRepeatability}, Data Availability ${occ.factors.dataAvailability}, AI Capability Match ${occ.factors.aiCapabilityMatch}, Adoption Velocity ${occ.factors.adoptionVelocity}, Human Value Premium ${occ.factors.humanValuePremium}
- Rising Skills: ${occ.risingSkills.join(', ')}
- Declining Skills: ${occ.decliningSkills.join(', ')}
- Transition Paths: ${occ.transitionPaths.map(p => `${p.title} (DRI ${p.dri}, ${p.overlap}% overlap)`).join('; ')}
- Description: ${occ.description}`;
}

export async function POST(req: Request) {
  const { slug1, slug2 } = await req.json();

  const occ1 = getOccupationBySlug(slug1);
  const occ2 = getOccupationBySlug(slug2);

  if (!occ1 || !occ2) {
    return new Response(JSON.stringify({ error: 'Occupation not found' }), { status: 404 });
  }

  const result = streamText({
    model: defaultModel,
    system: `You are The Career Geographer for the Displacement Index. Given two occupations and their displacement data, generate a concise comparison: which is more resilient to AI displacement and why, what skills transfer between them, and which direction to move if transitioning. Be specific and actionable. 3 paragraphs max. Do not use markdown headers — use plain paragraphs.`,
    prompt: `Compare these two occupations:\n\n${formatOccupation(occ1)}\n\n---\n\n${formatOccupation(occ2)}`,
  });

  return result.toTextStreamResponse();
}
