import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, MessageSquare, TrendingUp, Activity, Video, Globe,
  ThumbsUp, ExternalLink, Send
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../components/LanguageContext';
import { SENTIMENT_TOPICS } from './SentimentConsole';

// @ts-ignore
import almatyEnergyBill from '../assets/images/almaty_energy_bill_1779900527988.png';

const KOL_LIST = [
  { name: 'Informburo 31',     platform: 'YOUTUBE',  subs: '2.13M', avatar: 'https://i.pravatar.cc/64?img=1',  desc: 'Largest KZ Russian-language news channel; weekly review format' },
  { name: 'Kazakh Lawyer A.K.', platform: 'TIKTOK',   subs: '480K',  avatar: 'https://i.pravatar.cc/64?img=11', desc: 'Lawyer commenting on regulatory and consumer rights cases' },
  { name: 'Almaty_Resident',   platform: 'TELEGRAM', subs: '320K',  avatar: 'https://i.pravatar.cc/64?img=21', desc: 'Anonymous channel aggregating Almaty civic complaints' },
  { name: 'Energy Watch KZ',   platform: 'X',        subs: '210K',  avatar: 'https://i.pravatar.cc/64?img=31', desc: 'Industry analyst; covers oil, gas, coal markets' },
  { name: 'Tengri Talks',      platform: 'FACEBOOK', subs: '180K',  avatar: 'https://i.pravatar.cc/64?img=41', desc: 'Talk show host commenting on government policy' },
  { name: 'Aktau Voice',       platform: 'VK',       subs: '92K',   avatar: 'https://i.pravatar.cc/64?img=51', desc: 'Local Aktau resident reporting on Mangystau region events' },
  { name: 'Bota Z. (driver)',  platform: 'TIKTOK',   subs: '76K',   avatar: 'https://i.pravatar.cc/64?img=12', desc: 'Taxi driver vlogger; daily price-of-fuel commentary' },
  { name: 'KZ_Politics',       platform: 'TELEGRAM', subs: '62K',   avatar: 'https://i.pravatar.cc/64?img=22', desc: 'Pro-opposition political news aggregator' },
  { name: 'Marat S. MP',       platform: 'X',        subs: '54K',   avatar: 'https://i.pravatar.cc/64?img=32', desc: 'Member of Parliament; tweets about energy and social issues' },
  { name: 'KZ Citizens Today', platform: 'INSTAGRAM', subs: '41K',  avatar: 'https://i.pravatar.cc/64?img=42', desc: 'Photo-journal of livelihood pain points across KZ' },
];

