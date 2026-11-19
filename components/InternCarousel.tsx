import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './InternCarousel.module.css';

type Intern = {
  id: string;
  name: string;
  experience: string;
  photoUrl: string;
};

export default function InternCarousel() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/api/interns')
      .then((res) => res.json())
      .then(setInterns)
      .catch(console.error);
  }, []);

  const prev = () => setCurrent((prev) => (prev - 1 + interns.length) % interns.length);
  const next = () => setCurrent((prev) => (prev + 1) % interns.length);

  if (!interns.length) {
    return <p>Belum ada data magang.</p>;
  }

  const { name, experience, photoUrl } = interns[current];

  return (
    <div className={styles.carousel}>
      <button className={styles.nav} onClick={prev} aria-label="Sebelumnya">
        ◀
      </button>

      <div className={styles.item} onClick={() => setShowModal(true)}>
        <Image src={photoUrl} alt={name} width={200} height={200} className={styles.photo} />
        <h3>{name}</h3>
      </div>

      <button className={styles.nav} onClick={next} aria-label="Berikutnya">
        ▶
      </button>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Image src={photoUrl} alt={name} width={300} height={300} />
            <h2>{name}</h2>
            <p>{experience}</p>
            <button onClick={() => setShowModal(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
