import React, { useState } from 'react';
import { FileCard, useLocalState } from '@instinct/files';
import { LESSONS, Lesson } from './data';
import { QUESTIONS } from './questions';

type SubjId = string;
type View = { name: 'home' } | { name: 'study' } | { name: 'subject'; id: SubjId } | { name: 'lesson'; id: string } | { name: 'review' } | { name: 'exam' } | { name: 'me' } | { name: 'bot' };
const GROUPS = [{ id: 'tb', title: 'تانية بكالوريا · مسار الطب وعلوم الحياة' }, { id: 'xb', title: 'مواد بكالوريا إضافية' }, { id: 'g1', title: 'أولى ثانوي · الترم الأول' }];
const SUBJECTS = [
  { id: 'physics', title: 'الفيزياء', note: 'الجزءان الأول والثاني', group: 'tb' },
  { id: 'math', title: 'الرياضيات', note: 'الجزءان الأول والثاني', group: 'tb' },
  { id: 'arabic', title: 'اللغة العربية', note: 'الجزءان الأول والثاني', group: 'tb' },
  { id: 'history', title: 'التاريخ', note: 'الجزءان الأول والثاني', group: 'tb' },
  { id: 'english', title: 'اللغة الإنجليزية', note: 'الجزءان الأول والثاني (الكتاب بالإنجليزي)', group: 'tb' },
  { id: 'chemistry', title: 'الكيمياء', note: 'كتب البكالوريا الرسمية', group: 'xb' },
  { id: 'programming', title: 'البرمجة والذكاء الاصطناعي', note: 'كتب البكالوريا الرسمية', group: 'xb' },
  { id: 'psychology', title: 'علم النفس', note: 'كتب البكالوريا الرسمية', group: 'xb' },
  { id: 'business', title: 'مبادئ الأعمال', note: 'وحدات الكتاب فقط (مفيش دروس في الفهرس)', group: 'xb' },
  { id: 'accounting', title: 'المحاسبة', note: 'وحدات الكتاب فقط، بعض الصفحات تقريبية (±١)', group: 'xb' },
  { id: 'french1', title: 'الفرنسية (لغة أولى)', note: 'وحدات الكتاب فقط', group: 'xb' },
  { id: 'french2', title: 'الفرنسية (لغة ثانية)', note: 'دروس الكتاب', group: 'xb' },
  { id: 'german2', title: 'الألمانية (لغة ثانية)', note: 'دروس الكتاب', group: 'xb' },
  { id: 'spanish2', title: 'الإسبانية (لغة ثانية)', note: 'الجزء الأول، وحدات فقط', group: 'xb' },
  { id: 'italian2', title: 'الإيطالية (لغة ثانية)', note: 'الجزء الأول، وحدات فقط', group: 'xb' },
  { id: 'chinese2', title: 'الصينية (لغة ثانية)', note: '٣ مجموعات حسب صفحات الكتاب (تحتاج مراجعة)', group: 'xb' },
  { id: 'g1-math', title: 'الرياضيات', note: 'الترم الأول', group: 'g1' },
  { id: 'g1-arabic', title: 'اللغة العربية', note: 'الترم الأول', group: 'g1' },
  { id: 'g1-english', title: 'اللغة الإنجليزية', note: 'الترم الأول', group: 'g1' },
  { id: 'g1-science', title: 'العلوم المتكاملة', note: 'الترم الأول', group: 'g1' },
  { id: 'g1-ict', title: 'تكنولوجيا المعلومات والاتصالات', note: 'الترم الأول', group: 'g1' },
  { id: 'g1-philosophy', title: 'الفلسفة والمنطق', note: 'الترم الأول (الفصول فقط)', group: 'g1' },
  { id: 'g1-history', title: 'التاريخ', note: 'الترم الأول', group: 'g1' },
  { id: 'g1-islamic', title: 'التربية الإسلامية', note: 'الترم الأول والثاني', group: 'g1' },
  { id: 'g1-nahw', title: 'النحو والصرف', note: 'الترم الأول', group: 'g1' },
  { id: 'g1-christian', title: 'التربية المسيحية', note: 'الترم الأول', group: 'g1' },
  { id: 'g1-english2', title: 'اللغة الإنجليزية (لغة ثانية)', note: 'الترم الأول', group: 'g1' },
  { id: 'g1-french2', title: 'الفرنسية (لغة ثانية)', note: 'وحدات فقط', group: 'g1' },
  { id: 'g1-story', title: 'قصة عنترة', note: 'الترم الأول', group: 'g1' },
];
const CHAPTERS: Record<string, string> = {
  'english|الجزء الأول|1': "Concept 1: Well-being", 'english|الجزء الأول|2': "Concept 2: Experiences", 'english|الجزء الأول|3': "Concept 3: Identity", 'english|الجزء الأول|4': "Concept 4: Consumption and Choice", 'english|الجزء الأول|5': "Concept 5: Sharing the Planet", 'english|الجزء الثاني|6': "Concept 6: A World for All", 'english|الجزء الثاني|7': "Concept 7: Passion and Purpose", 'english|الجزء الثاني|8': "Concept 8: Identity Across Time", 'english|الجزء الثاني|9': "Concept 9: Belonging and Well-being", 'english|الجزء الثاني|10': "Concept 10: Invisible Consumption",
  'history|الجزء الأول|1': 'مصر بين الماضي والحاضر', 'history|الجزء الأول|2': 'تحولات القوة وبناء الوعي بمصر', 'history|الجزء الأول|3': 'مصر وقضايا التحرر الوطني', 'history|الجزء الثاني|4': 'الحربان العالميتان وتحولات النظام الدولي', 'history|الجزء الثاني|5': 'مصر والقضية الفلسطينية', 'history|الجزء الثاني|6': 'السلام العالمي بين الواقع والمأمول',
  'arabic|الجزء الأول|1': 'العلم والضمير', 'arabic|الجزء الأول|2': 'سلطان الكلمة الرقمية', 'arabic|الجزء الأول|3': 'الإنسان وكرامته', 'arabic|الجزء الثاني|4': 'بناء الوعي', 'arabic|الجزء الثاني|5': 'فن التفاوض والقيادة', 'arabic|الجزء الثاني|6': 'الثقافة أسلوب حياة',
  'physics|الجزء الأول|1': 'الميكانيكا (القوى والحركة)', 'physics|الجزء الأول|2': 'الحركة الاهتزازية والموجات',
  'physics|الجزء الثاني|1': 'الغازات والحرارة', 'physics|الجزء الثاني|2': 'الكهرباء الساكنة', 'physics|الجزء الثاني|3': 'التيار الكهربي والدوائر',
  'physics|الجزء الثاني|4': 'المغناطيسية والحث الكهرومغناطيسي', 'physics|الجزء الثاني|5': 'الطبيعة الكمية للضوء والمادة',
  'math|الجزء الأول|1': 'البراهين الجبرية', 'math|الجزء الأول|2': 'المتتابعات', 'math|الجزء الأول|3': 'الأعداد المركّبة والمعادلات', 'math|الجزء الأول|4': 'الهندسة والمعادلات',
  'math|الجزء الثاني|5': 'الدوال المثلثية', 'math|الجزء الثاني|6': 'الأسس واللوغاريتمات', 'math|الجزء الثاني|7': 'التفاضل والتكامل', 'math|الجزء الثاني|8': 'المتغيّرات العشوائية',
};
const REVISIONS = [
  { title: 'مراجعة وشرح منهج الفيزياء كاملًا في ساعتين ونص', channel: 'Mohamed Reda - محمد رضا', url: 'https://www.youtube.com/watch?v=ajYSHkWkMHE' },
  { title: 'مراجعة فيزياء الصف الثاني الثانوي، الجزء الأول، أهم أفكار الامتحان', channel: 'EL Mohandes Physics', url: 'https://www.youtube.com/watch?v=XmARqXb0LaM' },
  { title: 'كتاب الامتحان فيزياء تانية ثانوي، الفصل الثالث: التداخل والحيود', channel: 'Mr. Abdalla Zein Eldin', url: 'https://www.youtube.com/watch?v=eetN6qv6U8A' },
];
const HUES = ['#2a9d86', '#5b6bd6', '#e07a3f', '#c2559b', '#3f9ad6', '#8c6bd1', '#c99a14', '#d65b5b'];
const colorOf = (id: string) => HUES[Math.max(0, SUBJECTS.findIndex(s => s.id === id)) % HUES.length];
const byId = (id: string) => LESSONS.find(l => l.id === id)!;
const subj_title = (id: string) => SUBJECTS.find(s => s.id === id)!.title;
const subj = (id: string) => SUBJECTS.find(s => s.id === id)!.title;


