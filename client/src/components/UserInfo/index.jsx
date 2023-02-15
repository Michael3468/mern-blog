import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <img
        className={styles.avatar}
        src={avatarUrl || '/noavatar.png'}
        alt={fullName || 'deleted user'}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName || 'deleted user'}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