const POST_LIST = [
  { platform: 'TELEGRAM',  img: almatyEnergyBill,
    title: "ALMATY UTILITY BILL SURGE: CITIZENS EXPRESS DEEP OUTCRY OVER 35% HEATING & POWER INCREASE",
    title_zh: "阿拉木图公用事业费猛增：居民深感愤怒，供热及电费开支大涨 35%",
    interaction: '48.2K views · 1.2K shares', author: 'Almaty_Resident', subs: '320K', date: '2026-05-26',
    content_ru: 'Энергетический кризис в Алматы: жители города выражают глубокое возмущение в связи с повышением тарифов на отопление и электроэнергию на 35%. "Счета за коммунальные услуги превышают половину нашей пенсии!", — жалуются горожане в социальных сетях. Акимат призывает к терпению, но градус недовольства растет ежедневно.',
    content_en: 'The energy utility cost crisis in Almaty is reaching a boiling point: city residents are expressing deep outrage over a sudden 35% hike in heating and electricity rates. "Our utility bills now consume more than half of our monthly pension!", citizens complain on social networks. The Akimat urges patience, but public anger rises daily.',
    content_zh: "阿拉木图供热公用事业费用开支已达沸点：由于暖气和电费在短时间内暴涨 35%，成千上万市民在社交媒体表达愤怒。'我们的公用账单现在已经占到我们月度退休金的一半以上！'居民在各大群组哀叹。尽管市长办公室呼吁耐心，但市民的积怨仍在与日俱增。" },
  { platform: 'TIKTOK',   img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=160',
    title: 'TAXI DRIVERS PROTEST IN AKTAU OVER LPG +28%',
    interaction: '1.2M views · 89K likes', author: 'Bota Z.', subs: '76K', date: '2026-05-26',
    content_ru: 'Официальные цены на СУГ выросли, и водители в Актау отказываются выходить на работу. Ситуация обостряется с каждым часом, если правительство не вмешается в ценообразование, забастовка охватит весь регион.',
    content_en: 'Official LPG prices have surged, and drivers in Aktau are refusing to work. The situation escalates every hour. If the government does not intervene in the pricing mechanism, the strike will engulf the entire region.' },
  { platform: 'TELEGRAM', img: 'https://images.unsplash.com/photo-1542652735873-fb2825bac6e2?w=160',
    title: 'ALMATY HEAT PIPE BURST — 1,200 HOUSEHOLDS CUT OFF',
    interaction: '420 reposts', author: 'Almaty_Resident', subs: '320K', date: '2026-05-25',
    content_ru: 'В Алма-Ате лопнула тепловая труба, без отопления остались сотни квартир. Жители замерзают, а ремонт обещают закончить только к утру.',
    content_en: 'A heating pipe burst in Almaty, leaving hundreds of apartments without heating. Residents are freezing, while repairs are promised to be completed only by morning.' },
  { platform: 'FACEBOOK', img: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=160',
    title: 'KAZAKH LAWYER NO-COMPROMISE DECLARATION',
    interaction: '8.2K shares · 22K likes', author: 'Tengri Talks', subs: '180K', date: '2026-05-24',
    content_ru: 'Адвокат выступил с заявлением о защите прав потребителей энергоресурсов. Жители имеют право на бесперебойное тепло и справедливые тарифы.',
    content_en: 'The lawyer made a declaration regarding the protection of energy consumer rights. Residents have the right to uninterrupted heat and fair tariffs.' },
  { platform: 'X',        img: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=160',
    title: 'PAVLODAR DATA CENTER GRABBING GRID POWER — CONSUMERS PAY THE PRICE',
    interaction: '12.4K retweets', author: 'Energy Watch KZ', subs: '210K', date: '2026-05-22',
    content_ru: 'Майнинговые фермы в Павлодаре забирают значительную часть энергосети. Ответственность должна лежать на регулирующих органах.',
    content_en: 'Mining farms in Pavlodar consume a significant portion of the energy network grid power. The responsibility must lie with the regulatory authorities.' },
  { platform: 'YOUTUBE',  img: 'https://images.unsplash.com/photo-1581094289810-adf5d25690e3?w=160',
    title: 'WHY 273 DAYS TO APPROVE A WIND FARM? OUR INVESTIGATION',
    interaction: '420K views', author: 'Tengri Talks', subs: '180K', date: '2026-05-20',
    content_ru: 'Ежедневные задержки в выдаче разрешений тормозят зеленую энергетику в Казахстане. Инвесторы в шоке от бюрократии.',
    content_en: 'Daily delays in permitting slow green energy down in Kazakhstan. Investors are absolutely shocked by the level of bureaucracy.' },
  { platform: 'TIKTOK',   img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=160',
    title: 'WHEN WILL OUR HEAT COME BACK ON?',
    interaction: '380K views · 22K likes', author: 'KZ Citizens', subs: '41K', date: '2026-05-19',
    content_ru: 'Где тепло? Прошло уже 14 часов без горячей воды. Просим акимат отреагировать немедленно!',
    content_en: 'Where is the heat? It has already been 14 hours without hot water. We request the Akimat to react immediately!' },
  { platform: 'TELEGRAM', img: 'https://images.unsplash.com/photo-1535980808-15ad1b8acc02?w=160',
    title: 'KARAGANDA METHANE SPIKE — UNCONFIRMED CASUALTIES',
    interaction: '180 reposts', author: 'KZ_Politics', subs: '62K', date: '2026-05-18',
    content_ru: 'Слухи о взрыве метана на шахте в Караганде распространяются в чатах. Пока нет официального подтверждения количества пострадавших.',
    content_en: 'Rumors about a methane explosion in a Karaganda mine are circulating in chats. Currently there is no official confirmation of casualties.' },
  { platform: 'X',        img: 'https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=160',
    title: 'AKTAU COAL +18% — PETITION REACHES 12K SIGNATURES',
    interaction: '6.8K retweets', author: 'Aktau Voice', subs: '92K', date: '2026-05-17',
    content_ru: 'Петиция против повышения цен на уголь в Актау собрала 12 тысяч подписей за два дня. Люди требуют заморозить тарифы.',
    content_en: 'The petition against coal price hikes in Aktau gathered 12,000 signatures in two days. People are demanding a tariff freeze.' },
  { platform: 'INSTAGRAM', img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=160',
    title: 'ENERGY POVERTY 2026 — A PHOTO STORY',
    interaction: '14.2K likes', author: 'KZ Citizens Today', subs: '41K', date: '2026-05-15',
    content_ru: 'Фоторепортаж о том, как живут люди в регионах без постоянного доступа к стабильному отоплению и газу.',
    content_en: 'Photo-report about how people live in regions without constant access to stable heating or pipeline gas.' },
];

