import React from 'react';
import styles from '@styles/posts.module.scss';
import skeleton from '@styles/skeleton.module.scss';

const SkeletonPost = () => {
  return (
    <div className={styles['flex']}>
      <div className={styles['vote']}>
        <div className={styles['like']}>
          <div className={skeleton['like']}></div>
        </div>
        <div className={styles['dislike']}>
          <div className={skeleton['dislike']}></div>
        </div>
      </div>
      <div className={styles['post']}>
        <div className={styles['post-header']}>
          <div className={styles['post-date']}>
            <div className={skeleton['date']}></div>
          </div>
          <div className={styles['post-author']}>
            <div className={skeleton['avatar']}></div>
            <div className={styles['author-name']}>
              <div className={skeleton['author']}></div>
            </div>
          </div>
        </div>
        <div className={styles['post-title']}>
          <div className={skeleton['title']}></div>
        </div>
        <div className={styles['divider']}></div>
        <div className={styles['post-body']}>
          <div className={skeleton['body']}></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPost;
