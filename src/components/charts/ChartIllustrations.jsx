// SVG thumbnail illustrations for every Power BI visual type referenced in exam questions.
// All charts use a 160×90 viewBox so they render uniformly in the preview grid.

const B  = '#2171B5'  // primary blue
const O  = '#E5821F'  // orange
const G  = '#3CA77E'  // green
const R  = '#D44735'  // red
const P  = '#8B6BA5'  // purple
const AX = '#9ca3af'  // axis / tick color
const GR = '#e5e7eb'  // grid line color
const SV = 'w-full h-full'

// ── Shared primitives ─────────────────────────────────────────────────────

function VAxis({ x = 20, y1 = 8, y2 = 72 }) {
  return <line x1={x} y1={y1} x2={x} y2={y2} stroke={AX} strokeWidth="1.2" />
}
function HAxis({ y = 72, x1 = 20, x2 = 155 }) {
  return <line x1={x1} y1={y} x2={x2} y2={y} stroke={AX} strokeWidth="1.2" />
}
function HGrid({ ys = [22, 40, 58], x1 = 20, x2 = 155 }) {
  return <>{ys.map(y => <line key={y} x1={x1} y1={y} x2={x2} y2={y} stroke={GR} strokeWidth="0.8" />)}</>
}

// ── 1. Line Chart ─────────────────────────────────────────────────────────
export function LineChart() {
  const pts = [[28,64],[53,46],[78,54],[103,30],[128,40],[152,20]]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HGrid />
      <VAxis /><HAxis />
      <polyline points={pts.map(p=>p.join(',')).join(' ')}
        fill="none" stroke={B} strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill={B} />)}
    </svg>
  )
}

// ── 2. Bar Chart (horizontal) ─────────────────────────────────────────────
export function BarChart() {
  const bars = [[108,10],[78,24],[130,38],[55,52],[95,66]]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <VAxis x={28} y1={6} y2={76} />
      <HAxis y={76} x1={28} x2={155} />
      {bars.map(([w,y],i)=>(
        <rect key={i} x={29} y={y} width={w} height={10} rx="1.5"
          fill={B} opacity={1-i*0.12} />
      ))}
    </svg>
  )
}

// ── 3. Column Chart (vertical) ────────────────────────────────────────────
export function ColumnChart() {
  const cols = [[65,28],[88,18],[48,40],[72,22],[58,32]]
  const x0 = 22, gap = 25
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HGrid ys={[20,40,60]} />
      <VAxis /><HAxis />
      {cols.map(([h,_],i)=>(
        <rect key={i} x={x0+6+i*gap} y={72-h} width={16} height={h} rx="1.5" fill={B} opacity={0.85} />
      ))}
    </svg>
  )
}

// ── 4. Clustered Bar Chart ────────────────────────────────────────────────
export function ClusteredBarChart() {
  const groups = [[100,75],[65,50],[120,90],[80,60]]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <VAxis x={26} y1={6} y2={80} />
      <HAxis y={80} x1={26} x2={155} />
      {groups.map(([w1,w2],i)=>{
        const y = 10+i*17
        return (
          <g key={i}>
            <rect x={27} y={y} width={w1*0.85} height={7} rx="1" fill={B} />
            <rect x={27} y={y+7} width={w2*0.85} height={7} rx="1" fill={O} />
          </g>
        )
      })}
    </svg>
  )
}

// ── 5. Clustered Column Chart ─────────────────────────────────────────────
export function ClusteredColumnChart() {
  const groups = [[40,30],[55,45],[35,50],[48,36]]
  const x0 = 24, gw = 32
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HGrid ys={[20,40,58]} />
      <VAxis /><HAxis />
      {groups.map(([h1,h2],i)=>(
        <g key={i}>
          <rect x={x0+i*gw+2}   y={72-h1} width={12} height={h1} rx="1" fill={B} />
          <rect x={x0+i*gw+15}  y={72-h2} width={12} height={h2} rx="1" fill={O} />
        </g>
      ))}
    </svg>
  )
}

