import AttendanceClient from './AttendanceClient';

export const metadata = {
    title: 'Site Attendance | MO-NO Smart Verification',
    description: 'GPS 기반 현장 출결 인증 및 안전 장비 착용 상태 확인 시스템.',
};

export default function AttendancePage() {
    return <AttendanceClient />;
}