const ICONS: Record<string, string> = {
  home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  bot: 'M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z',
  me: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  study: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20',
  review: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2',
  exam: 'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9',
};
function Icon({ k }: { k: string }) { return <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS[k]} /></svg>; }
function Mark() { return <svg className="mz-mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#ffc933" /><path d="M6 21h8l3-8 5 15 3-7h9" fill="none" stroke="#1f2747" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

function Ext({ href, children, cls }: { href: string; children: React.ReactNode; cls?: string }) {
  return <a className={cls || 'mz-link'} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}


type Profile = { name: string; grade: '' | 'g1' | 'g2'; track: string; hours: number; date: string; hard: string[]; style: string };
const TRACKS = ['طب وعلوم الحياة', 'هندسة وعلوم الحاسب', 'أعمال', 'آداب وفنون'];
const STYLES = ['فيديوهات', 'قراءة الكتاب', 'حل أسئلة'];
function myGroups(p: Profile | null) { return !p || !p.grade ? ['tb', 'xb', 'g1'] : p.grade === 'g1' ? ['g1'] : ['tb', 'xb']; }
function Onboarding({ onDone, onSkip }: { onDone: (p: Profile) => void; onSkip: () => void }) {
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>({ name: '', grade: '', track: '', hours: 2, date: '', hard: [], style: '' });
  const set = (x: Partial<Profile>) => setP({ ...p, ...x });
  const kinds = p.grade === 'g2' ? [0, 1, 2, 3, 4] : [0, 1, 3, 4];
  const steps = kinds.length; const kind = kinds[step];
  const subs = SUBJECTS.filter(s => myGroups(p).includes(s.group));
  const next = () => (step + 1 >= steps ? onDone(p) : setStep(step + 1));
  const can = kind === 1 ? !!p.grade : kind === 2 ? !!p.track : true;
  return <section className="mz-onb">
    <h1 className="mz-t">أهلًا بيك في ذاكر بقا</h1>
    <p className="mz-note">كام سؤال سريع نظبط بيهم المنصة على مستواك. السؤال {step + 1} من {steps}.</p>
    <span className="mz-bar"><i style={{ width: `${((step + 1) / steps) * 100}%` }} /></span>
    {kind === 0 && <div className="mz-form"><label>اسمك إيه؟<input type="text" value={p.name} maxLength={30} onChange={e => set({ name: e.target.value })} /></label></div>}
    {kind === 1 && <><h2 className="mz-h">إنت في أنهي سنة؟</h2><div className="mz-chips">{([['g1', 'أولى ثانوي'], ['g2', 'تانية بكالوريا']] as const).map(([k, t]) => <button key={k} type="button" className={'mz-chipb' + (p.grade === k ? ' is-on' : '')} onClick={() => set({ grade: k, hard: [] })}>{t}</button>)}</div></>}
    {kind === 2 && <><h2 className="mz-h">مسارك إيه؟</h2><div className="mz-chips">{TRACKS.map(t => <button key={t} type="button" className={'mz-chipb' + (p.track === t ? ' is-on' : '')} onClick={() => set({ track: t })}>{t}</button>)}</div>{p.track && p.track !== TRACKS[0] && <p className="mz-note">كتب مسارك لسه بتتجهز. هتلاقي المتاح من الكتب الرسمية، ومنه اللغات والمواد الإضافية.</p>}</>}
    {kind === 3 && <><h2 className="mz-h">ميعاد امتحانك وكام ساعة بتذاكر؟</h2><div className="mz-form"><label>ميعاد الامتحان (لو عارفه)<input type="date" value={p.date} onChange={e => set({ date: e.target.value })} /></label><label>ساعات المذاكرة في اليوم<input type="number" min={1} max={14} value={p.hours} onChange={e => set({ hours: Math.max(1, Math.min(14, Number(e.target.value) || 1)) })} /></label></div></>}
    {kind === 4 && <><h2 className="mz-h">إيه المواد الصعبة عليك؟ (اختار اللي تحب)</h2><div className="mz-chips">{subs.map(s => <button key={s.id} type="button" className={'mz-chipb' + (p.hard.includes(s.id) ? ' is-on' : '')} onClick={() => set({ hard: p.hard.includes(s.id) ? p.hard.filter(x => x !== s.id) : [...p.hard, s.id] })}>{s.title}</button>)}</div><h2 className="mz-h">بتحب تذاكر إزاي؟</h2><div className="mz-chips">{STYLES.map(t => <button key={t} type="button" className={'mz-chipb' + (p.style === t ? ' is-on' : '')} onClick={() => set({ style: t })}>{t}</button>)}</div></>}
    <div className="mz-pills mz-onbbtn"><button type="button" disabled={!can} onClick={next}>{step + 1 >= steps ? 'خلصت، ابدأ' : 'التالي'}</button>
      {step > 0 && <button type="button" className="mz-ghost mz-ghost2" onClick={() => setStep(step - 1)}>رجوع</button>}
      <button type="button" className="mz-ghost mz-ghost2" onClick={onSkip}>تخطّى</button></div>
    <p className="mz-note">إجاباتك محفوظة على جهازك بس. مفيش حساب على سيرفر، ولا حد تاني بيشوفها.</p>
  </section>;
}

const INTERVALS = [1, 3, 7, 14, 30];
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (s: string, n: number) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return ymd(d); };
function streakOf(log: Record<string, number>) { let s = 0; let d = ymd(new Date()); if (!log[d]) d = addDays(d, -1); while (log[d]) { s++; d = addDays(d, -1); } return s; }
type Due = Record<string, { step: number; next: string }>;
function Focus({ onDone, total }: { onDone: () => void; total: number }) {
  const [end, setEnd] = useState<number | null>(null); const [, tick] = useState(0);
  React.useEffect(() => { if (end === null) return; const t = setInterval(() => { tick(x => x + 1); if (Date.now() >= end) { setEnd(null); onDone(); } }, 500); return () => clearInterval(t); }, [end]);
  const left = end === null ? 25 * 60 : Math.max(0, Math.round((end - Date.now()) / 1000));
  return <div className="mz-callout mz-focus"><strong>مؤقت تركيز ٢٥ دقيقة</strong>
    <span className="mz-clock" dir="ltr">{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</span>
    <button type="button" className="mz-chipb is-on" onClick={() => setEnd(end === null ? Date.now() + 25 * 60000 : null)}>{end === null ? 'ابدأ' : 'وقّف'}</button>
    <small>ركّز ٢٥ دقيقة من غير موبايل، وبعدها ريّح ٥. إجمالي تركيزك: {total} دقيقة.</small></div>;
}

export function App() {
  const [view, setView] = useState<View>({ name: 'home' });
  const [theme, setTheme, tSaved] = useLocalState<string>('mz-theme.v1', 'light');
  const [done, setDone, dSaved] = useLocalState<string[]>('mz-done.v1', []);
  const [answers, setAnswers] = useLocalState<Record<string, number>>('mz-answers.v1', {});
  const [plan, setPlan] = useLocalState<{ date: string; hours: number }>('mz-plan.v1', { date: '', hours: 2 });
  const [profile, setProfile] = useLocalState<Profile | null>('mz-profile.v1', null);
  const finishOnb = (p: Profile) => { setProfile(p); if (p.date || p.hours) setPlan({ date: p.date, hours: p.hours }); };
  const [log, setLog] = useLocalState<Record<string, number>>('mz-log.v1', {});
  const [due, setDue] = useLocalState<Due>('mz-due.v1', {});
  const [notes, setNotes] = useLocalState<Record<string, string>>('mz-notes.v1', {});
  const [focus, setFocus] = useLocalState<number>('mz-focus.v1', 0);
  const today = ymd(new Date());
  const bump = () => setLog({ ...log, [today]: (log[today] || 0) + 1 });
  const review = (id: string) => { const st = (due[id]?.step ?? 0) + 1; const nd = { ...due }; if (st >= INTERVALS.length) delete nd[id]; else nd[id] = { step: st, next: addDays(today, INTERVALS[st]) }; setDue(nd); bump(); };
  const [last, setLast] = useLocalState<string>('mz-last.v1', '');
  const go = (v: View) => { if (v.name === 'lesson') setLast(v.id); setView(v); try { window.scrollTo(0, 0); } catch { /* ignore */ } };
  const toggleDone = (id: string) => { if (!dSaved.ready) return; if (done.includes(id)) { setDone(done.filter(x => x !== id)); const nd = { ...due }; delete nd[id]; setDue(nd); } else { setDone([...done, id]); setDue({ ...due, [id]: { step: 0, next: addDays(today, INTERVALS[0]) } }); bump(); } };
  const answer = (qid: string, i: number) => { if (!(qid in answers)) { setAnswers({ ...answers, [qid]: i }); bump(); } };
  const tab = view.name === 'subject' || view.name === 'lesson' || view.name === 'study' ? 'study' : view.name === 'review' ? 'exam' : view.name;

  return <FileCard lang="ar" dir="rtl">
    <div className="mz-app" data-theme={theme}>
      <header className="mz-top">
        <button type="button" className="mz-brand" onClick={() => go({ name: 'home' })}><Mark /><span>ذاكر بقا</span></button>
        <button type="button" className="mz-theme" aria-label="تبديل الوضع الفاتح والغامق" onClick={() => tSaved.ready && setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'فاتح' : 'غامق'}</button>
      </header>
      <main className="mz-main">
        {!profile && <Onboarding onDone={finishOnb} onSkip={() => setProfile({ name: '', grade: '', track: '', hours: 2, date: '', hard: [], style: '' })} />}
        {profile && view.name === 'home' && <Home go={go} doneIds={done} last={last} profile={profile} streak={streakOf(log)} todayCount={log[today] || 0} dueIds={Object.keys(due).filter(id => due[id].next <= today)} focus={focus} onFocus={() => setFocus(focus + 25)} />}
        {profile && view.name === 'study' && <Study go={go} done={done} profile={profile} />}
        {profile && view.name === 'subject' && <Subject id={view.id} go={go} done={done} />}
        {profile && view.name === 'lesson' && <LessonView l={byId(view.id)} go={go} done={done.includes(view.id)} toggle={() => toggleDone(view.id)} answers={answers} answer={answer} note={notes[view.id] || ''} setNote={(t: string) => setNotes({ ...notes, [view.id]: t })} isDue={!!due[view.id] && due[view.id].next <= today} review={() => review(view.id)} />}
        {profile && view.name === 'review' && <Review go={go} />}
        {profile && view.name === 'exam' && <Exam go={go} answers={answers} answer={answer} reset={() => setAnswers({})} />}
        {profile && view.name === 'bot' && <Bot go={go} />}
        {profile && view.name === 'me' && <Me done={done} answers={answers} plan={plan} setPlan={setPlan} go={go} profile={profile} redo={() => setProfile(null)} />}
        <p className="mz-foot">نسخة تجريبية. المحتوى مبني على كتب البكالوريا الرسمية لوزارة التربية والتعليم.</p>
      </main>
      {profile && <nav className="mz-tabs" aria-label="التنقل">
        {([['home', 'الرئيسية'], ['study', 'المواد'], ['exam', 'امتحن'], ['bot', 'بكالورياوي'], ['me', 'أنا']] as const).map(([k, t]) =>
          <button key={k} type="button" className={tab === k ? 'is-on' : ''} onClick={() => go({ name: k } as View)}><Icon k={k} /><span>{t}</span></button>)}
      </nav>}
    </div>
  </FileCard>;
}


type Sec = { h: string; ids: string[] };
const CORE: Sec = { h: 'المواد الأساسية', ids: ['arabic', 'english', 'history'] };
const LANGS: Sec = { h: 'لغة ثانية (اختياري)', ids: ['french2', 'german2', 'spanish2', 'italian2', 'chinese2', 'french1'] };
const PLANS: Record<string, { title: string; note: string; secs: Sec[] }> = {
  'طب وعلوم الحياة': { title: 'مسار الطب وعلوم الحياة', note: 'كتب المسار الرسمية متاحة.', secs: [{ h: 'مواد المسار', ids: ['physics', 'chemistry', 'math'] }, CORE, LANGS] },
  'هندسة وعلوم الحاسب': { title: 'مسار الهندسة وعلوم الحاسب', note: 'كتب الأساسيات والبرمجة متاحة. الرياضيات والفيزياء هنا من كتب مسار الطب لحد ما نضيف كتب المسار.', secs: [{ h: 'مواد المسار', ids: ['math', 'physics', 'programming', 'chemistry'] }, CORE, LANGS] },
  'أعمال': { title: 'مسار الأعمال', note: 'كتب المسار المتاحة: مبادئ الأعمال والمحاسبة (وحدات الكتاب فقط).', secs: [{ h: 'مواد المسار', ids: ['business', 'accounting', 'math'] }, CORE, LANGS] },
  'آداب وفنون': { title: 'مسار الآداب والفنون', note: 'كتب المسار المتاحة: علم النفس. باقي كتب المسار لسه بتتجهز.', secs: [{ h: 'مواد المسار', ids: ['psychology'] }, CORE, LANGS] },
  'g1': { title: 'أولى ثانوي · الترم الأول', note: 'كتب الترم الأول الرسمية.', secs: [
    { h: 'اللغات', ids: ['g1-arabic', 'g1-nahw', 'g1-story', 'g1-english', 'g1-english2', 'g1-french2'] },
    { h: 'علوم ورياضيات وتكنولوجيا', ids: ['g1-math', 'g1-science', 'g1-ict'] },
    { h: 'اجتماعيات ودين وفلسفة', ids: ['g1-history', 'g1-philosophy', 'g1-islamic', 'g1-christian'] }] },
};
const planKey = (p: Profile) => p.grade === 'g1' ? 'g1' : (p.track && PLANS[p.track] ? p.track : TRACKS[0]);

function Row({ id, done, go, hard }: { id: string; done: string[]; go: (v: View) => void; hard?: boolean }) {
  const s = SUBJECTS.find(x => x.id === id); if (!s) return null;
  const ls = LESSONS.filter(l => l.subject === id); const d = ls.filter(l => done.includes(l.id)).length;
  return <button type="button" className="mz-row" style={{ ['--c' as string]: colorOf(id) }} onClick={() => go({ name: 'subject', id })}>
    <span className="mz-tdot">{s.title.replace(/^ال/, '').charAt(0)}</span>
    <span className="mz-rb"><strong>{s.title}{hard && <em className="mz-flag2">صعبة عليك</em>}</strong><small>{ls.length} درس · {d} خلصت</small><Bar v={d} max={ls.length} /></span>
    <span className="mz-chev">‹</span>
  </button>;
}
function Plan({ k, done, go, hard }: { k: string; done: string[]; go: (v: View) => void; hard: string[] }) {
  const pl = PLANS[k];
  return <>
    <p className="mz-note">{pl.note}</p>
    {pl.secs.map(sec => <section key={sec.h} className="mz-sec"><h2 className="mz-h">{sec.h}</h2><div className="mz-list">{sec.ids.map(id => <Row key={id} id={id} done={done} go={go} hard={hard.includes(id)} />)}</div></section>)}
  </>;
}

function Tile({ s, done, go, hard }: { s: typeof SUBJECTS[number]; done: string[]; go: (v: View) => void; hard?: boolean }) {
  const ls = LESSONS.filter(l => l.subject === s.id); const d = ls.filter(l => done.includes(l.id)).length;
  return <button type="button" className="mz-tile" style={{ ['--c' as string]: colorOf(s.id) }} onClick={() => go({ name: 'subject', id: s.id })}>
    <span className="mz-tdot">{s.title.replace(/^ال/, '').charAt(0)}</span>
    <strong>{s.title}</strong><small>{ls.length} درس</small>
    <Bar v={d} max={ls.length} />{hard && <span className="mz-flag">صعبة عليك</span>}
  </button>;
}
function Home({ go, profile, streak, todayCount, dueIds, focus, onFocus, last, doneIds }: { go: (v: View) => void; profile: Profile; streak: number; todayCount: number; dueIds: string[]; focus: number; onFocus: () => void; last: string; doneIds: string[] }) {
  const lastL = last ? LESSONS.find(l => l.id === last) : undefined;
  const nextL = lastL ? (LESSONS.filter(l => l.subject === lastL.subject && !doneIds.includes(l.id))[0] ?? lastL) : undefined;
  const hardSub = SUBJECTS.find(s => profile.hard.includes(s.id));
  const mine = SUBJECTS.filter(s => myGroups(profile).includes(s.group));
  const shown = [...mine.filter(s => profile.hard.includes(s.id)), ...mine.filter(s => !profile.hard.includes(s.id))].slice(0, 6);
  const goal = Math.min(todayCount, 3);
  const cta = () => go(nextL ? { name: 'lesson', id: nextL.id } : hardSub ? { name: 'subject', id: hardSub.id } : { name: 'study' });
  return <>
    <section className="mz-hd">
      <span className="mz-chip">{profile.grade === 'g1' ? 'أولى ثانوي' : profile.grade === 'g2' ? 'تانية بكالوريا' + (profile.track ? ' · ' + profile.track : '') : 'ذاكر بقا'}</span>
      <h1>{profile.name ? `أهلًا يا ${profile.name}` : 'أهلًا بيك'}</h1>
      <p>خطوة النهارده تفرق. كمّل من حيث وقفت.</p>
      <div className="mz-kpis"><div><b>{streak}</b><span>يوم متتالي</span></div><div><b>{goal}/3</b><span>هدف النهارده</span></div><div><b>{doneIds.length}</b><span>درس خلصته</span></div></div>
    </section>
    <button type="button" className="mz-cta" onClick={cta}><small>{nextL ? 'كمّل من حيث وقفت' : 'ابدأ من هنا'}</small><strong>{nextL ? nextL.title : hardSub ? `ابدأ بـ ${hardSub.title}` : 'اختار مادتك وابدأ'}</strong>{nextL && <span>{subj(nextL.subject)} · صفحة <bdi>{nextL.bookPage}</bdi></span>}</button>
    {dueIds.length > 0 && <><h2 className="mz-h">وقت المراجعة <b className="mz-count">{dueIds.length}</b></h2>
      {dueIds.slice(0, 5).map(id => <button type="button" key={id} className="mz-lesson mz-solo" onClick={() => go({ name: 'lesson', id })}><span className="mz-lt">{byId(id).title}</span><span className="mz-badges"><b>{subj(byId(id).subject)}</b></span></button>)}</>}
    <h2 className="mz-h">{PLANS[planKey(profile)].title}</h2>
    <Plan k={planKey(profile)} done={doneIds} go={go} hard={profile.hard} />
    <Focus onDone={onFocus} total={focus} />
    <div className="mz-quick"><button type="button" onClick={() => go({ name: 'exam' })}><Icon k="exam" />امتحن نفسك</button><button type="button" onClick={() => go({ name: 'review' })}><Icon k="review" />مراجعات نهائية</button></div>
  </>;
}

function Study({ go, done, profile }: { go: (v: View) => void; done: string[]; profile: Profile }) {
  const [q, setQ] = useState('');
  const [vt, setVt] = useState(planKey(profile));
  const mine = myGroups(profile);
  const ordered = [...GROUPS.filter(g => mine.includes(g.id)), ...GROUPS.filter(g => !mine.includes(g.id))];
  const found = q.trim().length > 1 ? LESSONS.filter(l => (l.title + ' ' + (l.chTitle || '')).toLowerCase().includes(q.trim().toLowerCase())) : [];
  return <>
    <h1 className="mz-t">المواد</h1>
    <input className="mz-search" type="search" value={q} placeholder="دوّر على أي درس..." aria-label="بحث" onChange={e => setQ(e.target.value)} />
    {q.trim().length > 1 && <div className="mz-unit">{found.length === 0 && <p className="mz-note mz-pad">مفيش درس بالاسم ده.</p>}{found.slice(0, 25).map(l => <button type="button" key={l.id} className="mz-lesson" onClick={() => go({ name: 'lesson', id: l.id })}><span className="mz-lt">{l.title}</span><span className="mz-badges"><b>{subj(l.subject)}</b></span></button>)}</div>}
    <div className="mz-switch">{[...TRACKS.map(t => ({ k: t, l: t })), { k: 'g1', l: 'أولى ثانوي' }].map(x => <button key={x.k} type="button" className={'mz-chipb' + (vt === x.k ? ' is-on' : '')} onClick={() => setVt(x.k)}>{x.l}</button>)}</div>
    <h2 className="mz-t2">{PLANS[vt].title}</h2>
    <Plan k={vt} done={done} go={go} hard={profile.hard} />
    <p className="mz-note mz-pad">العناوين وأرقام الصفحات من كتب الوزارة الرسمية. الملخصات والأسئلة بتتضاف بس لما تتكتب من الكتاب نفسه.</p>
  </>;
}

function Bar({ v, max }: { v: number; max: number }) { return <span className="mz-bar" role="img" aria-label={`${v} من ${max}`}><i style={{ width: `${max ? (v / max) * 100 : 0}%` }} /></span>; }

function Subject({ id, go, done }: { id: SubjId; go: (v: View) => void; done: string[] }) {
  const ls = LESSONS.filter(l => l.subject === id);
  const parts = Array.from(new Set(ls.map(l => l.part)));
  const d = ls.filter(l => done.includes(l.id)).length;
  const s = SUBJECTS.find(x => x.id === id)!;
  return <>
    <button type="button" className="mz-back" onClick={() => go({ name: 'study' })}>‹ المواد</button>
    <div className="mz-shead" style={{ ['--c' as string]: colorOf(id) }}><span className="mz-tdot">{s.title.replace(/^ال/, '').charAt(0)}</span><div><h1>{s.title}</h1><small>{s.note} · {d} من {ls.length} درس</small></div></div>
    <Bar v={d} max={ls.length} />
    {parts.map(p => { const chs = Array.from(new Set(ls.filter(l => l.part === p).map(l => l.ch)));
      return <section key={p}>{parts.length > 1 && <h2 className="mz-h">{p}</h2>}
        {chs.map((c, ci) => { const cl = ls.filter(l => l.part === p && l.ch === c); const cd = cl.filter(l => done.includes(l.id)).length;
          return <details key={c} className="mz-unit" open={ci === 0 && p === parts[0]}><summary><span>{c === 0 ? '' : `الفصل ${c}: `}{(CHAPTERS[`${id}|${p}|${c}`] ?? cl[0]?.chTitle)}</span><em>{cd}/{cl.length}</em></summary>
            {cl.map(l => <button type="button" key={l.id} className="mz-lesson" onClick={() => go({ name: 'lesson', id: l.id })}>
              <span className={'mz-num' + (done.includes(l.id) ? ' is-done' : '')}><bdi>{done.includes(l.id) ? '✓' : l.num}</bdi></span><span className="mz-lt">{l.title}</span>
              <span className="mz-badges">{QUESTIONS.some(q => q.lesson === l.id) && <b>أسئلة</b>}{l.video && <b>فيديو</b>}</span></button>)}
          </details>; })}
      </section>; })}
  </>;
}

function LessonView({ l, go, done, toggle, answers, answer, note, setNote, isDue, review }: { note: string; setNote: (t: string) => void; isDue: boolean; review: () => void; l: Lesson; go: (v: View) => void; done: boolean; toggle: () => void; answers: Record<string, number>; answer: (q: string, i: number) => void }) {
  const qs = QUESTIONS.filter(q => q.lesson === l.id);
  return <div style={{ ['--c' as string]: colorOf(l.subject) }}>
    <button type="button" className="mz-back" onClick={() => go({ name: 'subject', id: l.subject })}>‹ {subj(l.subject)}</button>
    <p className="mz-crumb">{l.part} · الفصل <bdi>{l.ch}</bdi></p>
    <h1 className="mz-lh"><bdi>{l.num}</bdi> {l.title}</h1>
    <div className="mz-step"><span className="mz-sn">١</span><div><h2>اقرأ في الكتاب</h2><Ext href={l.book} cls="mz-big">افتح الدرس في كتاب الوزارة (من صفحة <bdi>{l.bookPage}</bdi>)</Ext><p className="mz-note">الكتاب PDF كبير. افتحه على واي فاي لو الباقة قليلة.</p></div></div>
    <div className="mz-step"><span className="mz-sn">٢</span><div><h2>شاهد الشرح</h2>
      {l.video ? <div className="mz-video"><Ext href={l.video.url} cls="mz-big">شاهد على يوتيوب</Ext><span>القناة: <bdi>{l.video.channel}</bdi> · {l.video.note}</span></div>
        : <div className="mz-video"><Ext href={l.search} cls="mz-ghostlink">ابحث عن الدرس على يوتيوب</Ext><small>ده رابط بحث، مش فيديو متأكد منه.</small></div>}</div></div>
    <div className="mz-step"><span className="mz-sn">٣</span><div><h2>جاوب</h2>{qs.length === 0 ? <p className="mz-note">أسئلة الدرس ده لسه مش جاهزة. هتتضاف من الكتاب الرسمي.</p> : qs.map((q, i) => <QCard key={q.id} q={q} n={i + 1} picked={answers[q.id]} answer={answer} />)}</div></div>
    <div className="mz-step"><span className="mz-sn">٤</span><div><h2>لخّص بإيدك</h2><textarea className="mz-notes" rows={4} value={note} placeholder="اكتب أهم الأفكار بكلامك. الكتابة بإيدك بتثبّت المعلومة." onChange={e => setNote(e.target.value)} /></div></div>
    {isDue && <button type="button" className="mz-ghostbtn" onClick={review}>راجعت الدرس ده النهارده</button>}
    <div className="mz-donebar"><button type="button" className={done ? 'mz-donebtn is-on' : 'mz-donebtn'} onClick={toggle}>{done ? 'تم ✓ (اضغط للإلغاء)' : 'خلصت الدرس'}</button></div>
  </div>;
}

function QCard({ q, n, picked, answer }: { q: typeof QUESTIONS[number]; n: number; picked?: number; answer: (q: string, i: number) => void }) {
  const has = picked !== undefined;
  return <div className="mz-q"><p className="mz-qt"><bdi>{n}</bdi>. {q.text}</p>
    {q.options.map((o, i) => <button type="button" key={i} disabled={has} className={'mz-opt' + (has && i === q.answer ? ' is-right' : '') + (has && i === picked && i !== q.answer ? ' is-wrong' : '')} onClick={() => answer(q.id, i)}>{o}</button>)}
    {has && <div className="mz-why"><strong>{picked === q.answer ? 'إجابة صح' : 'إجابة غلط'}</strong> {q.why}<small>المصدر: {q.src}</small></div>}
  </div>;
}

function Review({ go }: { go: (v: View) => void }) {
  return <>
    <h1 className="mz-t">راجع</h1>
    <p className="mz-note">مراجعات يوتيوب مجانية من قنوات مدرسين، بروابطها الأصلية. هي للصف الثاني الثانوي بالنظام العام، فهي قريبة من المنهج ومش مطابقة له.</p>
    {REVISIONS.map(r => <Ext key={r.url} href={r.url} cls="mz-rev"><strong>{r.title}</strong><span>القناة: <bdi>{r.channel}</bdi></span></Ext>)}
    <div className="mz-callout"><strong>مراجعات البكالوريا نفسها</strong>مراجعات حسب فصول كتاب البكالوريا لسه مش جاهزة. أسرع طريقة دلوقتي تفتح الدرس من <button type="button" className="mz-inline" onClick={() => go({ name: 'study' })}>قسم ذاكر</button>.</div>
  </>;
}

function Exam({ go, answers, answer, reset }: { go: (v: View) => void; answers: Record<string, number>; answer: (q: string, i: number) => void; reset: () => void }) {
  const ans = QUESTIONS.filter(q => q.id in answers); const right = ans.filter(q => answers[q.id] === q.answer).length;
  return <>
    <h1 className="mz-t">امتحن</h1>
    <button type="button" className="mz-more" onClick={() => go({ name: 'review' })}>مراجعات نهائية على يوتيوب ‹</button>
    <p className="mz-note">كل الأسئلة المتاحة حاليًا ({QUESTIONS.length}) من كتابي الفيزياء. نتيجتك: {right} من {ans.length} اتجاوب.</p>
    {QUESTIONS.map((q, i) => <div key={q.id}><p className="mz-crumb">{byId(q.lesson).title}</p><QCard q={q} n={i + 1} picked={answers[q.id]} answer={answer} /></div>)}
    <button type="button" className="mz-ghostbtn" onClick={reset}>مسح الإجابات والبدء من جديد</button>
  </>;
}


const norm = (t: string) => t.replace(/[\u064B-\u0652\u0640]/g, '').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').toLowerCase();
const STOP = new Set(['ما', 'هو', 'هي', 'ماذا', 'يعني', 'ايه', 'اي', 'في', 'من', 'علي', 'عن', 'الي', 'او', 'ان', 'هل', 'كيف', 'ازاي', 'لماذا', 'شرح', 'اشرح', 'لي', 'لو', 'سمحت', 'قانون', 'درس']);
const toks = (t: string) => norm(t).split(/[^a-z0-9\u0621-\u064A]+/).filter(w => w.length > 1 && !STOP.has(w)).map(w => w.replace(/^(ال|وال|بال|لل)/, ''));
type Msg = { who: 'me' | 'bot'; text: string; ids?: string[]; qs?: string[] };
function Bot({ go }: { go: (v: View) => void }) {
  const [grp, setGrp] = useState('tb');
  const [subj, setSubj] = useState<SubjId>('physics');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const sname = subj ? subj_title(subj) : '';
  const ask = (e: React.FormEvent) => {
    e.preventDefault(); const q = text.trim(); if (!q) return; setText('');
    const qt = toks(q);
    const scored = LESSONS.filter(l => l.subject === subj).map(l => { const lt = toks(l.title); return { l, s: qt.filter(w => lt.some(x => x === w || (w.length > 3 && (x.startsWith(w) || w.startsWith(x))))).length }; }).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3);
    const qq = QUESTIONS.filter(x => scored.some(c => c.l.id === x.lesson)).map(x => x.id);
    const reply: Msg = scored.length
      ? { who: 'bot', text: `لقيت في كتاب ${sname} الرسمي الدروس دي مرتبطة بسؤالك. افتح الدرس عشان تشوف صفحة الكتاب والفيديو والأسئلة:`, ids: scored.map(x => x.l.id), qs: qq }
      : { who: 'bot', text: `مش برد غير على مادة ${sname} من محتوى المنصة. جرّب تسأل بعنوان الدرس، زي "متجهات السرعة" أو "قانون بويل".` };
    setMsgs([...msgs, { who: 'me', text: q }, reply]);
  };
  return <>
    <h1 className="mz-t">بكالورياوي</h1>
    <p className="mz-note">بجاوب بس من دروس المنصة وكتب الوزارة. مش بجاوب من برّه المادة.</p>
    <div className="mz-pickrow">
      {GROUPS.map(g => <button key={g.id} type="button" className={'mz-chipb' + (grp === g.id ? ' is-on' : '')} onClick={() => { setGrp(g.id); setSubj(SUBJECTS.find(s => s.group === g.id)!.id); setMsgs([]); }}>{g.title.split(' · ')[0]}</button>)}
      {SUBJECTS.filter(s => s.group === grp).map(s => <button key={s.id} type="button" className={'mz-chipb' + (subj === s.id ? ' is-on' : '')} onClick={() => { setSubj(s.id); setMsgs([]); }}>{s.title}</button>)}
    </div>
    <div className="mz-chat" aria-live="polite">
      {msgs.length === 0 && <div className="mz-msg bot">اسألني عن أي درس في {sname}. هدلك على الدرس وصفحة الكتاب.</div>}
      {msgs.map((m, i) => <div key={i} className={'mz-msg ' + m.who}>{m.text}
        {m.ids && m.ids.map(id => <button type="button" key={id} className="mz-lesson" onClick={() => go({ name: 'lesson', id })}><span className="mz-num">{byId(id).num}</span><span className="mz-lt">{byId(id).title}</span></button>)}
        {m.qs && m.qs.length > 0 && <small>فيه {m.qs.length} أسئلة تدريب على الدروس دي.</small>}
      </div>)}
    </div>
    <form className="mz-ask" onSubmit={ask}><input value={text} onChange={e => setText(e.target.value)} placeholder={`اسأل عن ${sname}...`} aria-label="سؤالك" /><button type="submit">إرسال</button></form>
  </>;
}

