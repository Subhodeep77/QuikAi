import ai from "../config/ai.js";
import { clerkClient } from "@clerk/express";
import Creation from "../models/creation.js";
import { v2 as cloudinary } from 'cloudinary';
import FormData from "form-data";
import axios from "axios"

export const generateArticle = async (req, res) => {
    try {
        const { prompt, length } = req.body;
        const { userId } = req.auth();
        const plan = req.plan;
        const free_usage = req.free_usage;
        if (plan === 'free' && free_usage >= 10) {
            return res.status(403).json({ message: "Free usage limit reached. Please upgrade to premium." });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: length || 500,
        });

        const responseText = response.choices[0].message.content;

        await Creation.create({
            user_id: userId,
            prompt: prompt,
            content: responseText,
            type: "article",
        });

        if (plan === 'free') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1,
                }
            });
        }

        res.json({ success: true, article: responseText });

    } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({ message: "Failed to generate article" });
    }
};

export const generateBlogTitle = async (req, res) => {
    try {
        const { prompt } = req.body;
        const { userId } = req.auth();
        const plan = req.plan;
        const free_usage = req.free_usage;
        if (plan === 'free' && free_usage >= 10) {
            return res.status(403).json({ message: "Free usage limit reached. Please upgrade to premium." });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        const responseText = response.choices[0].message.content;

        await Creation.create({
            user_id: userId,
            prompt: prompt,
            content: responseText,
            type: "blog-title",
        });

        if (plan === 'free') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1,
                }
            });
        }

        res.json({ success: true, blog_title: responseText });

    } catch (error) {
        console.error("Error generating blog title:", error);
        res.status(500).json({ message: "Failed to generate blog title" });
    }
};

export const generateImage = async (req, res) => {
    try {
        const { prompt, publish } = req.body;
        const { userId } = req.auth();
        const plan = req.plan;

        if (plan === 'free') {
            return res.status(403).json({ success: false, message: "This feature is only available to premium users." });
        }

        const form = new FormData()
        form.append('prompt', prompt);
        const { data } = await axios.post(
            `${process.env.CLIPDROP_AI_API_URL}`,
            form,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                },
                responseType: 'arraybuffer',
            }
        );


        const base64Image = `data:image/png;base64,${Buffer.from(data).toString("base64")}`;
        const { secure_url } = await cloudinary.uploader.upload(base64Image);
        await Creation.create({
            user_id: userId,
            prompt: prompt,
            content: secure_url,
            type: "image",
            publish,
        });

        res.json({ success: true, content: secure_url });

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ message: "Failed to generate image" });
    }
};