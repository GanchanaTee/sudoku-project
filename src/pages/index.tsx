import React from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';

import styles from '@/styles/Home.module.css';
import Sudoku from '@/containers/sudoku';

const inter = Inter({ subsets: ['latin'] });

const PageHead = () => {
  return (
    <Head>
      <title>Sudoku</title>
      <meta name="description" content="Generated by next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

const MainContent = () => {
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <h1 style={{ marginBottom: '40px' }}>SUDOKU</h1>
      <Sudoku />
    </main>
  );
};

export default function Home() {
  return (
    <>
      <PageHead />
      <MainContent />
    </>
  );
}
