import ai from "../config/ai.js";
import { clerkClient } from "@clerk/express";
import Creation from "../models/creation.js";

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

        //console.log("Generated Article:", responseText);

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