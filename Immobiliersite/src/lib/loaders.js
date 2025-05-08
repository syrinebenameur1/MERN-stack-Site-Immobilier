import { defer } from "react-router-dom";
import axiosInstance from "../axiosInstance/axios";

export const singlePageLoader = async ({ request, params }) => {
  const res = await axiosInstance.get("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1] || "";
  const postPromise = axiosInstance.get("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export async function profileLoader() {
  const userPostsPromise  = axiosInstance.get("/posts/user");
  const savedPostsPromise = axiosInstance.get("/posts/saved");
  const chatPostsPromise  = axiosInstance.get("/chats");

  return defer({
    userPosts:  userPostsPromise,
    savedPosts: savedPostsPromise,
    chatPosts:  chatPostsPromise,
  });
}
