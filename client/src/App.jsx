import React from "react";
import { Routes, Route } from "react-router-dom";
import BlogTitles from "./Pages/BlogTitles";
import Community from "./Pages/Community";
import Dashboard from "./Pages/Dashboard";
import HomePage from "./Pages/HomePage";
import Layout from "./Pages/Layout";
import RemoveBackground from "./Pages/RemoveBackground";
import RemoveObject from "./Pages/RemoveObject";
import ReviewResume from "./Pages/ReviewResume";
import WriteArticle from "./Pages/WriteArticle";
import GenerateImages from "./Pages/GenerateImages";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="community" element={<Community />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-object" element={<RemoveObject />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