// ── 6. Stacked Bar Chart ──────────────────────────────────────────────────
export function StackedBarChart() {
  const rows = [[80,50],[60,70],[90,40],[50,80]]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <VAxis x={26} y1={6} y2={78} />
      <HAxis y={78} x1={26} x2={155} />
      {rows.map(([a,b],i)=>{
        const y=10+i*16, scale=0.72
        return (
          <g key={i}>
            <rect x={27} y={y} width={a*scale} height={11} rx="1" fill={B} />
            <rect x={27+a*scale} y={y} width={b*scale} height={11} rx="1" fill={O} />
          </g>
        )
      })}
    </svg>
  )
}

// ── 7. Stacked Column Chart ───────────────────────────────────────────────
export function StackedColumnChart() {
  const cols = [[28,22],[36,18],[22,32],[30,25]]
  const x0 = 28, gw = 32
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HGrid ys={[18,38,58]} />
      <VAxis /><HAxis />
      {cols.map(([a,b],i)=>(
        <g key={i}>
          <rect x={x0+i*gw} y={72-a-b} width={20} height={b} rx="1" fill={O} />
          <rect x={x0+i*gw} y={72-a}   width={20} height={a} rx="1" fill={B} />
        </g>
      ))}
    </svg>
  )
}

// ── 8. Scatter Chart ──────────────────────────────────────────────────────
export function ScatterChart() {
  const dots = [[38,60],[55,45],[72,55],[88,30],[102,48],[118,22],[135,38],[48,70],[90,65],[125,50]]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HGrid /><VAxis /><HAxis />
      {dots.map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill={B} fillOpacity="0.65" />
      ))}
    </svg>
  )
}

// ── 9. Bubble Chart ───────────────────────────────────────────────────────
export function BubbleChart() {
  const bubbles = [[45,55,9],[72,35,14],[100,60,7],[128,28,11],[58,68,6],[115,48,8]]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HGrid /><VAxis /><HAxis />
      {bubbles.map(([x,y,r],i)=>(
        <circle key={i} cx={x} cy={y} r={r} fill={B} fillOpacity="0.5" stroke={B} strokeWidth="1" />
      ))}
    </svg>
  )
}

// ── 10. Pie Chart ─────────────────────────────────────────────────────────
export function PieChart() {
  // Four sectors: 40%, 25%, 20%, 15%
  const cx=80, cy=46, r=34
  const sectors = [
    { start: 0,     end: 0.40,  fill: B },
    { start: 0.40,  end: 0.65,  fill: O },
    { start: 0.65,  end: 0.85,  fill: G },
    { start: 0.85,  end: 1.00,  fill: R },
  ]
  function arc({ start, end, fill }) {
    const a1 = start*2*Math.PI - Math.PI/2
    const a2 = end*2*Math.PI - Math.PI/2
    const x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1)
    const x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2)
    const large = (end-start) > 0.5 ? 1 : 0
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
  }
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      {sectors.map((s,i)=><path key={i} d={arc(s)} fill={s.fill} stroke="white" strokeWidth="1.5"/>)}
    </svg>
  )
}

// ── 11. Donut Chart ───────────────────────────────────────────────────────
export function DonutChart() {
  const cx=80, cy=45, r=32, ir=17
  const sectors = [
    { start:0, end:0.42, fill:B },
    { start:0.42, end:0.65, fill:O },
    { start:0.65, end:0.85, fill:G },
    { start:0.85, end:1, fill:R },
  ]
  function arc({start,end,fill}) {
    const a1=start*2*Math.PI-Math.PI/2, a2=end*2*Math.PI-Math.PI/2
    const ox1=cx+r*Math.cos(a1), oy1=cy+r*Math.sin(a1)
    const ox2=cx+r*Math.cos(a2), oy2=cy+r*Math.sin(a2)
    const ix1=cx+ir*Math.cos(a2), iy1=cy+ir*Math.sin(a2)
    const ix2=cx+ir*Math.cos(a1), iy2=cy+ir*Math.sin(a1)
    const large=(end-start)>0.5?1:0
    return `M ${ox1} ${oy1} A ${r} ${r} 0 ${large} 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${ir} ${ir} 0 ${large} 0 ${ix2} ${iy2} Z`
  }
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      {sectors.map((s,i)=><path key={i} d={arc(s)} fill={s.fill} stroke="white" strokeWidth="1.5"/>)}
      <circle cx={cx} cy={cy} r={ir} fill="white"/>
    </svg>
  )
}

