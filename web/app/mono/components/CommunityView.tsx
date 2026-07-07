"use client";

import React, { useState, useEffect } from "react";

interface Author {
  id: string;
  name: string | null;
  role: string;
}

interface Post {
  id: string;
  channel: string;
  subChannel: string;
  title: string;
  content: string;
  authorId: string;
  author: Author;
  likes: number;
  helps: number;
  reported: boolean;
  ratings?: {
    commute?: number;
    food?: number;
    lodging?: number;
    env?: number;
    settle?: number;
    beginner?: number;
    rehire?: number;
  } | null;
  createdAt: string;
  _count?: {
    comments: number;
  };
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: Author;
  content: string;
  createdAt: string;
}

const BAD_WORDS = ["시발", "개새끼", "쌍놈", "지랄", "존나", "병신", "미친", "호로"];
function maskBadWords(text: string): string {
  let masked = text;
  BAD_WORDS.forEach((word) => {
    const regex = new RegExp(word, "gi");
    masked = masked.replace(regex, "*".repeat(word.length));
  });
  return masked;
}

export default function CommunityView({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<"PRIME" | "REGION" | "ROLE" | "LEADER" | "CHAT">("PRIME");
  const [subChannel, setSubChannel] = useState<string>("삼성 평택");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // overlays
  const [detailPost, setDetailPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [writeOpen, setWriteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // write post form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [ratings, setRatings] = useState({
    commute: 5,
    food: 5,
    lodging: 5,
    env: 5,
    settle: 5,
    beginner: 5,
    rehire: 5,
  });

  // Chat Room Mockup States
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [chatRooms, setChatRooms] = useState([
    { id: 1, name: "김반장 (형틀 5팀장)", subtitle: "김반장 형틀크루 · 출근 확정 확인", badge: "리더", unread: 1, avatar: "👷" },
    { id: 2, name: "삼성물산 채용담당자", subtitle: "삼성 평택 P4 현장 · 서류 미비 안내", badge: "원청", unread: 0, avatar: "🏢" },
    { id: 3, name: "현대건설 안전관리실", subtitle: "송도 아파트 현장 · 안전교육 공지", badge: "원청", unread: 0, avatar: "🛡️" },
  ]);
  const [chatMessages, setChatMessages] = useState<Record<number, Array<{ sender: "me" | "other"; text: string; time: string }>>>({
    1: [
      { sender: "other", text: "반장님, 내일 오전 06:40까지 평택 P4 3번 게이트 앞으로 신분증 꼭 지참해서 집결해 주시기 바랍니다.", time: "오전 09:20" },
      { sender: "me", text: "네 알겠습니다. 내일 지각 없이 참석하겠습니다.", time: "오전 09:25" },
      { sender: "other", text: "혹시 기초안전보건교육 이수증 사진도 준비되셨나요?", time: "오후 02:10" },
    ],
    2: [
      { sender: "other", text: "지원서 검토 결과, 전자카드가 아직 등록되지 않았습니다. 출근을 위해 전자카드를 미리 모바일로 발급해 주세요.", time: "어제" },
    ],
    3: [
      { sender: "other", text: "안전교육 미이수자는 내일 당일 게이트 통과가 불가능합니다. 오늘 18시 전까지 이수증 사진을 업로드 완료해 주세요.", time: "3일 전" },
    ],
  });

  const CHAT_TEMPLATES = [
    "확인했습니다. 내일 시간 맞춰 출근하겠습니다.",
    "준비물과 신분증 모두 지참 완료했습니다.",
    "부족한 전자카드/안전교육 이수증 등록을 완료했습니다.",
    "혹시 집결지 상세 위치를 다시 안내받을 수 있을까요?",
    "부득이한 사정으로 내일 출근이 어려울 것 같습니다. 미리 죄송합니다."
  ];

  // static channels config
  const CHANNELS = {
    PRIME: ["삼성 평택", "SK 청주", "현대중공업 울산", "대형 플랜트"],
    REGION: ["서울", "인천", "평택", "거제 조선소", "울산 플랜트"],
    ROLE: ["배관", "전기", "용접", "형틀목공", "화재감시", "유도원"],
    LEADER: ["김반장 형틀크루", "박팀장 전기크루"],
    CHAT: [],
  };

  // load posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community/posts?channel=${activeTab}&subChannel=${subChannel}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "CHAT") return;
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, subChannel]);

  // tab change resets subchannel
  const handleTabChange = (tab: "PRIME" | "REGION" | "ROLE" | "LEADER" | "CHAT") => {
    setActiveTab(tab);
    if (CHANNELS[tab].length > 0) {
      setSubChannel(CHANNELS[tab][0]);
    } else {
      setSubChannel("");
    }
  };

  // select post detail
  const handlePostClick = async (post: Post) => {
    try {
      const res = await fetch(`/api/community/posts/${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setDetailPost(data);
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Failed to load post detail", err);
    }
  };

  // write post submit
  const handleWriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    // 금칙어 마스킹 적용
    const cleanTitle = maskBadWords(newTitle);
    const cleanContent = maskBadWords(newContent);

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          channel: activeTab,
          subChannel,
          title: cleanTitle,
          content: cleanContent,
          authorId: userId,
          ratings: activeTab === "PRIME" ? ratings : undefined,
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setWriteOpen(false);
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to write post", err);
    }
  };

  // comment submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !detailPost) return;

    // 금칙어 마스킹 적용
    const cleanComment = maskBadWords(newComment);

    try {
      const res = await fetch(`/api/community/posts/${detailPost.id}/comment`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          authorId: userId,
          content: cleanComment,
        }),
      });

      if (res.ok) {
        const commentData = await res.json();
        setComments((c) => [...c, commentData]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to write comment", err);
    }
  };

  // like post
  const handleLike = async () => {
    if (!detailPost) return;
    try {
      const res = await fetch(`/api/community/posts/${detailPost.id}/like`, { method: "POST" });
      if (res.ok) {
        setDetailPost((p) => (p ? { ...p, likes: p.likes + 1 } : null));
        setPosts((prev) => prev.map((p) => (p.id === detailPost.id ? { ...p, likes: p.likes + 1 } : p)));
      }
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  // help post
  const handleHelp = async () => {
    if (!detailPost) return;
    try {
      const res = await fetch(`/api/community/posts/${detailPost.id}/help`, { method: "POST" });
      if (res.ok) {
        setDetailPost((p) => (p ? { ...p, helps: p.helps + 1 } : null));
        setPosts((prev) => prev.map((p) => (p.id === detailPost.id ? { ...p, helps: p.helps + 1 } : p)));
      }
    } catch (err) {
      console.error("Failed to help post", err);
    }
  };

  // report post submit
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailPost || !reportReason.trim()) return;

    try {
      const res = await fetch(`/api/community/posts/${detailPost.id}/report`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          targetType: "POST",
          reporterId: userId,
          reason: reportReason,
        }),
      });

      if (res.ok) {
        setReportOpen(false);
        setReportReason("");
        alert("신고가 정상 접수되었습니다. 관리자 검토 후 조치됩니다.");
      }
    } catch (err) {
      console.error("Failed to report post", err);
    }
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", position: "relative" }}>
      {/* 1. Header Segment Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #eef0f6", background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
        {(["PRIME", "REGION", "ROLE", "LEADER", "CHAT"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              flex: 1,
              padding: "14px 0",
              border: "none",
              background: "none",
              fontSize: "14px",
              fontWeight: activeTab === tab ? "800" : "600",
              color: activeTab === tab ? "var(--c1,#4f46e5)" : "#8694a8",
              borderBottom: activeTab === tab ? "3px solid var(--c1,#4f46e5)" : "3px solid transparent",
              cursor: "pointer",
            }}
          >
            {tab === "PRIME" ? "원청방" : tab === "REGION" ? "지역방" : tab === "ROLE" ? "직무방" : tab === "LEADER" ? "그룹방" : "채팅"}
          </button>
        ))}
      </div>

      {/* 2. Subchannels list (horizontal scroll) */}
      {CHANNELS[activeTab].length > 0 && (
        <div style={{ display: "flex", gap: "8px", padding: "10px 16px", overflowX: "auto", background: "#f8f9fc", borderBottom: "1px solid #eef0f6", WebkitOverflowScrolling: "touch" }}>
          {CHANNELS[activeTab].map((ch) => (
            <button
              key={ch}
              onClick={() => setSubChannel(ch)}
              style={{
                flex: "none",
                padding: "8px 14px",
                borderRadius: "999px",
                border: "none",
                fontSize: "13px",
                fontWeight: "700",
                background: subChannel === ch ? "var(--c1,#4f46e5)" : "#fff",
                color: subChannel === ch ? "#fff" : "#5b6b82",
                boxShadow: subChannel === ch ? "none" : "0 2px 6px rgba(0,0,0,0.04)",
                cursor: "pointer",
              }}
            >
              {ch}
            </button>
          ))}
        </div>
      )}

      {/* 3. Main Content Feed */}
      {activeTab === "CHAT" ? (
        <div style={{ flex: 1, padding: "18px 20px 80px", display: "flex", flexDirection: "column", gap: "14px", background: "#f8f9fc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ fontSize: "16px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>📥 내 대화방 목록 ({chatRooms.length}개)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  setChatRooms(prev => prev.map(r => r.id === room.id ? { ...r, unread: 0 } : r));
                }}
                style={{
                  background: "#fff", border: "2px solid #e6e8ec", borderRadius: "20px", padding: "16px 18px",
                  display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", position: "relative",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.04)"
                }}
              >
                {/* 아바타 */}
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#f1f3f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                  {room.avatar}
                </div>
                
                {/* 대화 정보 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>{room.name}</span>
                    <span style={{
                      fontSize: "11px", fontWeight: "900", padding: "3px 8px", borderRadius: "6px",
                      background: room.badge === "리더" ? "#ecfdf5" : "#eff6ff",
                      color: room.badge === "리더" ? "#10b981" : "#2563eb"
                    }}>{room.badge}</span>
                  </div>
                  <div style={{ fontSize: "13.5px", color: "#5b6b82", fontWeight: "700", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {room.subtitle}
                  </div>
                </div>

                {/* 안읽음 배지 */}
                {room.unread > 0 && (
                  <span style={{
                    width: "22px", height: "22px", borderRadius: "50%", background: "#ef4444",
                    color: "#fff", fontSize: "11px", fontWeight: "900", display: "flex",
                    alignItems: "center", justifyContent: "center", flex: "none"
                  }}>
                    {room.unread}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* 1:1 안전 대화창 오버레이 */}
          {selectedRoom && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 120, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div style={{ background: "#fff", width: "100%", maxWidth: "480px", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", padding: "24px 20px 28px", display: "flex", flexDirection: "column", height: "85vh" }}>
                
                {/* 대화창 헤더 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: "1.5px solid #eef0f6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "24px" }}>{selectedRoom.avatar}</span>
                    <div>
                      <div style={{ fontSize: "17px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>{selectedRoom.name}</div>
                      <div style={{ fontSize: "12.5px", color: "#4f46e5", fontWeight: "800" }}>🔒 욕설 및 체불 예방 대화방</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedRoom(null)} style={{ border: "none", background: "none", fontSize: "18px", fontWeight: "900", cursor: "pointer", color: "#8694a8", padding: "6px" }}>닫기</button>
                </div>

                {/* 메시지 영역 */}
                <div className="scr" style={{ flex: 1, overflowY: "auto", padding: "18px 4px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(chatMessages[selectedRoom.id] || []).map((msg, idx) => {
                    const isMe = msg.sender === "me";
                    return (
                      <div key={idx} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "8px" }}>
                        {!isMe && (
                          <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f1f3f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginRight: "2px", flex: "none" }}>{selectedRoom.avatar}</span>
                        )}
                        {isMe && <span style={{ fontSize: "11px", color: "#8694a8", fontWeight: "700" }}>{msg.time}</span>}
                        
                        <div style={{
                          maxWidth: "75%", padding: "12px 16px", borderRadius: "16px", fontSize: "15px", fontWeight: "800", lineHeight: "1.5",
                          background: isMe ? "var(--c1,#4f46e5)" : "#f1f3f7",
                          color: isMe ? "#fff" : "var(--c1,#1F2226)",
                          borderBottomRightRadius: isMe ? "2px" : "16px",
                          borderBottomLeftRadius: isMe ? "16px" : "2px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                          wordBreak: "keep-all"
                        }}>
                          {msg.text}
                        </div>

                        {!isMe && <span style={{ fontSize: "11px", color: "#8694a8", fontWeight: "700" }}>{msg.time}</span>}
                      </div>
                    );
                  })}
                </div>

                {/* 템플릿 선택 전송 패널 */}
                <div style={{ borderTop: "1.5px solid #eef0f6", paddingTop: "14px" }}>
                  <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#5b6b82", marginBottom: "10px" }}>💬 아래 문구를 눌러 안전하게 답장해보세요:</div>
                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", paddingBottom: "12px" }}>
                    {CHAT_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl}
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          const timeStr = `${now.getHours() >= 12 ? '오후' : '오전'} ${String(now.getHours() % 12 || 12).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                          const nextMsg = { sender: "me" as const, text: tmpl, time: timeStr };
                          
                          setChatMessages(prev => ({
                            ...prev,
                            [selectedRoom.id]: [...(prev[selectedRoom.id] || []), nextMsg]
                          }));
                          
                          // 최신 요약 업데이트
                          setChatRooms(rooms => rooms.map(r => r.id === selectedRoom.id ? { ...r, subtitle: `나: ${tmpl}` } : r));
                        }}
                        style={{
                          flex: "none", padding: "10px 16px", border: "1.5px solid #4f46e5", borderRadius: "12px",
                          background: "#eff6ff", color: "#2563eb", fontSize: "14px", fontWeight: "900", cursor: "pointer",
                          whiteSpace: "nowrap",
                          boxShadow: "0 4px 8px rgba(79,70,229,0.08)"
                        }}
                      >
                        {tmpl}
                      </button>
                    ))}
                  </div>

                  {/* 입력창 비활성화 안내 */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    <input
                      disabled
                      type="text"
                      placeholder="체불 및 욕설 시비를 예방하기 위해 안전 템플릿 전송만 지원합니다."
                      style={{ flex: 1, padding: "12px 14px", border: "2px solid #e6e8ec", borderRadius: "12px", background: "#f8f9fc", fontSize: "13px", fontWeight: "700", color: "#8694a8" }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, padding: "16px 20px 80px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#8694a8" }}>불러오는 중…</div>
          ) : posts.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>📝</div>
              <div style={{ fontSize: "14.5px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>첫 게시글을 남겨주세요!</div>
              <div style={{ fontSize: "12px", color: "#8694a8", marginTop: "4px" }}>현장에 대한 소식, 질문, 조언을 나눌 수 있습니다.</div>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                style={{
                  background: "#fff",
                  border: "1px solid #e6e8ec",
                  borderRadius: "18px",
                  padding: "16px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--c1,#4f46e5)", background: "var(--soft,#ecedfb)", padding: "3px 8px", borderRadius: "6px" }}>
                    {post.subChannel}
                  </span>
                  <span style={{ fontSize: "12px", color: "#8694a8" }}>{fmtDate(post.createdAt)}</span>
                </div>
                <h4 style={{ margin: "10px 0 6px", fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>
                  {post.title}
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#5b6b82", lineHeight: "1.45", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {post.content}
                </p>

                {/* Prime room overall stars */}
                {post.ratings && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px", padding: "8px 10px", background: "#f8f9fc", borderRadius: "10px", fontSize: "12px", color: "#b4690e", fontWeight: "700" }}>
                    ⭐ 평균 평점: {((Object.values(post.ratings).reduce((a, b) => a + (b || 5), 0) / 7).toFixed(1))} / 5.0
                  </div>
                )}

                <div style={{ display: "flex", gap: "14px", marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "10px", fontSize: "12px", color: "#8694a8", fontWeight: "600" }}>
                  <span>👍 도움돼요 {post.helps}</span>
                  <span>❤️ 좋아요 {post.likes}</span>
                  <span>💬 댓글 {post._count?.comments ?? 0}</span>
                  <span style={{ marginLeft: "auto" }}>👤 {post.author.name || "익명 기술자"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Floating write button */}
      {activeTab !== "CHAT" && (
        <button
          onClick={() => setWriteOpen(true)}
          style={{
            position: "absolute",
            bottom: "94px",
            right: "20px",
            width: "56px",
            height: "56px",
            borderRadius: "28px",
            background: "var(--c1,#4f46e5)",
            color: "#fff",
            border: "none",
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(79,70,229,0.3)",
            cursor: "pointer",
            zIndex: 15,
          }}
        >
          ✏️
        </button>
      )}

      {/* 4. Write Post Overlay */}
      {writeOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "480px", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", maxHeight: "88vh", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{activeTab === "PRIME" ? "원청방 평가 작성" : "커뮤니티 글쓰기"}</span>
              <button onClick={() => setWriteOpen(false)} style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "#8694a8" }}>닫기</button>
            </div>

            <form onSubmit={handleWriteSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "700", color: "#5b6b82", display: "block", marginBottom: "6px" }}>채널</label>
                <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--c1,#4f46e5)" }}>{activeTab === "PRIME" ? "대형 원청 현장방" : activeTab === "REGION" ? "지역 특화방" : "직무 전문 정보방"} &gt; {subChannel}</div>
              </div>

              {/* Prime structured ratings block */}
              {activeTab === "PRIME" && (
                <div style={{ background: "#f8f9fc", borderRadius: "18px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "4px" }}>📊 현장 정량 평가 (1~5점)</div>
                  {[
                    { key: "commute", label: "출근 난이도 (집결지, 대기 시간 등)" },
                    { key: "food", label: "식사 만족도 (대기, 질 등)" },
                    { key: "lodging", label: "숙소 상태 (거리, 청결 등)" },
                    { key: "env", label: "근무 환경 (화장실, 안전 등)" },
                    { key: "settle", label: "정산 지급 (일정 준수 등)" },
                    { key: "beginner", label: "초보자 적응 편의성" },
                    { key: "rehire", label: "재방문 의향" },
                  ].map((item) => (
                    <div key={item.key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: "600", color: "#5b6b82" }}>
                        <span>{item.label}</span>
                        <span style={{ color: "#b4690e" }}>{ratings[item.key as keyof typeof ratings]}점</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={ratings[item.key as keyof typeof ratings]}
                        onChange={(e) => setRatings({ ...ratings, [item.key]: Number(e.target.value) })}
                        style={{ width: "100%", accentColor: "var(--c1,#4f46e5)" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label htmlFor="post-title" style={{ fontSize: "12.5px", fontWeight: "700", color: "#5b6b82", display: "block", marginBottom: "6px" }}>제목</label>
                <input
                  id="post-title"
                  type="text"
                  placeholder="제목을 입력하세요 (금칙어 마스킹)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #e6e8ec", borderRadius: "12px", outline: "none", fontSize: "14px" }}
                  required
                />
              </div>

              <div>
                <label htmlFor="post-content" style={{ fontSize: "12.5px", fontWeight: "700", color: "#5b6b82", display: "block", marginBottom: "6px" }}>내용</label>
                <textarea
                  id="post-content"
                  placeholder="내용을 구체적으로 기재해주세요. 비속어, 특정 개인 실명 비방은 블라인드 및 이용 제재 조치됩니다."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{ width: "100%", height: "120px", padding: "12px 14px", border: "1px solid #e6e8ec", borderRadius: "12px", outline: "none", fontSize: "14px", resize: "none" }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{ marginTop: "10px", height: "48px", border: "none", borderRadius: "12px", background: "var(--c1,#4f46e5)", color: "#fff", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}
              >
                게시물 등록하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Post Detail Overlay */}
      {detailPost && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 90, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "480px", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", maxHeight: "92vh", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--c1,#4f46e5)" }}>{detailPost.subChannel}</span>
              <button onClick={() => setDetailPost(null)} style={{ border: "none", background: "none", fontSize: "16px", cursor: "pointer", color: "#8694a8" }}>닫기</button>
            </div>

            <h3 style={{ margin: "0 0 10px", fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{detailPost.title}</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#8694a8", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <span>작성자: {detailPost.author.name || "익명 기술자"}</span>
              <span>{fmtDate(detailPost.createdAt)}</span>
            </div>

            {/* Ratings report chart */}
            {detailPost.ratings && (
              <div style={{ margin: "16px 0", padding: "14px", background: "#f8f9fc", borderRadius: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "10px" }}>🌟 현장 평가 리포트</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { key: "commute", label: "출근 난이도" },
                    { key: "food", label: "식사 만족도" },
                    { key: "lodging", label: "숙소 상태" },
                    { key: "env", label: "근무 환경" },
                    { key: "settle", label: "정산/지급" },
                    { key: "beginner", label: "초보 적응" },
                    { key: "rehire", label: "재방문 의향" },
                  ].map((item) => {
                    const score = detailPost.ratings?.[item.key as keyof typeof detailPost.ratings] || 5;
                    return (
                      <div key={item.key} style={{ display: "flex", alignItems: "center", fontSize: "12.5px" }}>
                        <span style={{ width: "90px", color: "#5b6b82", fontWeight: "600" }}>{item.label}</span>
                        <div style={{ flex: 1, height: "6px", background: "#eef0f3", borderRadius: "3px", margin: "0 10px", overflow: "hidden" }}>
                          <div style={{ width: `${(score / 5) * 100}%`, height: "100%", background: "#f59e0b", borderRadius: "3px" }}></div>
                        </div>
                        <span style={{ width: "24px", color: "#b4690e", fontWeight: "700", textAlign: "right" }}>{score}점</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p style={{ fontSize: "14.5px", color: "#1f2937", lineHeight: "1.6", whiteSpace: "pre-wrap", margin: "16px 0" }}>
              {detailPost.content}
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button onClick={handleHelp} style={{ flex: 1, height: "40px", border: "1px solid #e6e8ec", borderRadius: "10px", background: "#fff", color: "#5b6b82", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>👍 도움돼요 {detailPost.helps}</button>
              <button onClick={handleLike} style={{ flex: 1, height: "40px", border: "1px solid #e6e8ec", borderRadius: "10px", background: "#fff", color: "#5b6b82", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>❤️ 좋아요 {detailPost.likes}</button>
              <button onClick={() => setReportOpen(true)} style={{ height: "40px", padding: "0 12px", border: "1px solid #fecaca", borderRadius: "10px", background: "#fffdfd", color: "#ef4444", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>🚨 신고</button>
            </div>

            {/* Comments list */}
            <div style={{ borderTop: "1px solid #eef0f6", paddingTop: "16px" }}>
              <h4 style={{ margin: "0 0 12px", fontSize: "14.5px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>댓글 ({comments.length})</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {comments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "#8694a8", fontSize: "12.5px" }}>등록된 댓글이 없습니다.</div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} style={{ background: "#f8f9fc", borderRadius: "12px", padding: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#8694a8", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "700" }}>{comment.author.name || "익명 기술자"}</span>
                        <span>{fmtDate(comment.createdAt)}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "13px", color: "#374151", lineHeight: "1.45" }}>{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment form */}
              <form onSubmit={handleCommentSubmit} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="댓글을 달아보세요 (금칙어 마스킹)"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ flex: 1, padding: "12px", border: "1px solid #e6e8ec", borderRadius: "10px", outline: "none", fontSize: "13.5px" }}
                  required
                />
                <button type="submit" style={{ padding: "0 18px", border: "none", borderRadius: "10px", background: "var(--c1,#4f46e5)", color: "#fff", fontSize: "13.5px", fontWeight: "800", cursor: "pointer" }}>등록</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 6. Report Dialog */}
      {reportOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", width: "100%", maxWidth: "340px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>신고하기</h3>
            <form onSubmit={handleReportSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "비방/욕설/혐오 표현",
                "허위 사실 유포 및 거짓 소문",
                "개인정보 유출 위험",
                "업체 허위 비방 및 평판 훼손",
                "기타 부적절한 게시물",
              ].map((reason) => (
                <label key={reason} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#374151", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="report-reason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    style={{ accentColor: "#ef4444" }}
                    required
                  />
                  {reason}
                </label>
              ))}
              <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                <button type="button" onClick={() => setReportOpen(false)} style={{ flex: 1, height: "40px", border: "1px solid #e6e8ec", borderRadius: "10px", background: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>취소</button>
                <button type="submit" style={{ flex: 1, height: "40px", border: "none", borderRadius: "10px", background: "#ef4444", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>신고 제출</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
