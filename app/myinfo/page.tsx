import React from 'react';
import styles from './myinfo.module.css';
import MyInfoClient from './MyInfoClient';

export const metadata = {
  title: '내 정보 | MoNo 사용자 앱',
  description: '내 프로필 및 안전 서류함 관리',
};

export default function MyInfoPage() {
  return (
    <div className={styles.page}>
      <MyInfoClient />
    </div>
  );
}
