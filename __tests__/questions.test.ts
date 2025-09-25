import { QuestionService } from '@/services/questions/QuestionService';

describe('QuestionService', () => {
  it('loads questions and resolves fields', () => {
    const svc = new QuestionService();
    const all = svc.all();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
    const q = all[0];
    expect(q.category).toBeDefined();
    expect(q.question).toBeDefined();
    expect(['a','b','c','d']).toContain(q.correct);
  });
});
// TODO
