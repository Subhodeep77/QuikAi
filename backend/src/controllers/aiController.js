import ai from "../config/ai.js";
import { clerkClient } from "@clerk/express";
import Creation from "../models/creation.js";
import { v2 as cloudinary } from 'cloudinary';
import FormData from "form-data";
import axios from "axios"
import fs from 'fs';
import { parsePDF } from "../utils/parsePdf.js";


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
            max_tokens: Math.min(length * 2, 4000),
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

        return res.status(200).json({
            success: true,
            content: responseText
        });

    } catch (error) {
        console.error("Error generating article:", error);
        return res.status(500).json({ message: "Failed to generate article" });
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
            temperature: 0.6,
            max_tokens: 300,
        });

        const responseText = response.choices[0].message.content;
        console.log(response.choices[0].message.content);

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

        return res.status(200).json({
            success: true,
            content: responseText
        });

    } catch (error) {
        console.error("Error generating blog title:", error);
        return res.status(500).json({ message: "Failed to generate blog title" });
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

        return res.status(200).json({
            success: true,
            content: secure_url
        });

    } catch (error) {
        console.error("Error generating image:", error);
        return res.status(500).json({ message: "Failed to generate image" });
    }
};

export const removeImageBackground = async (req, res) => {
    try {
        const image = req.file;
        const { userId } = req.auth();
        const plan = req.plan;

        if (plan === 'free') {
            return res.status(403).json({ success: false, message: "This feature is only available to premium users." });
        }


        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        });
        await Creation.create({
            user_id: userId,
            prompt: 'Remove background from image',
            content: secure_url,
            type: "image",
        });

        return res.status(200).json({
            success: true,
            content: secure_url
        });

    } catch (error) {
        console.error("Error removing background of image:", error);
        return res.status(500).json({ message: "Failed to remove background of image" });
    }
};

export const removeImageObject = async (req, res) => {
    try {
        const image = req.file;
        const { object } = req.body;
        const { userId } = req.auth();
        const plan = req.plan;

        if (plan === 'free') {
            return res.status(403).json({ success: false, message: "This feature is only available to premium users." });
        }


        const { public_id } = await cloudinary.uploader.upload(image.path);
        const imageUrl = cloudinary.url(public_id, {
            transformation: [
                {
                    effect: `gen_remove:${object}`
                }
            ],
            resource_type: 'image'
        })
        await Creation.create({
            user_id: userId,
            prompt: `Remove ${object} from image`,
            content: imageUrl,
            type: "image",
        });

        return res.status(200).json({
            success: true,
            content: imageUrl
        });

    } catch (error) {
        console.error("Error removing object from image:", error);
        return res.status(500).json({ message: "Failed to remove object from image" });
    }
};

export const resumeReview = async (req, res) => {
  try {
    const resume = req.file;
    const { userId } = req.auth();
    const plan = req.plan;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (plan === "free") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available to premium users.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.status(413).json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);

    const text = await parsePDF(dataBuffer.buffer);

    if (fs.existsSync(resume.path)) {
      fs.unlinkSync(resume.path);
    }

    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty PDF content",
      });
    }

    const prompt = `
You are a professional resume reviewer.

Analyze the resume below and provide structured feedback:

1. Strengths
2. Weaknesses
3. Suggestions for improvement

Be clear, concise, and actionable.

Resume:
${text}
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 3000,
    });

    const responseText = response.choices[0].message.content;

    await Creation.create({
      user_id: userId,
      prompt,
      content: responseText,
      type: "resume-review",
    });

    return res.status(200).json({
      success: true,
      content: responseText,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyse resume",
    });
  }
};