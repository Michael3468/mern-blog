import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate, useParams, Link } from 'react-router-dom';

import axios from '../../axios';
import { selectIsAuth } from '../../redux/slices/auth';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [postData, setPostData] = useState({
    title: '',
    tags: '',
    text: '',
    imageUrl: '',
  });
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setPostData({ ...postData, imageUrl: data.url });
    } catch (err) {
      console.warn(err);
      alert('An error occurred while uploading the file');
    }
  };

  const onClickRemoveImage = () => {
    setPostData({ ...postData, imageUrl: '' });
  };

  const onChange = useCallback(
    (value) => {
      setPostData({ ...postData, text: value });
    },
    [postData]
  );

  const onSubmit = async () => {
    const isTags = postData.tags.trim().length > 0;
    const tagsArray = isTags ? postData.tags.split(',').map((item) => item.trim()) : [];

    try {
      const fields = {
        title: postData.title,
        text: postData.text,
        tags: isTags ? tagsArray : [],
        imageUrl: postData.imageUrl,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('An error occurred when creating post');
    }
  };

  const handleTagsFieldChange = (event) => {
    const tagsFieldValue = event.target.value;
    const tagsValue = tagsFieldValue.trim() !== '' ? tagsFieldValue.trim() : '';
    setPostData({ ...postData, tags: tagsValue });
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setPostData((prev) => ({
            ...prev,
            title: data.title,
            text: data.text,
            tags: data.tags.join(','),
            imageUrl: data.imageUrl,
          }));
        })
        .catch((err) => {
          console.warn(err);
          alert('An error occurred when getting post');
        });
    }
  }, [id]);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter the text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Upload image
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {postData.imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img
            className={styles.image}
            src={`${process.env.REACT_APP_SERVER_URL}${postData.imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Add post title..."
        value={postData.title}
        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        fullWidth
      />
      <TextField
        value={postData.tags}
        onChange={handleTagsFieldChange}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Add tags separated with comma"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={postData.text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'Publish'}
        </Button>
        <Link to="/">
          <Button size="large">Cancel</Button>
        </Link>
      </div>
    </Paper>
  );
};
