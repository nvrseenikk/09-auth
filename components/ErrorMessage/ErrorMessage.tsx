import styles from './ErrorMessage.module.css';

export default function ErrorMessage() {
  return <p className={styles.text}>Произошла ошибка, пожалуйста, попробуйте еще раз...</p>;
}