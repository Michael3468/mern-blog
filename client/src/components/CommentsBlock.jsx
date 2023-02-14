import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { SideBlock } from './SideBlock';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';

export const CommentsBlock = ({
  items,
  setUserName,
  setCommentClicked,
  children,
  isLoading = true,
}) => {
  const location = useLocation();

  const handleCommentClick = (event) => {
    if (location.pathname.includes('/posts/')) {
      setUserName(event.target.textContent);
      setCommentClicked(true);
    }
  };

  return (
    <SideBlock title="Last Comments">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <Link
                  to={`/posts/${obj.postId}`}
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <ListItemText
                    primary={obj.user.fullName}
                    secondary={obj.text}
                    onClick={handleCommentClick}
                  />
                </Link>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