const SAMPLE_COMMENTS = [
  { user: 'Kairat N.',        text: 'Finally they started talking about this openly. Need a full cleanup!',  text_zh: '终于有人公开谈论这件事了。需要彻底清理！',  likes: '1.2K' },
  { user: 'Almaty_Resident',  text: 'Why only now? These races on Al-Farabi happen every night.',          text_zh: '为什么现在才说？阿尔法拉比大道上的这些赛车每晚都在发生。',          likes: '856' },
];

export default function SentimentTopicDetail() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const tLabel = (en: string, zh: string) => (language === 'zh' ? zh : en);
  const [selectedPostIdx, setSelectedPostIdx] = useState(0);

  const topic = useMemo(() => SENTIMENT_TOPICS.find(t => t.id === topicId) || SENTIMENT_TOPICS[0], [topicId]);
  const post = POST_LIST[selectedPostIdx] || POST_LIST[0];

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FA] overflow-hidden h-full">
      {/* header */}
      <div className="h-14 border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/warning/sentiment')}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold">
            <ArrowLeft size={13} /> {tLabel('Back to Sentiment Console', '返回舆情列表')}
          </button>
          <span className="text-[11.5px] font-black uppercase text-[#0F1722] tracking-wider">
            {tLabel('TOPIC DEEP DIVE', '话题深度分析')} · {topic.id}
          </span>
        </div>
        <span className="px-2 py-0.5 bg-[#D8454C] text-white text-[8px] font-bold rounded-sm uppercase font-mono">HIGH PRIORITY</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* ===== HERO CARD ===== */}
        <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-5 shadow-sm flex gap-5">
          <div className="w-28 h-28 bg-slate-100 rounded-[6px] overflow-hidden shrink-0 border border-slate-200">
            <img src={topic.thumbnail} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-[#D8454C] text-white text-[8.5px] font-black rounded uppercase tracking-wider animate-pulse">HIGH PRIORITY</span>
              <span className="text-[9px] font-mono text-[#A8B2C0]">CASE: #{topic.id}</span>
              <span className="text-[9px] font-mono text-[#A8B2C0]">DOMAIN: {topic.domain}</span>
              <span className="text-[9px] font-mono text-[#A8B2C0]">RISK LEVEL: {topic.risk}</span>
            </div>
            <h2 className="text-[18px] font-black text-[#0F1722] leading-tight mt-1">{tLabel(topic.title_en, topic.title_zh)}</h2>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {['LPG', 'PRICE +28%', 'TAXI', 'DRIVER PROTEST', 'JUSTICE'].map(kw => (
                <span key={kw} className="text-[9px] font-mono font-bold text-[#D8454C] bg-[#D8454C]/5 px-1.5 py-0.5 rounded-full border border-[#D8454C]/15">{kw}</span>
              ))}
            </div>
            <p className="text-[11px] text-[#6A7686] mt-3 leading-snug">
              {tLabel('Cumulative engagement volume', '累计舆情声量')}:&nbsp;
              <span className="text-[#D8454C] font-black">{topic.volume} index</span>&nbsp;·&nbsp;
              {tLabel('Participant groups: KZ middle-class car owners, lawyers, MIA officers, analysts.',
                      '参与人群：哈萨克中产车主 / 律师 / 内务部官员 / 经济分析师。')}
            </p>
          </div>
        </div>

        {/* ===== TOP 10 KOL + TOP 10 POSTS ===== */}
        <div className="grid grid-cols-2 gap-5">
          {/* KOL list */}
          <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-4 shadow-sm">
            <h4 className="text-[11px] font-black text-[#0F1722] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User size={12} /> {tLabel('TOP 10 KOL · Opinion Leaders', 'TOP 10 意见领袖监控')}
            </h4>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {KOL_LIST.map((k, i) => (
                <div key={i} className="flex items-start gap-3 p-2 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-md transition duration-150">
                  <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-250">
                    <img src={k.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[11px] font-black text-[#0F1722] truncate">{k.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[7.5px] font-mono font-black bg-slate-100 text-[#6A7686] px-1 py-0.5 rounded uppercase">{k.platform}</span>
                        <span className="text-[8.5px] font-mono text-[#A8B2C0]">{k.subs}</span>
                      </div>
                    </div>
                    <p className="text-[9.5px] text-[#6A7686] leading-snug">{k.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top posts list */}
          <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-4 shadow-sm">
            <h4 className="text-[11px] font-black text-[#0F1722] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp size={12} /> {tLabel('TOP 10 Posts', 'TOP 10 监测热帖')}
            </h4>
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {POST_LIST.map((p, i) => (
                <div key={i} onClick={() => setSelectedPostIdx(i)}
                  className={cn("flex gap-3 p-2 cursor-pointer border rounded transition duration-150",
                    selectedPostIdx === i ? 'bg-[#0F1722] text-white border-[#0F1722]' : 'hover:bg-slate-50 border-transparent bg-white')}>
                  <div className="w-14 h-10 rounded overflow-hidden shrink-0 border border-slate-100">
                    <img src={p.img} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={cn("text-[7.5px] font-mono font-black px-1.5 py-0.5 rounded uppercase",
                        selectedPostIdx === i ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#6A7686]')}>{p.platform}</span>
                      <span className="text-[8.5px] font-mono font-black text-[#D8454C]">{p.interaction}</span>
                    </div>
                    <div className={cn("text-[10px] font-black truncate uppercase tracking-tight",
                      selectedPostIdx === i ? 'text-white' : 'text-[#0F1722]')}>{p.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== POST DETAIL ANALYSIS ===== */}
        <div className="bg-white border border-[#E2E7EF] rounded-[6px] shadow-sm">
          <div className="h-11 border-b border-slate-100 flex items-center px-5 bg-slate-50/50 justify-between">
            <div className="flex items-center gap-2">
              <Video size={14} className="text-[#0F1722]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0F1722]">{tLabel('Post Detail Analysis', '高频重点文章深度分析')}</span>
            </div>
            <span className="text-[9px] font-mono text-[#6A7686]">{tLabel('Verified entry', '已核实条目')} #{selectedPostIdx + 1}</span>
          </div>

          <div className="flex gap-6 p-6">
            {/* LEFT: Facebook-style post card (mock embed) */}
            <div className="w-1/2 shrink-0">
              <div className="bg-white border border-[#E2E7EF] rounded-[6px] overflow-hidden shadow-sm">
                <div className="h-12 flex items-center gap-3 px-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-black text-sm shrink-0">i</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-[#0F1722]">{post.author}</div>
                    <div className="text-[9px] text-[#6A7686] font-mono">{post.subs} · {post.date}</div>
                  </div>
                  <Globe size={13} className="text-[#A8B2C0]" />
                </div>
                <div className="aspect-video bg-black overflow-hidden relative">
                  <img src={post.img.includes('http') ? post.img.replace('w=160', 'w=600') : post.img} className="w-full h-full object-cover opacity-90" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-[12.5px] font-black text-[#0F1722] leading-tight uppercase">{tLabel(post.title, (post as any).title_zh || post.title)}</h3>
                  {post.content_ru && (
                    <p className="text-[10px] text-[#6A7686] leading-relaxed italic border-l-2 border-slate-200 pl-2">{post.content_ru}</p>
                  )}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-2">
                    <span className="flex items-center gap-1 text-[10px] text-[#6A7686]"><ThumbsUp size={11} /> 15.6K</span>
                    <span className="flex items-center gap-1 text-[10px] text-[#6A7686]"><MessageSquare size={11} /> 193</span>
                    <span className="flex items-center gap-1 text-[10px] text-[#6A7686]"><Send size={11} /> 84</span>
                    <a href="#" onClick={(e) => e.preventDefault()} className="ml-auto text-[9.5px] text-[#2D6CDF] font-black flex items-center gap-0.5 hover:underline">
                      {tLabel('Open on Source Platform', '打开原文链接')} <ExternalLink size={9} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: translation + comments */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-black text-[#0F1722] leading-tight mb-3 uppercase">{tLabel(post.title, (post as any).title_zh || post.title)}</h3>

              {language === 'zh' ? (
                (post as any).content_zh ? (
                  <div className="bg-slate-50 border border-[#E2E7EF] rounded p-3 mb-4">
                    <div className="text-[8.5px] font-black uppercase text-[#A8B2C0] font-mono mb-1.5">AI 翻译 · 俄→中</div>
                    <p className="text-[10.5px] text-[#0F1722] leading-snug">{(post as any).content_zh}</p>
                  </div>
                ) : post.content_en ? (
                  <div className="bg-slate-50 border border-[#E2E7EF] rounded p-3 mb-4">
                    <div className="text-[8.5px] font-black uppercase text-[#A8B2C0] font-mono mb-1.5">AI 翻译 · 俄→中</div>
                    <p className="text-[10.5px] text-[#0F1722] leading-snug">{post.content_en}</p>
                  </div>
                ) : null
              ) : post.content_en ? (
                <div className="bg-slate-50 border border-[#E2E7EF] rounded p-3 mb-4">
                  <div className="text-[8.5px] font-black uppercase text-[#A8B2C0] font-mono mb-1.5">AI Translation · RU → EN</div>
                  <p className="text-[10.5px] text-[#0F1722] leading-snug">{post.content_en}</p>
                </div>
              ) : null}

              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9.5px] font-black text-[#0F1722] uppercase tracking-wider">193 {tLabel('Comments', '用户评论追踪')}</span>
                </div>
                <div className="space-y-3 max-h-[180px] overflow-y-auto">
                  {SAMPLE_COMMENTS.map((c, i) => (
                    <div key={i} className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0 flex items-center justify-center font-bold text-[9px] text-[#6A7686]">{c.user.substring(0, 2)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-black text-[#0F1722]">{c.user}</span>
                          <span className="text-[8px] text-[#A8B2C0]">2 days ago</span>
                        </div>
                        <p className="text-[10px] text-[#6A7686] leading-snug">{tLabel(c.text, c.text_zh)}</p>
                        <div className="flex items-center gap-3 mt-1 text-[8.5px]">
                          <span className="text-[#A8B2C0] font-mono">▲ {c.likes}</span>
                          <a className="text-[#0F1722] font-black uppercase cursor-pointer">{tLabel('Reply', '回复')}</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 6 ANALYSIS SCENARIOS ===== */}
        <div className="grid grid-cols-3 gap-4">
          {/* 1. Volume trend */}
          <ScenarioCard title={tLabel('1. Volume Trend (30D)', '1. 声量趋势 (30 天)')}>
            <div className="p-3">
              <svg className="w-full h-28" viewBox="0 0 200 100">
                <path fill="none" stroke="#2D6CDF" strokeWidth="2"
                  d="M 0,85 Q 30,80 50,70 T 100,60 T 140,20 T 170,40 T 200,50" />
                <circle cx="140" cy="20" r="4" fill="#D8454C">
                  <animate attributeName="r" from="4" to="8" dur="1s" repeatCount="indefinite" />
                </circle>
                <text x="95" y="15" fontSize="7" fill="#D8454C" fontWeight="bold">KOL Outburst Trigger</text>
              </svg>
            </div>
          </ScenarioCard>

          {/* 2. Sentiment pie */}
          <ScenarioCard title={tLabel('2. Sentiment Distribution', '2. 情绪分布玫瑰图')}>
            <div className="flex items-center justify-center h-28">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#E2E7EF" strokeWidth="15" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#D8454C" strokeWidth="15"
                  strokeDasharray={`${0.73 * 220} 220`} transform="rotate(-90 50 50)" />
                <text x="50" y="47" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#D8454C">-73%</text>
                <text x="50" y="58" textAnchor="middle" fontSize="6" fill="#6A7686" fontWeight="bold">NEGATIVE</text>
              </svg>
            </div>
          </ScenarioCard>

          {/* 3. Top keywords */}
          <ScenarioCard title={tLabel('3. Top Keywords', '3. 高频关键词')}>
            <div className="flex flex-wrap gap-1.5 p-3 h-28 overflow-hidden items-center justify-center">
              {[
                { w: 'LPG', sz: 14, col: '#D8454C' },
                { w: '价格 PRICE', sz: 12, col: '#0F1722' },
                { w: '抗议 PROTEST', sz: 13, col: '#D8454C' },
                { w: '司法 JUSTICE', sz: 10, col: '#0F1722' },
                { w: '司机 DRIVER', sz: 11, col: '#0F1722' },
                { w: '不公 UNFAIR', sz: 9, col: '#6A7686' },
                { w: '腐败 CORRUPTION', sz: 9, col: '#D8454C' }
              ].map((k, i) => (
                <span key={i} className="font-extrabold tracking-tight"
                  style={{ fontSize: `${k.sz}px`, color: k.col }}>{k.w}</span>
              ))}
            </div>
          </ScenarioCard>

          {/* 4. Demographics */}
          <ScenarioCard title={tLabel('4. Demographics', '4. 参与人群结构势图')}>
            <div className="p-3 space-y-2 h-28 overflow-hidden flex flex-col justify-center">
              {[
                { en: 'Male', zh: '男', v: 78, c: '#2D6CDF' },
                { en: 'Female', zh: '女', v: 22, c: '#D8454C' },
                { en: 'Age 25-34', zh: '25-34岁', v: 64, c: '#E89518' }
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px] font-mono">
                  <span className="w-14 text-[#6A7686] truncate">{tLabel(row.en, row.zh)}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded overflow-hidden">
                    <div className="h-full rounded-sm" style={{ width: `${row.v}%`, background: row.c }} />
                  </div>
                  <span className="font-mono font-black text-[#0F1722] w-6 text-right">{row.v}%</span>
                </div>
              ))}
            </div>
          </ScenarioCard>

          {/* 5. Platform share */}
          <ScenarioCard title={tLabel('5. Platform Share', '5. 监测平台分布图')}>
            <div className="p-3 space-y-1.5 h-28 overflow-hidden flex flex-col justify-center">
              {[
                { n: 'TikTok', v: 38, c: '#D8454C' },
                { n: 'Telegram', v: 27, c: '#2D6CDF' },
                { n: 'Facebook', v: 18, c: '#1877F2' },
                { n: 'X', v: 12, c: '#0F1722' }
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px] font-mono">
                  <span className="w-12 text-[#6A7686]">{row.n}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded overflow-hidden">
                    <div className="h-full rounded-sm" style={{ width: `${row.v}%`, background: row.c }} />
                  </div>
                  <span className="font-mono font-black text-[#0F1722] w-6 text-right">{row.v}%</span>
                </div>
              ))}
            </div>
          </ScenarioCard>

          {/* 6. Cross-platform propagation heatmap */}
          <ScenarioCard title={tLabel('6. Cross-Platform Heatmap', '6. 跨平台传播热力图')}>
            <div className="p-2.5 grid grid-cols-[50px_1fr] gap-1 h-28 overflow-hidden text-[7.5px] font-mono">
              {['TikTok', 'Telegram', 'X', 'Facebook', 'YouTube'].map((plat, pi) => (
                <React.Fragment key={pi}>
                  <span className="text-[#6A7686] self-center">{plat}</span>
                  <div className="flex gap-0.5 items-center">
                    {Array.from({ length: 14 }).map((_, di) => {
                      const intensity = Math.sin(pi * 0.7 + di * 0.5) * 0.5 + 0.5;
                      const alpha = Math.max(0.08, intensity * (pi === 0 || pi === 1 ? 1 : 0.6));
                      return (
                        <div key={di} className="flex-1 h-2.5 rounded-[1px]"
                          style={{ background: `rgba(216, 69, 76, ${alpha})` }} 
                          title={`Intensity: ${Math.round(intensity * 100)}%`} />
                      );
                    })}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </ScenarioCard>
        </div>

      </div>
    </div>
  );
}

function ScenarioCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E2E7EF] rounded-[6px] shadow-sm overflow-hidden">
      <div className="h-8 border-b border-slate-100 flex items-center px-3 bg-slate-50/50">
        <span className="text-[9px] font-black uppercase tracking-wider text-[#0F1722]">{title}</span>
      </div>
      {children}
    </div>
  );
}