// ── 12. Treemap ───────────────────────────────────────────────────────────
export function Treemap() {
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <rect x="4"  y="4"  width="88" height="56" rx="2" fill={B} />
      <rect x="4"  y="62" width="88" height="24" rx="2" fill={O} />
      <rect x="96" y="4"  width="60" height="38" rx="2" fill={G} />
      <rect x="96" y="44" width="36" height="42" rx="2" fill={R} />
      <rect x="134" y="44" width="22" height="20" rx="2" fill={P} />
      <rect x="134" y="66" width="22" height="20" rx="2" fill="#F0A800" />
    </svg>
  )
}

// ── 13. Matrix Visual ─────────────────────────────────────────────────────
export function MatrixVisual() {
  const cols = [50,85,120,150], rows = [22,36,50,64,78]
  const vals = [
    [B,B,O,O],
    [G,B,B,O],
    [O,G,G,B],
    [R,O,G,G],
  ]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      {/* Header row background */}
      <rect x="2" y="6" width="156" height="14" rx="1" fill={B} opacity="0.15"/>
      {/* Column headers */}
      {cols.map((x,i)=><text key={i} x={x} y="16" fontSize="7" fill="#4b5563" textAnchor="middle">Q{i+1}</text>)}
      {/* Row headers */}
      {rows.map((y,i)=><text key={i} x="28" y={y+2} fontSize="7" fill="#4b5563" textAnchor="middle">{['N','S','E','W'][i]}</text>)}
      {/* Cells with heat color */}
      {vals.map((row,ri)=>row.map((fill,ci)=>(
        <rect key={`${ri}-${ci}`}
          x={cols[ci]-14} y={rows[ri]-9} width={28} height={12} rx="1"
          fill={fill} opacity={0.25+Math.random()*0.3}/>
      )))}
    </svg>
  )
}

// ── 14. Table Visual ──────────────────────────────────────────────────────
export function TableVisual() {
  const rows = [14,26,38,50,62,74]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <rect x="4" y="6" width="152" height="12" rx="1" fill={B} opacity="0.8"/>
      {['Region','Sales','Units','Margin'].map((h,i)=>(
        <text key={i} x={18+i*36} y="15" fontSize="7" fill="white" fontWeight="bold">{h}</text>
      ))}
      {rows.slice(1).map((y,ri)=>(
        <g key={ri}>
          <rect x="4" y={y} width="152" height="11" fill={ri%2===0?'#f9fafb':'white'}/>
          <line x1="4" y1={y} x2="156" y2={y} stroke={GR} strokeWidth="0.6"/>
          {[0,1,2,3].map(ci=>(
            <rect key={ci} x={10+ci*36} y={y+2} width={28} height="7" rx="1" fill="#d1d5db"/>
          ))}
        </g>
      ))}
    </svg>
  )
}

// ── 15. KPI Visual ────────────────────────────────────────────────────────
export function KPIVisual() {
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <text x="80" y="22" fontSize="10" fill="#6b7280" textAnchor="middle">Revenue</text>
      <text x="80" y="52" fontSize="26" fill={B} textAnchor="middle" fontWeight="bold">£820K</text>
      {/* Trend arrow up */}
      <polygon points="88,62 94,72 100,62" fill={G} />
      <text x="80" y="72" fontSize="9" fill={G} textAnchor="middle">▲ 12% vs target</text>
      <line x1="30" y1="80" x2="130" y2="80" stroke={GR} strokeWidth="2"/>
      <rect x="30" y="80" width="60" height="4" rx="2" fill={B}/>
    </svg>
  )
}

// ── 16. Card Visual ───────────────────────────────────────────────────────
export function CardVisual() {
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <text x="80" y="20" fontSize="9" fill="#9ca3af" textAnchor="middle">Total Sales</text>
      <text x="80" y="58" fontSize="32" fill={B} textAnchor="middle" fontWeight="bold">£1.2M</text>
      <text x="80" y="76" fontSize="8" fill="#9ca3af" textAnchor="middle">Last 12 months</text>
    </svg>
  )
}

// ── 17. Funnel Chart ──────────────────────────────────────────────────────
export function FunnelChart() {
  const stages = [
    { w:130, y:8,  fill:B, label:'Leads' },
    { w:100, y:25, fill:O, label:'Qualified' },
    { w:72,  y:42, fill:G, label:'Proposal' },
    { w:48,  y:59, fill:R, label:'Closed' },
  ]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      {stages.map(({w,y,fill},i)=>(
        <rect key={i} x={(160-w)/2} y={y} width={w} height={14} rx="2" fill={fill} opacity="0.85"/>
      ))}
    </svg>
  )
}

