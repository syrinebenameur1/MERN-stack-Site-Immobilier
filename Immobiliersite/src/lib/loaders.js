import { defer } from "react-router-dom";
import axiosInstance from "../axiosInstance/axios";

export const singlePageLoader = async ({ request, params }) => {
  const res = await axiosInstance("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = axiosInstance("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = axiosInstance("/users/profilePosts");
  const chatPromise = axiosInstance("/chats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};