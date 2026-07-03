const fs = require('fs');
const file = '/Users/yunhyeok/mono/web/app/mono/MonoApp.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [insights, setInsights]')) {
  // Add state
  content = content.replace(
    'const [interests, setInterests] = useState([]);',
    'const [interests, setInterests] = useState([]);\n  const [insights, setInsights] = useState([]);\n  useEffect(() => {\n    fetch("/api/insights").then(r=>r.json()).then(d=>{\n      if(d.ok) setInsights(d.insights || []);\n    }).catch(()=>{});\n  }, []);'
  );

  // Add UI
  const ui = `
          {/* AI 인사이트 공지사항 영역 */}
          {insights.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#4f46e5)" }}>AI 추천 공지</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {insights.map((insight, idx) => (
                  <div key={idx} style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px", padding: "16px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#fff", background: "var(--c1,#4f46e5)", padding: "3px 8px", borderRadius: "7px" }}>{insight.type === "URGENT_JOB" ? "긴급" : insight.type === "WEATHER_INFO" ? "날씨" : "공지"}</span>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#111" }}>{insight.title}</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.4", marginBottom: "12px" }}>
                      {insight.content}
                    </div>
                    {insight.linkText && (
                      <div style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--c1,#4f46e5)", display: "flex", alignItems: "center", gap: "4px" }}>
                        {insight.linkText} <span>›</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
  `;

  content = content.replace(
    '{/* 오늘의 추천 현장',
    ui + '\n          {/* 오늘의 추천 현장'
  );

  fs.writeFileSync(file, content);
  console.log('Patched MonoApp.tsx');
} else {
  console.log('Already patched');
}
