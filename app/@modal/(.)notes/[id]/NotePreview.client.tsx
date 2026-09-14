'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api';
import Modal from '../../../../components/Modal/Modal';
import styles from './NoteDetails.module.css';

export default function NotePreviewClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={handleClose}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={styles.tag}>{note.tag}</p>
          <p className={styles.content}>{note.content}</p>
          <p className={styles.date}>{note.createdAt}</p>
        </div>
      </div>
    </Modal>
  );
}