// ── 18. Waterfall Chart ───────────────────────────────────────────────────
export function WaterfallChart() {
  // Start, +, -, +, end total
  const bars = [
    { x:20, y:40, h:32, fill:B,    connect:true },   // start
    { x:44, y:28, h:12, fill:G,    connect:true },   // +
    { x:68, y:40, h:16, fill:R,    connect:true },   // -
    { x:92, y:22, h:18, fill:G,    connect:true },   // +
    { x:116,y:30, h:8,  fill:R,    connect:true },   // -
    { x:140,y:22, h:50, fill:B+'bb', connect:false },// end total
  ]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HAxis y={76} x1={14} x2={158}/>
      {bars.map((b,i)=>(
        <g key={i}>
          <rect x={b.x} y={b.y} width={20} height={b.h} rx="1.5" fill={b.fill}/>
          {i<bars.length-1 && (
            <line x1={b.x+20} y1={b.y} x2={bars[i+1].x} y2={b.y} stroke="#d1d5db" strokeWidth="0.8" strokeDasharray="3,2"/>
          )}
        </g>
      ))}
    </svg>
  )
}

// ── 19. Gauge Chart ───────────────────────────────────────────────────────
export function GaugeChart() {
  const cx=80, cy=68, r=44
  function sweepPath(startDeg, endDeg, color, width=10) {
    const s=startDeg*Math.PI/180, e=endDeg*Math.PI/180
    const x1=cx+(r-width)*Math.cos(s), y1=cy+(r-width)*Math.sin(s)
    const x2=cx+r*Math.cos(s),         y2=cy+r*Math.sin(s)
    const x3=cx+r*Math.cos(e),         y3=cy+r*Math.sin(e)
    const x4=cx+(r-width)*Math.cos(e), y4=cy+(r-width)*Math.sin(e)
    return `M ${x1} ${y1} L ${x2} ${y2} A ${r} ${r} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r-width} ${r-width} 0 0 0 ${x1} ${y1} Z`
  }
  // Needle at ~65%
  const needleAngle = (180 + 65*1.8) * Math.PI / 180
  const nx=cx+r*0.8*Math.cos(needleAngle), ny=cy+r*0.8*Math.sin(needleAngle)
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <path d={sweepPath(180,296,R)} fill={R} opacity="0.8"/>
      <path d={sweepPath(296,336,O)} fill={O} opacity="0.8"/>
      <path d={sweepPath(336,360,G)} fill={G} opacity="0.8"/>
      <circle cx={cx} cy={cy} r="5" fill="#374151"/>
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
      <text x={cx} y={cy-16} fontSize="12" fill={B} textAnchor="middle" fontWeight="bold">65%</text>
    </svg>
  )
}

// ── 20. Histogram ─────────────────────────────────────────────────────────
export function Histogram() {
  // Bell-curve-ish heights
  const heights = [8, 18, 32, 48, 56, 52, 40, 24, 12, 5]
  const bw = 12, x0 = 22
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HGrid ys={[18,38,58]} />
      <VAxis /><HAxis />
      {heights.map((h,i)=>(
        <rect key={i} x={x0+i*bw+i*1.5} y={72-h} width={bw} height={h}
          rx="1" fill={B} opacity="0.82"/>
      ))}
    </svg>
  )
}

// ── 21. Area Chart ────────────────────────────────────────────────────────
export function AreaChart() {
  const pts = [[28,64],[53,46],[78,54],[103,30],[128,40],[152,20]]
  const filled = [...pts, [152,72],[28,72]].map(p=>p.join(',')).join(' ')
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HGrid />
      <VAxis /><HAxis />
      <polygon points={filled} fill={B} fillOpacity="0.18"/>
      <polyline points={pts.map(p=>p.join(',')).join(' ')}
        fill="none" stroke={B} strokeWidth="2.5" strokeLinejoin="round"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.5" fill={B}/>)}
    </svg>
  )
}

