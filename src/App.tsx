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
const byId = (id: string) => LESSONS.find(l => l.id === id)!;
const subj_title = (id: string) => SUBJECTS.find(s => s.id === id)!.title;
const subj = (id: string) => SUBJECTS.find(s => s.id === id)!.title;


const ICONS: Record<string, string> = {
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

export function App() {
  const [view, setView] = useState<View>({ name: 'home' });
  const [theme, setTheme, tSaved] = useLocalState<string>('mz-theme.v1', 'light');
  const [done, setDone, dSaved] = useLocalState<string[]>('mz-done.v1', []);
  const [answers, setAnswers] = useLocalState<Record<string, number>>('mz-answers.v1', {});
  const [plan, setPlan] = useLocalState<{ date: string; hours: number }>('mz-plan.v1', { date: '', hours: 2 });
  const [profile, setProfile] = useLocalState<Profile | null>('mz-profile.v1', null);
  const finishOnb = (p: Profile) => { setProfile(p); if (p.date || p.hours) setPlan({ date: p.date, hours: p.hours }); };
  const go = (v: View) => { setView(v); try { window.scrollTo(0, 0); } catch { /* ignore */ } };
  const toggleDone = (id: string) => { if (dSaved.ready) setDone(done.includes(id) ? done.filter(x => x !== id) : [...done, id]); };
  const answer = (qid: string, i: number) => { if (!(qid in answers)) setAnswers({ ...answers, [qid]: i }); };
  const tab = view.name === 'subject' || view.name === 'lesson' || view.name === 'study' ? 'study' : view.name;

  return <FileCard lang="ar" dir="rtl">
    <div className="mz-app" data-theme={theme}>
      <header className="mz-top">
        <button type="button" className="mz-brand" onClick={() => go({ name: 'home' })}><Mark /><span>ذاكر بقا</span></button>
        <button type="button" className="mz-theme" aria-label="تبديل الوضع الفاتح والغامق" onClick={() => tSaved.ready && setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'فاتح' : 'غامق'}</button>
      </header>
      <main className="mz-main">
        {!profile && <Onboarding onDone={finishOnb} onSkip={() => setProfile({ name: '', grade: '', track: '', hours: 2, date: '', hard: [], style: '' })} />}
        {profile && view.name === 'home' && <Home go={go} done={done.length} profile={profile} />}
        {profile && view.name === 'study' && <Study go={go} done={done} profile={profile} />}
        {profile && view.name === 'subject' && <Subject id={view.id} go={go} done={done} />}
        {profile && view.name === 'lesson' && <LessonView l={byId(view.id)} go={go} done={done.includes(view.id)} toggle={() => toggleDone(view.id)} answers={answers} answer={answer} />}
        {profile && view.name === 'review' && <Review go={go} />}
        {profile && view.name === 'exam' && <Exam answers={answers} answer={answer} reset={() => setAnswers({})} />}
        {profile && view.name === 'bot' && <Bot go={go} />}
        {profile && view.name === 'me' && <Me done={done} answers={answers} plan={plan} setPlan={setPlan} go={go} profile={profile} redo={() => setProfile(null)} />}
        <p className="mz-foot">النسخة الأولى التجريبية. المحتوى مبني على كتب البكالوريا الرسمية لوزارة التربية والتعليم.</p>
      </main>
      {profile && <nav className="mz-tabs" aria-label="التنقل">
        {([['home', 'الرئيسية'], ['study', 'ذاكر'], ['review', 'راجع'], ['exam', 'امتحن'], ['bot', 'بكالورياوي'], ['me', 'تقدّمي']] as const).map(([k, t]) =>
          <button key={k} type="button" className={tab === k ? 'is-on' : ''} onClick={() => go({ name: k } as View)}>{t}</button>)}
      </nav>}
    </div>
  </FileCard>;
}

function Home({ go, done, profile }: { go: (v: View) => void; done: number; profile: Profile }) {
  const firstHard = SUBJECTS.find(s => profile.hard.includes(s.id));
  const rows: [string, string, string, View][] = [
    ['study', 'ذاكر', 'دروس مترتبة زي الكتاب الرسمي، مع شرح يوتيوب وأسئلة', { name: 'study' }],
    ['review', 'راجع', 'مراجعات نهائية بروابطها الأصلية', { name: 'review' }],
    ['exam', 'امتحن', 'أسئلة بتصحيح فوري وتعرف غلطت فين', { name: 'exam' }],
  ];
  return <>
    <section className="mz-hero">
      <span className="mz-chip">{profile.grade === 'g1' ? 'أولى ثانوي' : profile.grade === 'g2' ? 'تانية بكالوريا · ' + profile.track : 'ذاكر بقا'}</span>
      <h1>ذاكر <em>بقا</em></h1>
      <p>{profile.name ? `أهلًا يا ${profile.name}. ` : ''}منصة مجانية للبكالوريا المصرية. مذاكرتك كلها في مكان واحد وعلى منهجك.</p>
      <svg className="mz-pulse" viewBox="0 0 300 40" aria-hidden="true"><path d="M0 22h90l12-16 16 32 14-22 10 6h158" fill="none" stroke="#2fb59a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div className="mz-pills"><button type="button" onClick={() => go(firstHard ? { name: 'subject', id: firstHard.id } : { name: 'study' })}>{firstHard ? `ابدأ بـ ${firstHard.title}` : 'ابدأ المذاكرة'}</button><button type="button" className="mz-ghost" onClick={() => go({ name: 'exam' })}>جرّب امتحان</button></div>
    </section>
    <h2 className="mz-sec">ذاكر · راجع · امتحن</h2>
    <div className="mz-tl">
      {rows.map(([k, t, d, v]) => <button type="button" key={k} className="mz-tlrow" onClick={() => go(v)}><span className="mz-ico"><Icon k={k} /></span><span className="mz-tlt"><strong>{t}</strong><small>{d}</small></span></button>)}
    </div>
    <h2 className="mz-sec">اختار سنتك ومسارك</h2>
    <div className="mz-cards">
      <button type="button" className="mz-card is-live" onClick={() => go({ name: 'study' })}>
        <span className="mz-tag">متاح الآن</span><strong>تانية بكالوريا</strong><span>مسار الطب وعلوم الحياة</span><small>{LESSONS.length} درس في الفيزياء والرياضيات</small>
      </button>
      <div className="mz-card is-soon"><span className="mz-tag mz-soon">قريبًا</span><strong>كتب المسارات التانية</strong><span>الفهارس لسه ناقصة في الهندسة والأعمال والآداب (المواد الإضافية موجودة في «ذاكر»)</span></div>
      <div className="mz-card is-soon"><span className="mz-tag mz-soon">متاح</span><strong>أولى ثانوي · الترم الأول</strong><span>١٣ مادة في «ذاكر»، الترم الثاني لسه</span></div>
    </div>
    <p className="mz-note">خلّصت {done} درس لحد دلوقتي.</p>
  </>;
}

function Study({ go, done, profile }: { go: (v: View) => void; done: string[]; profile: Profile }) {
  const mine = myGroups(profile);
  const ordered = [...GROUPS.filter(g => mine.includes(g.id)), ...GROUPS.filter(g => !mine.includes(g.id))];
  return <>
    {profile.grade === 'g2' && profile.track && profile.track !== TRACKS[0] && <div className="mz-callout"><strong>مسارك: {profile.track}</strong>كتب مسارك لسه بتتجهز. ده المتاح حاليًا من الكتب الرسمية.</div>}
    <h1 className="mz-t">اختار المادة</h1>
    <p className="mz-note">عناوين الدروس وأرقام الصفحات من كتب الوزارة الرسمية، مع رابط الكتاب. الملخصات والأسئلة بتتضاف بس لما تتكتب من الكتاب نفسه.</p>
    {ordered.map(g => <section key={g.id}><h2 className="mz-h">{g.title}</h2><div className="mz-cards">
      {SUBJECTS.filter(s => s.group === g.id).map(s => { const ls = LESSONS.filter(l => l.subject === s.id); const d = ls.filter(l => done.includes(l.id)).length;
        return <button key={s.id} type="button" className="mz-card is-live" onClick={() => go({ name: 'subject', id: s.id })}>{profile.hard.includes(s.id) && <span className="mz-tag">صعبة عليك</span>}<strong>{s.title}</strong><span>{s.note}</span><Bar v={d} max={ls.length} /><small>{d} من {ls.length} درس</small></button>; })}
    </div></section>)}
  </>;
}

function Bar({ v, max }: { v: number; max: number }) { return <span className="mz-bar" role="img" aria-label={`${v} من ${max}`}><i style={{ width: `${max ? (v / max) * 100 : 0}%` }} /></span>; }

function Subject({ id, go, done }: { id: SubjId; go: (v: View) => void; done: string[] }) {
  const ls = LESSONS.filter(l => l.subject === id);
  const parts = Array.from(new Set(ls.map(l => l.part)));
  return <>
    <button type="button" className="mz-back" onClick={() => go({ name: 'study' })}>‹ المواد</button>
    <h1 className="mz-t">{subj(id)}</h1>
    {parts.map(p => { const chs = Array.from(new Set(ls.filter(l => l.part === p).map(l => l.ch)));
      return <section key={p}><h2 className="mz-h">{p}</h2>
        {chs.map(c => <div key={c} className="mz-unit"><h3>{c === 0 ? '' : `الفصل ${c}`}: {(CHAPTERS[`${id}|${p}|${c}`] ?? ls.find(l => l.part === p && l.ch === c)?.chTitle)}</h3>
          {ls.filter(l => l.part === p && l.ch === c).map(l => <button type="button" key={l.id} className="mz-lesson" onClick={() => go({ name: 'lesson', id: l.id })}>
            <span className="mz-num"><bdi>{l.num}</bdi></span><span className="mz-lt">{l.title}</span>
            <span className="mz-badges">{QUESTIONS.some(q => q.lesson === l.id) && <b>أسئلة</b>}{l.video && <b>فيديو</b>}{done.includes(l.id) && <b className="mz-ok">تم</b>}</span></button>)}
        </div>)}
      </section>; })}
  </>;
}

function LessonView({ l, go, done, toggle, answers, answer }: { l: Lesson; go: (v: View) => void; done: boolean; toggle: () => void; answers: Record<string, number>; answer: (q: string, i: number) => void }) {
  const qs = QUESTIONS.filter(q => q.lesson === l.id);
  return <>
    <button type="button" className="mz-back" onClick={() => go({ name: 'subject', id: l.subject })}>‹ {subj(l.subject)}</button>
    <p className="mz-crumb">{l.part} · الفصل <bdi>{l.ch}</bdi></p>
    <h1 className="mz-t"><bdi>{l.num}</bdi> · {l.title}</h1>
    <h2 className="mz-h">المحتوى الرسمي</h2>
    <Ext href={l.book} cls="mz-big">افتح الدرس في كتاب الوزارة (يبدأ حوالي صفحة <bdi>{l.bookPage}</bdi> من الكتاب)</Ext>
    <p className="mz-note">الكتاب PDF كبير. افتحه على واي فاي لو الباقة قليلة.</p>
    <h2 className="mz-h">شرح فيديو</h2>
    {l.video ? <div className="mz-video"><Ext href={l.video.url} cls="mz-big">شاهد على يوتيوب</Ext><span>القناة: <bdi>{l.video.channel}</bdi> · {l.video.note}</span><small>الفيديو على قناة صاحبه وبرابطه الأصلي.</small></div>
      : <div className="mz-video"><span>لسه ملقيناش فيديو مؤكد لهذا الدرس.</span><Ext href={l.search} cls="mz-link">ابحث عنه على يوتيوب</Ext><small>ده رابط بحث، مش فيديو متأكد منه.</small></div>}
    <h2 className="mz-h">أسئلة على الدرس</h2>
    {qs.length === 0 ? <p className="mz-note">أسئلة هذا الدرس لسه مش جاهزة. هتتضاف من الكتاب الرسمي.</p> : qs.map((q, i) => <QCard key={q.id} q={q} n={i + 1} picked={answers[q.id]} answer={answer} />)}
    <button type="button" className={done ? 'mz-donebtn is-on' : 'mz-donebtn'} onClick={toggle}>{done ? 'تم. اضغط لو عايز تلغيها' : 'علّم الدرس إنه خلص'}</button>
  </>;
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

function Exam({ answers, answer, reset }: { answers: Record<string, number>; answer: (q: string, i: number) => void; reset: () => void }) {
  const ans = QUESTIONS.filter(q => q.id in answers); const right = ans.filter(q => answers[q.id] === q.answer).length;
  return <>
    <h1 className="mz-t">امتحن</h1>
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
