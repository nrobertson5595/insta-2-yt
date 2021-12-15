import React from "react";
import Post from "./Post";

const posts = [
  {
    id: "123",
    username: "Nick",
    userImg: "https://place-puppy.com/300x300",
    img: "https://media.sproutsocial.com/uploads/meme-example.jpg",
    caption: "the first post",
  },
  {
    id: "123",
    username: "Nick",
    userImg: "https://wallpaperaccess.com/full/2213426.jpg",
    img: "https://www.letseatcake.com/wp-content/uploads/2021/04/wholesome-memes-26.jpg",
    caption: "the first post",
  },
];

const Posts = () => {
  return (
    <div>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            id={post.id}
            username={post.username}
            userImg={post.userImg}
            img={post.img}
            caption={post.caption}
          />
        );
      })}
      <Post />
    </div>
  );
};

export default Posts;