// ── 22. Decomposition Tree ────────────────────────────────────────────────
export function DecompositionTree() {
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      {/* Root */}
      <rect x="60" y="6" width="40" height="18" rx="4" fill={B}/>
      <text x="80" y="18" fontSize="7" fill="white" textAnchor="middle">Revenue</text>
      {/* Connector lines */}
      <line x1="80" y1="24" x2="30" y2="42" stroke="#9ca3af" strokeWidth="1.2"/>
      <line x1="80" y1="24" x2="80" y2="42" stroke="#9ca3af" strokeWidth="1.2"/>
      <line x1="80" y1="24" x2="130" y2="42" stroke="#9ca3af" strokeWidth="1.2"/>
      {/* Level 2 */}
      {[[12,42],[60,42],[110,42]].map(([x,y],i)=>(
        <g key={i}>
          <rect x={x} y={y} width={38} height="16" rx="3" fill={[O,G,R][i]}/>
          <text x={x+19} y={y+10} fontSize="6.5" fill="white" textAnchor="middle">{['North','South','East'][i]}</text>
        </g>
      ))}
      {/* Level 3 lines + nodes */}
      <line x1="31" y1="58" x2="18" y2="72" stroke="#9ca3af" strokeWidth="1"/>
      <line x1="31" y1="58" x2="44" y2="72" stroke="#9ca3af" strokeWidth="1"/>
      {[[9,72],[35,72]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={28} height="12" rx="2" fill={O} opacity="0.7"/>
      ))}
    </svg>
  )
}

