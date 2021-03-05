import styles from '../styles/components/Profile.module.css';
export function Profile(){
  return (
    <div className={styles.profileContainer}>
      <img src="https://github.com/Luis-MBL.png" alt="Luís Miguel" />
      <div>
        <strong> Luís Miguel </strong>
        <p>
          <img src="icons/level.png" alt="level" />
          Level 1
        </p>
      </div>
    </div>
  )
}