import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const tab = searchParams.get("tab") || "overview";

    if (tab === "overview") {
      // 1. Overview: DAU, WAU, MAU, Today New Users, Aha-Moment Conversion Rate
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const oneWeekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Unique user counts (using either userId or anonymous_id from props)
      const getUniqueUsers = async (since: Date) => {
        const events = await prisma.analyticsEvent.findMany({
          where: { name: "session_started", createdAt: { gte: since } },
          select: { userId: true, props: true },
        });
        const users = new Set();
        for (const e of events) {
          const props = typeof e.props === "object" && e.props !== null ? e.props as any : {};
          const id = e.userId || props.anonymous_id;
          if (id) users.add(id);
        }
        return users.size;
      };

      const dau = await getUniqueUsers(todayStart);
      const wau = await getUniqueUsers(oneWeekAgo);
      const mau = await getUniqueUsers(oneMonthAgo);

      // Today New Users
      const newUsersEvents = await prisma.analyticsEvent.findMany({
        where: { name: "signup_completed", createdAt: { gte: todayStart } },
        select: { userId: true, props: true },
      });
      const todayNewUsers = new Set(
        newUsersEvents.map((e) => e.userId || ((e.props as any)?.anonymous_id))
      ).size;

      // Aha-Moment Conversion (Today)
      const ahaEvents = await prisma.analyticsEvent.findMany({
        where: { name: "core_action_performed", createdAt: { gte: todayStart } },
        select: { userId: true, props: true },
      });
      const todayAhaUsers = new Set(
        ahaEvents.map((e) => e.userId || ((e.props as any)?.anonymous_id))
      ).size;

      const ahaRate = todayNewUsers > 0 ? ((todayAhaUsers / todayNewUsers) * 100).toFixed(1) : 0;

      return NextResponse.json({ dau, wau, mau, todayNewUsers, ahaRate });
    }

    if (tab === "funnel") {
      // Funnel: app_opened -> sign_up_started -> step_profile_entered -> signup_completed
      const events = await prisma.analyticsEvent.groupBy({
        by: ["name"],
        where: {
          name: {
            in: ["app_opened", "sign_up_started", "step_profile_entered", "signup_completed"],
          },
        },
        _count: { id: true },
      });

      const counts: Record<string, number> = {
        app_opened: 0,
        sign_up_started: 0,
        step_profile_entered: 0,
        signup_completed: 0,
      };

      events.forEach((e) => {
        counts[e.name] = e._count.id;
      });

      return NextResponse.json({
        steps: [
          { step: "1. 앱 실행 (app_opened)", count: counts["app_opened"] || 0 },
          { step: "2. 가입 시작 (sign_up_started)", count: counts["sign_up_started"] || 0 },
          { step: "3. 프로필 진입 (step_profile_entered)", count: counts["step_profile_entered"] || 0 },
          { step: "4. 가입 완료 (signup_completed)", count: counts["signup_completed"] || 0 },
        ],
      });
    }

    if (tab === "cohort") {
      // Very basic Cohort logic. Group signup_completed by day.
      // For each day, count how many returned on day 0 to 7.
      const signups = await prisma.analyticsEvent.findMany({
        where: { name: "signup_completed" },
        select: { userId: true, props: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      });

      // Map cohortDate -> { total: X, D0: Y, D1: Z, ... }
      const cohortMap: Record<string, { total: number; days: number[]; users: any[] }> = {};

      for (const e of signups) {
        const id = e.userId || ((e.props as any)?.anonymous_id);
        if (!id) continue;
        const dStr = e.createdAt.toISOString().split("T")[0];
        if (!cohortMap[dStr]) {
          cohortMap[dStr] = { total: 0, days: [0, 0, 0, 0, 0, 0, 0, 0], users: [] };
        }
        cohortMap[dStr].total += 1;
        cohortMap[dStr].users.push({ id, date: e.createdAt.getTime() });
      }

      // Check sessions
      const sessions = await prisma.analyticsEvent.findMany({
        where: { name: "session_started" },
        select: { userId: true, props: true, createdAt: true },
      });

      for (const dStr of Object.keys(cohortMap)) {
        for (const user of cohortMap[dStr].users) {
          // find their sessions
          const userSessions = sessions.filter(
            (s) => (s.userId || (s.props as any)?.anonymous_id) === user.id
          );
          
          const daysHit = new Set<number>();
          for (const s of userSessions) {
            const diffTime = s.createdAt.getTime() - user.date;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= 7) {
              daysHit.add(diffDays);
            }
          }
          
          for (const d of Array.from(daysHit)) {
            cohortMap[dStr].days[d] += 1;
          }
        }
      }

      const results = Object.keys(cohortMap)
        .sort((a, b) => b.localeCompare(a))
        .map((dStr) => {
          const row = cohortMap[dStr];
          return {
            cohort: dStr,
            total: row.total,
            retention: row.days.map((cnt) => (row.total > 0 ? Math.round((cnt / row.total) * 100) : 0)),
          };
        })
        .slice(0, 14); // last 14 cohorts

      return NextResponse.json({ cohorts: results });
    }

    if (tab === "flow") {
      const qUser = searchParams.get("userId");
      if (!qUser) return NextResponse.json({ events: [] });

      const flowEvents = await prisma.analyticsEvent.findMany({
        where: {
          OR: [
            { userId: qUser },
            { props: { path: ["anonymous_id"], equals: qUser } },
          ],
        },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json({
        events: flowEvents.map((e) => ({
          time: e.createdAt.toISOString(),
          name: e.name,
          props: e.props,
        })),
      });
    }

    return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