// ── 23. Key Influencers ───────────────────────────────────────────────────
export function KeyInfluencers() {
  const items = [
    { label:'Season', val:95, col:B },
    { label:'Region', val:72, col:O },
    { label:'Price',  val:60, col:R },
    { label:'Channel',val:44, col:G },
  ]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <text x="80" y="13" fontSize="8" fill="#374151" textAnchor="middle" fontWeight="600">↑ Revenue Increases When</text>
      {items.map(({label,val,col},i)=>{
        const y=20+i*16
        return (
          <g key={i}>
            <text x="48" y={y+9} fontSize="7" fill="#6b7280" textAnchor="end">{label}</text>
            <rect x="50" y={y} width={val*1.0} height="11" rx="2" fill={col} opacity="0.82"/>
            <text x={52+val} y={y+9} fontSize="7" fill="#374151">+{val}%</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── 24. Ribbon Chart ──────────────────────────────────────────────────────
export function RibbonChart() {
  // Simplified ribbon — ranked bars that switch order period to period
  const p1 = [[42,B],[28,O],[52,G],[36,R]]
  const p2 = [[58,G],[44,B],[32,R],[24,O]]
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      <HAxis y={76} x1={10} x2={150}/>
      <text x="42" y="84" fontSize="7" fill="#9ca3af" textAnchor="middle">Jan</text>
      <text x="118" y="84" fontSize="7" fill="#9ca3af" textAnchor="middle">Feb</text>
      {/* Period 1 bars */}
      {p1.reduce((acc,[h,c],i)=>{
        const y = acc.top
        acc.els.push(<rect key={`a${i}`} x={10} y={y} width={55} height={h} rx="1" fill={c} opacity="0.85"/>)
        acc.top += h
        return acc
      },{els:[],top:0}).els}
      {/* Period 2 bars */}
      {p2.reduce((acc,[h,c],i)=>{
        const y = acc.top
        acc.els.push(<rect key={`b${i}`} x={90} y={y} width={55} height={h} rx="1" fill={c} opacity="0.85"/>)
        acc.top += h
        return acc
      },{els:[],top:0}).els}
    </svg>
  )
}

// ── 25. Filled Map ────────────────────────────────────────────────────────
export function FilledMap() {
  return (
    <svg viewBox="0 0 160 90" className={SV}>
      {/* Simple stylized map polygons */}
      <polygon points="20,20 75,15 80,45 55,55 18,50" fill={B} opacity="0.6"/>
      <polygon points="80,12 140,18 145,50 85,48 80,12" fill={G} opacity="0.6"/>
      <polygon points="18,52 58,57 65,80 20,82" fill={O} opacity="0.6"/>
      <polygon points="62,58 100,55 115,80 70,82 62,58" fill={R} opacity="0.6"/>
      <polygon points="102,53 148,52 150,82 118,82 102,53" fill={P} opacity="0.6"/>
    </svg>
  )
}

// ── Chart type detection ───────────────────────────────────────────────────

const CHART_REGISTRY = {
  'LineChart':           LineChart,
  'BarChart':            BarChart,
  'ColumnChart':         ColumnChart,
  'ClusteredBarChart':   ClusteredBarChart,
  'ClusteredColumnChart': ClusteredColumnChart,
  'StackedBarChart':     StackedBarChart,
  'StackedColumnChart':  StackedColumnChart,
  'ScatterChart':        ScatterChart,
  'BubbleChart':         BubbleChart,
  'PieChart':            PieChart,
  'DonutChart':          DonutChart,
  'Treemap':             Treemap,
  'MatrixVisual':        MatrixVisual,
  'TableVisual':         TableVisual,
  'KPIVisual':           KPIVisual,
  'CardVisual':          CardVisual,
  'FunnelChart':         FunnelChart,
  'WaterfallChart':      WaterfallChart,
  'GaugeChart':          GaugeChart,
  'Histogram':           Histogram,
  'AreaChart':           AreaChart,
  'DecompositionTree':   DecompositionTree,
  'KeyInfluencers':      KeyInfluencers,
  'RibbonChart':         RibbonChart,
  'FilledMap':           FilledMap,
}

// Returns a chart type key or null. Order matters — check more specific patterns first.
export function detectChartType(text) {
  const t = text.toLowerCase()
  if (t.includes('key influencer'))                          return 'KeyInfluencers'
  if (t.includes('decomposition tree'))                      return 'DecompositionTree'
  if (t.includes('filled map'))                              return 'FilledMap'
  if (t.includes('ribbon chart'))                            return 'RibbonChart'
  if (t.includes('bubble chart'))                            return 'BubbleChart'
  if (t.includes('scatter chart') || t.includes('scatter plot')) return 'ScatterChart'
  if (t.includes('clustered bar') || t.includes('clustered column')) return 'ClusteredBarChart'
  if (t.includes('stacked bar') || t.includes('stacked column'))     return 'StackedBarChart'
  if (t.includes('line chart'))                              return 'LineChart'
  if (t.includes('area chart'))                              return 'AreaChart'
  if (t.includes('waterfall chart') || t.includes('waterfall visual') || /^waterfall\b/.test(t)) return 'WaterfallChart'
  if (t.includes('funnel chart') || /^funnel\b/.test(t))    return 'FunnelChart'
  if (t.includes('pie chart') || /^pie\b/.test(t))          return 'PieChart'
  if (t.includes('donut chart') || t.includes('doughnut'))  return 'DonutChart'
  if (t.includes('treemap') || t.includes('tree map'))      return 'Treemap'
  if (t.includes('bar chart'))                               return 'BarChart'
  if (t.includes('column chart'))                            return 'ColumnChart'
  if (t.includes('histogram'))                               return 'Histogram'
  if (t.includes('kpi visual') || t.includes('kpi card'))   return 'KPIVisual'
  if (t.includes('card visual'))                             return 'CardVisual'
  if (t.includes('gauge'))                                   return 'GaugeChart'
  if (t.includes('matrix visual') || /^matrix\b/.test(t))   return 'MatrixVisual'
  if (t.includes('table visual') || /^table\b/.test(t) || t.includes('data table')) return 'TableVisual'
  if (/\bkpi\b/.test(t) && !t.includes('bar'))              return 'KPIVisual'
  if (/\bcard\b/.test(t) && !t.includes('score') && !t.includes('flash')) return 'CardVisual'
  if (/\bmatrix\b/.test(t))                                  return 'MatrixVisual'
  if (/\btable\b/.test(t))                                   return 'TableVisual'
  if (/\bline\b/.test(t) && !t.includes('baseline') && !t.includes('trend line') && !t.includes('reference line') && !t.includes('guide')) return 'LineChart'
  if (/\bbar\b/.test(t) && !t.includes('progress') && !t.includes('toolbar')) return 'BarChart'
  if (/\bscatter\b/.test(t))                                 return 'ScatterChart'
  if (/\bpie\b/.test(t))                                     return 'PieChart'
  return null
}

// Dispatcher component
export default function ChartIllustration({ type, className = '' }) {
  const Component = CHART_REGISTRY[type]
  if (!Component) return null
  return (
    <div className={className}>
      <Component />
    </div>
  )
}
