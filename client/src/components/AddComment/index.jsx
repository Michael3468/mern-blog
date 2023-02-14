import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axios from '../../axios';
import { fetchCommentsByPostId } from '../../redux/slices/comment';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

export const AddComment = ({
  postId,
  setIsCommentAdded,
  isCommentClicked,
  setCommentClicked,
  userName = '',
}) => {
  const userData = useSelector((state) => state.auth.data);
  const [comment, setComment] = useState(userName !== '' ? `@${userName}, ` : '');
  const dispatch = useDispatch();

  const handleAddCommentClick = async () => {
    try {
      const fields = {
        postId,
        user: userData._id,
        text: comment.trim(),
      };

      await axios.post('/comment-create', fields);

      setComment('');
      setIsCommentAdded(true);
      dispatch(fetchCommentsByPostId(postId));
    } catch (err) {
      console.warn(err);
      alert('An error occurred when creating comment');
    }
  };

  useEffect(() => {
    if (userName !== '' && isCommentClicked) {
      if (comment.length === 0) {
        setComment(`@${userName}, `);
      } else {
        setComment((prev) => `@${userName}, ${prev}`);
      }
      setCommentClicked(false);
    }
  }, [userName, isCommentClicked, setCommentClicked, comment]);

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={userData?.avatarUrl} />
        <div className={styles.form}>
          <TextField
            label="Write comment"
            value={comment}
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            disabled={
              comment.length === 0 || (comment.trim() === `@${userName},` && comment.length > 0)
            }
            onClick={handleAddCommentClick}
            variant="contained"
          >
            Add comment
          </Button>
        </div>
      </div>
    </>
  );
};
