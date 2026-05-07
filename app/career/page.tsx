import React from 'react';
import styles from './career.module.css';
import CareerClient from './CareerClient';

export const metadata = {
  title: 'Digital Career Passport | MO-NO Technical Assetization',
  description: '글로벌 표준 기술 자산 증명 및 커리어 리포트.',
};

export default function CareerPage() {
  return (
    <div className={styles.page}>
      <CareerClient />
    </div>
  );
}
