import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { PostSkeleton } from './Skeleton';
import { UserInfo } from '../UserInfo';

import { fetchRemovePostComments } from '../../redux/slices/comment';
import { fetchRemovePost } from '../../redux/slices/post';

import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';

import styles from './Post.module.scss';

export const Post = ({
  postId,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  setIsPostDeleted,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) {
    return <PostSkeleton />;
  }

  const handleDeleteIconClick = () => {
    if (window.confirm('Do you really want to delete article?')) {
      const deletePost = new Promise((resolve, reject) => {
        dispatch(fetchRemovePost(postId))
          .then((message) => {
            console.log(message);
            resolve();
          })
          .catch((err) => reject(err));
      });

      const deletePostComments = new Promise((resolve, reject) => {
        dispatch(fetchRemovePostComments(postId))
          .then((message) => {
            console.log(message);
            resolve();
          })
          .catch((err) => reject(err));
      });

      Promise.all([deletePost, deletePostComments])
        .then(() => {
          // cause <FullPost /> don't pass this prop into <Post /> +
          if (typeof setIsPostDeleted === 'function') {
            setIsPostDeleted(true);
          }
          // cause <FullPost /> don't pass this prop into <Post /> -

          navigate('/');
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${postId}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={handleDeleteIconClick} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${postId}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tags/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