function Me({ done, answers, plan, setPlan, go, profile, redo }: { profile: Profile; redo: () => void; done: string[]; answers: Record<string, number>; plan: { date: string; hours: number }; setPlan: (p: { date: string; hours: number }) => void; go: (v: View) => void }) {
  const total = LESSONS.length; const ans = QUESTIONS.filter(q => q.id in answers); const wrong = ans.filter(q => answers[q.id] !== q.answer);
  const weak = Array.from(new Set(wrong.map(q => q.lesson)));
  const days = plan.date ? Math.ceil((new Date(plan.date + 'T00:00:00').getTime() - Date.now()) / 86400000) : 0;
  const left = total - done.length; const per = days > 0 ? Math.ceil(left / days) : 0;
  return <>
    <h1 className="mz-t">{profile.name ? `تقدّمك يا ${profile.name}` : 'تقدّمي'}</h1>
    <p className="mz-note">{[profile.grade === 'g1' ? 'أولى ثانوي' : profile.grade === 'g2' ? 'تانية بكالوريا' : '', profile.track, profile.style].filter(Boolean).join(' · ')} <button type="button" className="mz-link" onClick={redo}>عدّل إجاباتك</button></p>
    <div className="mz-stats"><div><strong>{done.length}/{total}</strong><span>درس خلصته</span></div><div><strong>{ans.length ? Math.round((ans.length - wrong.length) / ans.length * 100) + '%' : '-'}</strong><span>صح في الأسئلة</span></div></div>
    <Bar v={done.length} max={total} />
    <h2 className="mz-h">نقاط الضعف</h2>
    {weak.length === 0 ? <p className="mz-note">{ans.length ? 'مفيش دروس غلطت فيها.' : 'جاوب على أسئلة وهتظهر هنا الدروس اللي محتاجة مراجعة.'}</p> : weak.map(id => <button type="button" key={id} className="mz-lesson" onClick={() => go({ name: 'lesson', id })}><span className="mz-lt">{byId(id).title}</span><span className="mz-badges"><b>راجعه</b></span></button>)}
    <h2 className="mz-h">خطة المذاكرة</h2>
    <div className="mz-form"><label>ميعاد امتحانك<input type="date" value={plan.date} onChange={e => setPlan({ ...plan, date: e.target.value })} /></label>
      <label>ساعات المذاكرة في اليوم<input type="number" min={1} max={14} value={plan.hours} onChange={e => setPlan({ ...plan, hours: Math.max(1, Math.min(14, Number(e.target.value) || 1)) })} /></label></div>
    {days > 0 ? <div className="mz-callout"><strong>خطتك</strong>فاضل {days} يوم و{left} درس. يعني حوالي {per} دروس في اليوم، وكل درس تقريبًا {Math.round(plan.hours * 60 / Math.max(per, 1))} دقيقة.</div> : <p className="mz-note">اكتب ميعاد امتحانك وتطلع الخطة.</p>}
  </>;
}
